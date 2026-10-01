import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { ComponentProps, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BalaoAr } from '@/components/balao-ar';
import { Agenda, Clinica, preenchido, reais, TipoConsulta, valorDoSinal } from '@/constants/clinica';
import { Contorno, Cores, Destaques, Espaco, Fontes, Raio, t } from '@/constants/theme';

/**
 * "Quero agendar uma consulta": como funciona a consulta + um formulário curto que vira
 * uma mensagem de WhatsApp para a Ana Paula. Nada é salvo no app nem no banco:
 * ela confirma o horário, faz o cadastro no Tivita e envia o link do sinal.
 */

const COR = Destaques.lupa;
const PERIODOS = ['Manhã', 'Tarde', 'Noite'] as const;
const PARA_QUEM = [
  { id: 'adulto', texto: 'Para mim (adulto)' },
  { id: 'crianca', texto: 'Para uma criança ou adolescente' },
] as const;
type ParaQuem = (typeof PARA_QUEM)[number]['id'];

const soNumeros = (s: string) => s.replace(/\D/g, '');

function mascaraCelular(s: string) {
  const n = soNumeros(s).slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, n.length - 4)}-${n.slice(-4)}`;
}

function mascaraCpf(s: string) {
  const n = soNumeros(s).slice(0, 11);
  return n
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

function abrirWhatsApp(texto: string) {
  const url = `https://wa.me/${Agenda.whatsapp}?text=${encodeURIComponent(texto)}`;
  Linking.openURL(url).catch(() =>
    Alert.alert('Não deu para abrir o WhatsApp', `Chame a Ana Paula no número ${Agenda.whatsappExibicao}.`),
  );
}

export default function Agendar() {
  const [tipo, setTipo] = useState<TipoConsulta | null>(null);
  const [paraQuem, setParaQuem] = useState<ParaQuem | null>(null);
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [crianca, setCrianca] = useState('');
  const [periodos, setPeriodos] = useState<string[]>([]);
  const [dias, setDias] = useState('');
  const [tentouEnviar, setTentouEnviar] = useState(false);

  const faltando = [
    !tipo && 'o tipo de consulta',
    !paraQuem && 'para quem é',
    !nome.trim() && 'seu nome',
    soNumeros(celular).length < 10 && 'seu celular',
  ].filter(Boolean) as string[];

  function alternarPeriodo(p: string) {
    setPeriodos((atual) => (atual.includes(p) ? atual.filter((x) => x !== p) : [...atual, p]));
  }

  function enviar() {
    setTentouEnviar(true);
    if (faltando.length > 0 || !tipo) return;
    const linhas = [
      `Olá, Ana Paula! Vim pelo app ${Clinica.nome} e gostaria de agendar uma consulta. 🎈`,
      '',
      `*Consulta:* ${tipo.nome} (${reais(tipo.valor)})`,
      `*Para:* ${PARA_QUEM.find((p) => p.id === paraQuem)?.texto}`,
      paraQuem === 'crianca' && crianca.trim() ? `*Criança/adolescente:* ${crianca.trim()}` : null,
      '',
      `*Nome:* ${nome.trim()}`,
      `*Celular:* ${celular}`,
      email.trim() ? `*E-mail:* ${email.trim()}` : null,
      cpf.trim() ? `*CPF (para a nota fiscal):* ${cpf}` : null,
      '',
      periodos.length > 0 ? `*Melhores períodos:* ${periodos.join(', ')}` : null,
      dias.trim() ? `*Dias/horários:* ${dias.trim()}` : null,
      '',
      `Sei que o horário é confirmado com o sinal de ${Agenda.sinalPercentual}% (${reais(valorDoSinal(tipo.valor))}).`,
    ];
    abrirWhatsApp(
      linhas
        .filter((l) => l !== null)
        .join('\n')
        .replace(/\n{3,}/g, '\n\n'),
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Agendar consulta' }} />
      <KeyboardAvoidingView style={estilos.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          {/* Quem atende */}
          <View style={estilos.topo}>
            <BalaoAr largura={46} />
            <View style={{ flex: 1 }}>
              <Text style={estilos.nome}>{Agenda.profissional}</Text>
              <Text style={estilos.especialidade}>{Agenda.especialidade}</Text>
            </View>
          </View>
          <Text style={estilos.intro}>
            Vamos conversar? Escolha o tipo de consulta, conte um pouquinho sobre você e envie pelo WhatsApp. A Ana Paula
            responde para combinar o melhor horário.
          </Text>

          {/* Tipos de consulta */}
          <Text style={estilos.secao}>1. Tipo de consulta</Text>
          <View style={estilos.tipos}>
            {Agenda.consultas.map((c) => {
              const ativo = tipo?.id === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setTipo(c)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: ativo }}
                  style={({ pressed }) => [estilos.tipo, ativo && estilos.tipoAtivo, pressed && { opacity: 0.8 }]}>
                  <Ionicons name={c.icone} size={26} color={ativo ? '#FFFFFF' : COR.escura} />
                  <Text style={[estilos.tipoNome, ativo && estilos.textoBranco]}>{c.nome}</Text>
                  <Text style={[estilos.tipoDetalhe, ativo && estilos.textoBranco]}>{c.detalhe}</Text>
                  <Text style={[estilos.tipoValor, ativo && estilos.textoBranco]}>{reais(c.valor)}</Text>
                  <Text style={[estilos.tipoDetalhe, ativo && estilos.textoBranco]}>{c.duracao}</Text>
                </Pressable>
              );
            })}
          </View>
          {tipo?.id === 'presencial' && preenchido(Agenda.endereco) && (
            <View style={estilos.linhaInfo}>
              <Ionicons name="location-outline" size={18} color={COR.escura} />
              <Text style={estilos.infoTexto}>{Agenda.endereco}</Text>
            </View>
          )}

          {/* Sinal e regras */}
          <View style={estilos.cartaoSinal}>
            <Text style={estilos.sinalTitulo}>Sinal de {Agenda.sinalPercentual}% para confirmar</Text>
            {tipo && (
              <Text style={estilos.sinalValor}>
                {tipo.nome}: {reais(valorDoSinal(tipo.valor))}
              </Text>
            )}
            {Agenda.regras.map((r) => (
              <View key={r} style={estilos.regra}>
                <Text style={estilos.regraPonto}>•</Text>
                <Text style={estilos.regraTexto}>{r}</Text>
              </View>
            ))}
          </View>

          {/* Para quem */}
          <Text style={estilos.secao}>2. Para quem é a consulta?</Text>
          <View style={estilos.chips}>
            {PARA_QUEM.map((p) => (
              <Chip key={p.id} texto={p.texto} ativo={paraQuem === p.id} aoTocar={() => setParaQuem(p.id)} />
            ))}
          </View>
          {paraQuem === 'crianca' && (
            <Campo rotulo="Nome e idade da criança" valor={crianca} aoMudar={setCrianca} placeholder="Ex.: Pedro, 8 anos" />
          )}

          {/* Dados */}
          <Text style={estilos.secao}>3. Seus dados</Text>
          <Campo rotulo="Nome completo *" valor={nome} aoMudar={setNome} autoComplete="name" textContentType="name" />
          <Campo
            rotulo="Celular (WhatsApp) *"
            valor={celular}
            aoMudar={(v) => setCelular(mascaraCelular(v))}
            placeholder="(31) 99999-9999"
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
          />
          <Campo
            rotulo="E-mail"
            valor={email}
            aoMudar={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <Campo
            rotulo="CPF (para a nota fiscal)"
            valor={cpf}
            aoMudar={(v) => setCpf(mascaraCpf(v))}
            placeholder="000.000.000-00"
            keyboardType="number-pad"
            ajuda="Se preferir, você pode passar depois, direto pelo WhatsApp."
          />

          {/* Horários */}
          <Text style={estilos.secao}>4. Melhores horários para você</Text>
          <View style={estilos.chips}>
            {PERIODOS.map((p) => (
              <Chip key={p} texto={p} ativo={periodos.includes(p)} aoTocar={() => alternarPeriodo(p)} />
            ))}
          </View>
          <Campo rotulo="Dias ou horários de preferência" valor={dias} aoMudar={setDias} placeholder="Ex.: terças e quintas depois das 18h" />

          {tentouEnviar && faltando.length > 0 && (
            <Text style={estilos.faltando}>Falta preencher: {faltando.join(', ')}.</Text>
          )}

          <Pressable onPress={enviar} style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.85 }]}>
            <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
            <Text style={estilos.botaoTexto}>Enviar pelo WhatsApp</Text>
          </Pressable>

          {preenchido(Agenda.linkTivita) && (
            <Pressable onPress={() => Linking.openURL(Agenda.linkTivita)} style={estilos.botaoSecundario}>
              <Text style={estilos.botaoSecundarioTexto}>Fazer meu cadastro</Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => abrirWhatsApp(`Olá, Ana Paula! Vim pelo app ${Clinica.nome} e queria tirar uma dúvida.`)}
            hitSlop={8}
            style={estilos.duvida}>
            <Text style={estilos.duvidaTexto}>Só quero tirar uma dúvida</Text>
          </Pressable>

          <View style={estilos.linhaInfo}>
            <Ionicons name="lock-closed-outline" size={16} color={Cores.textoSuave} />
            <Text style={estilos.nota}>
              O app não guarda esses dados: eles vão só na mensagem que você envia pelo seu WhatsApp.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function Chip({ texto, ativo, aoTocar }: { texto: string; ativo: boolean; aoTocar: () => void }) {
  return (
    <Pressable
      onPress={aoTocar}
      accessibilityState={{ selected: ativo }}
      style={({ pressed }) => [estilos.chip, ativo && estilos.chipAtivo, pressed && { opacity: 0.8 }]}>
      <Text style={[estilos.chipTexto, ativo && estilos.textoBranco]}>{texto}</Text>
    </Pressable>
  );
}

function Campo({
  rotulo,
  valor,
  aoMudar,
  ajuda,
  ...props
}: {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  ajuda?: string;
} & Omit<ComponentProps<typeof TextInput>, 'value' | 'onChangeText'>) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.campoRotulo}>{rotulo}</Text>
      <TextInput
        {...props}
        value={valor}
        onChangeText={aoMudar}
        placeholderTextColor={Cores.textoClaro}
        style={estilos.entrada}
      />
      {ajuda && <Text style={estilos.ajuda}>{ajuda}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  conteudo: { padding: Espaco.lg, paddingBottom: Espaco.xl * 2, gap: Espaco.md },
  topo: { flexDirection: 'row', alignItems: 'center', gap: Espaco.md },
  nome: { fontFamily: Fontes.extra, fontSize: t(22), color: Cores.marinho },
  especialidade: { fontFamily: Fontes.media, fontSize: t(15), color: COR.escura },
  intro: { fontFamily: Fontes.regular, fontSize: t(15), lineHeight: t(22), color: Cores.texto },
  secao: { fontFamily: Fontes.extra, fontSize: t(17), color: Cores.marinho, marginTop: Espaco.sm },
  tipos: { flexDirection: 'row', gap: Espaco.sm + 4 },
  tipo: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Espaco.md,
    paddingHorizontal: Espaco.sm,
    borderRadius: Raio.md,
    backgroundColor: Cores.superficie,
    ...Contorno,
  },
  tipoAtivo: { backgroundColor: COR.escura },
  tipoNome: { fontFamily: Fontes.extra, fontSize: t(17), color: Cores.marinho, marginTop: 4 },
  tipoDetalhe: { fontFamily: Fontes.regular, fontSize: t(13), color: Cores.textoSuave, textAlign: 'center' },
  tipoValor: { fontFamily: Fontes.extra, fontSize: t(18), color: COR.escura, marginTop: 6 },
  textoBranco: { color: '#FFFFFF' },
  linhaInfo: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  infoTexto: { flex: 1, fontFamily: Fontes.media, fontSize: t(14), color: Cores.texto },
  cartaoSinal: { backgroundColor: COR.clara, borderRadius: Raio.md, padding: Espaco.md, gap: Espaco.sm },
  sinalTitulo: { fontFamily: Fontes.extra, fontSize: t(16), color: COR.escura },
  sinalValor: { fontFamily: Fontes.extra, fontSize: t(20), color: Cores.marinho, marginTop: -4 },
  regra: { flexDirection: 'row', gap: 6 },
  regraPonto: { fontFamily: Fontes.negrito, fontSize: t(14), color: COR.escura },
  regraTexto: { flex: 1, fontFamily: Fontes.regular, fontSize: t(14), lineHeight: t(20), color: Cores.texto },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Espaco.sm },
  chip: {
    borderWidth: 1.5,
    borderColor: COR.escura,
    borderRadius: Raio.pilula,
    paddingVertical: 9,
    paddingHorizontal: 16,
    backgroundColor: Cores.superficie,
  },
  chipAtivo: { backgroundColor: COR.escura },
  chipTexto: { fontFamily: Fontes.negrito, fontSize: t(14), color: COR.escura },
  campo: { gap: 6 },
  campoRotulo: { fontFamily: Fontes.negrito, fontSize: t(14), color: Cores.marinho },
  entrada: {
    backgroundColor: Cores.superficie,
    borderWidth: 1.5,
    borderColor: Cores.borda,
    borderRadius: Raio.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Fontes.regular,
    fontSize: t(16),
    color: Cores.texto,
  },
  ajuda: { fontFamily: Fontes.regular, fontSize: t(12), color: Cores.textoSuave },
  faltando: { fontFamily: Fontes.media, fontSize: t(14), color: Cores.erro, textAlign: 'center' },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
    backgroundColor: '#25A35A',
    borderRadius: Raio.pilula,
    paddingVertical: 16,
    marginTop: Espaco.sm,
    ...Contorno,
  },
  botaoTexto: { fontFamily: Fontes.extra, fontSize: t(17), color: '#FFFFFF' },
  botaoSecundario: {
    alignItems: 'center',
    borderRadius: Raio.pilula,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: COR.escura,
  },
  botaoSecundarioTexto: { fontFamily: Fontes.extra, fontSize: t(16), color: COR.escura },
  duvida: { alignSelf: 'center', padding: Espaco.sm },
  duvidaTexto: { fontFamily: Fontes.negrito, fontSize: t(15), color: COR.escura, textDecorationLine: 'underline' },
  nota: { flex: 1, fontFamily: Fontes.regular, fontSize: t(12), lineHeight: t(17), color: Cores.textoSuave },
});
