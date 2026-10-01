import { Ionicons } from '@expo/vector-icons';
import type { User } from '@supabase/supabase-js';
import { Image } from 'expo-image';
import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BalaoFlutuante } from '@/components/balao-ar';
import { Ceu } from '@/components/ceu';
import {
  adicionarFilho,
  buscarConta,
  Favorito,
  Filho,
  idade,
  removerFilho,
  salvarNome,
} from '@/components/conta/dados';
import { APPLE_ATIVO, entrarComApple, entrarComGoogle, excluirConta, sair, useSessao } from '@/components/conta/sessao';
import { sincronizarMissoes } from '@/components/mundo/dados';
import { Carregando, Erro } from '@/components/ui';
import { Agenda, Clinica, preenchido } from '@/constants/clinica';
import { Contorno, Cores, Espaco, Fontes, Raio, t } from '@/constants/theme';
import { useDados } from '@/hooks/use-dados';

export default function Perfil() {
  const { usuario, carregando } = useSessao();
  if (carregando) return <Carregando />;
  return usuario ? <MinhaConta usuario={usuario} /> : <Entrar />;
}

// ---------------------------------------------------------------- Ajuda (com e sem login)

/** "Fale com a gente" e "Privacidade" — a Apple pede um caminho de suporte e a política. */
function LinksAjuda() {
  const links: { icone: keyof typeof Ionicons.glyphMap; texto: string; abrir: () => void }[] = [
    { icone: 'logo-whatsapp', texto: 'Agendar uma consulta', abrir: () => router.push('/agendar') },
  ];
  if (preenchido(Clinica.email)) {
    links.push({ icone: 'mail-outline', texto: 'Fale com a gente', abrir: () => Linking.openURL(`mailto:${Clinica.email}`) });
  }
  if (preenchido(Clinica.instagram)) {
    links.push({
      icone: 'logo-instagram',
      texto: `@${Clinica.instagram}`,
      abrir: () => Linking.openURL(`https://instagram.com/${Clinica.instagram}`),
    });
  }
  links.push({ icone: 'book-outline', texto: 'Livros da Ana', abrir: () => Linking.openURL(Agenda.siteLivros) });
  links.push({ icone: 'shield-checkmark-outline', texto: 'Política de privacidade', abrir: () => router.push('/privacidade') });

  return (
    <View style={estilos.cartao}>
      {links.map((l) => (
        <Pressable key={l.texto} onPress={l.abrir} style={({ pressed }) => [estilos.link, pressed && { opacity: 0.7 }]}>
          <Ionicons name={l.icone} size={20} color={Cores.marinho} />
          <Text style={estilos.linkTexto}>{l.texto}</Text>
          <Ionicons name="chevron-forward" size={18} color={Cores.textoClaro} />
        </Pressable>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------- Sem login

function Entrar() {
  const insets = useSafeAreaInsets();
  const [entrando, setEntrando] = useState<'google' | 'apple' | null>(null);

  async function entrar(qual: 'google' | 'apple') {
    setEntrando(qual);
    try {
      await (qual === 'google' ? entrarComGoogle() : entrarComApple());
    } catch (e) {
      Alert.alert('Não deu para entrar', e instanceof Error ? e.message : 'Tente de novo.');
    } finally {
      setEntrando(null);
    }
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={{ paddingBottom: Espaco.xl }}>
      <View style={[estilos.ceu, { paddingTop: insets.top + Espaco.lg }]}>
        <Ceu nuvens={[{ x: '8%', y: 40, largura: 80 }, { x: '66%', y: 90, largura: 100 }]} />
        <BalaoFlutuante largura={72} amplitude={8} />
        <Text style={estilos.titulo}>Seu cantinho na Leveza</Text>
        <Text style={estilos.subtitulo}>Entre para guardar o que é seu.</Text>
      </View>

      <View style={estilos.corpo}>
        <View style={estilos.cartao}>
          {[
            ['❤️', 'Favoritos', 'Cafés, histórias e situações salvos com um toque'],
            ['🧒', 'Meus filhos', 'Só o apelido e a idade, para a gente se lembrar'],
            ['⭐', 'Progresso', 'Estrelas e fases guardadas mesmo se trocar de celular'],
          ].map(([emoji, titulo, texto]) => (
            <View key={titulo} style={estilos.beneficio}>
              <Text style={estilos.beneficioEmoji}>{emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={estilos.beneficioTitulo}>{titulo}</Text>
                <Text style={estilos.beneficioTexto}>{texto}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => entrar('google')}
          disabled={!!entrando}
          style={({ pressed }) => [estilos.botaoEntrar, estilos.botaoGoogle, pressed && estilos.pressionado]}>
          {entrando === 'google' ? (
            <ActivityIndicator color={Cores.marinho} />
          ) : (
            <Ionicons name="logo-google" size={20} color={Cores.marinho} />
          )}
          <Text style={[estilos.botaoEntrarTexto, { color: Cores.marinho }]}>Continuar com Google</Text>
        </Pressable>

        {APPLE_ATIVO && Platform.OS === 'ios' && (
          <Pressable
            onPress={() => entrar('apple')}
            disabled={!!entrando}
            style={({ pressed }) => [estilos.botaoEntrar, estilos.botaoApple, pressed && estilos.pressionado]}>
            {entrando === 'apple' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
            )}
            <Text style={[estilos.botaoEntrarTexto, { color: '#FFFFFF' }]}>Continuar com Apple</Text>
          </Pressable>
        )}

        <LinksAjuda />

        <Text style={estilos.nota}>
          A conta é opcional: o app continua todo aberto sem ela. Seus dados ficam só com você, e dá para excluir tudo
          quando quiser.
        </Text>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------- Com login

function MinhaConta({ usuario }: { usuario: User }) {
  const carregar = useCallback(async () => {
    await sincronizarMissoes(); // estrelas que estavam só no celular vão para a conta
    return buscarConta(usuario.id);
  }, [usuario.id]);
  const { dados, carregando, erro, tentarDeNovo, atualizar, versao } = useDados(carregar);

  // Ao voltar para a aba (ex.: depois de favoritar algo), atualiza em silêncio.
  useFocusEffect(atualizar);

  if (carregando && !dados) return <Carregando />;
  if (erro || !dados) return <Erro mensagem={erro ?? 'Algo deu errado.'} onTentar={tentarDeNovo} />;
  return <Conta key={versao} usuario={usuario} dados={dados} />;
}

const ICONE_FAVORITO: Record<Favorito['tipo'], string> = { cafe: '☕', historia: '📖', manualeve: '🔍' };
const ROTA_FAVORITO = (f: Favorito): Href =>
  f.tipo === 'cafe' ? `/cafe/${f.item_id}` : f.tipo === 'historia' ? `/mundo/historia/${f.item_id}` : `/manualeve/${f.item_id}`;

function Conta({ usuario, dados }: { usuario: User; dados: Awaited<ReturnType<typeof buscarConta>> }) {
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState(dados.perfil.nome ?? '');
  const [editandoNome, setEditandoNome] = useState(false);
  const [filhos, setFilhos] = useState<Filho[]>(dados.filhos);
  const [novoApelido, setNovoApelido] = useState('');
  const [novoAno, setNovoAno] = useState('');
  const [adicionando, setAdicionando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const nomeMostrado = nome || usuario.email?.split('@')[0] || 'Você';
  const inicial = nomeMostrado.trim().charAt(0).toUpperCase();

  async function guardarNome() {
    setEditandoNome(false);
    try {
      await salvarNome(usuario.id, nome);
    } catch {
      Alert.alert('Ops', 'Não foi possível salvar o nome.');
    }
  }

  async function guardarFilho() {
    const ano = novoAno ? Number(novoAno) : null;
    const anoAtual = new Date().getFullYear();
    if (!novoApelido.trim()) return;
    if (ano !== null && (!Number.isInteger(ano) || ano < anoAtual - 25 || ano > anoAtual)) {
      Alert.alert('Ano de nascimento', `Digite um ano entre ${anoAtual - 25} e ${anoAtual}.`);
      return;
    }
    setSalvando(true);
    try {
      const filho = await adicionarFilho(novoApelido, ano);
      setFilhos((atuais) => [...atuais, filho]);
      setNovoApelido('');
      setNovoAno('');
      setAdicionando(false);
    } catch {
      Alert.alert('Ops', 'Não foi possível salvar agora.');
    } finally {
      setSalvando(false);
    }
  }

  function confirmarRemover(filho: Filho) {
    Alert.alert('Remover', `Remover ${filho.apelido} do seu perfil?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          setFilhos((atuais) => atuais.filter((f) => f.id !== filho.id));
          try {
            await removerFilho(filho.id);
          } catch {
            setFilhos((atuais) => [...atuais, filho]);
          }
        },
      },
    ]);
  }

  function confirmarExcluir() {
    Alert.alert(
      'Excluir minha conta',
      'Isso apaga sua conta e tudo que está nela (filhos, favoritos e progresso). Não dá para desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirConta();
            } catch (e) {
              Alert.alert('Ops', e instanceof Error ? e.message : 'Tente de novo.');
            }
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={{ paddingBottom: Espaco.xl * 2 }} keyboardShouldPersistTaps="handled">
      {/* Cabeçalho com foto e nome */}
      <View style={[estilos.ceu, { paddingTop: insets.top + Espaco.lg }]}>
        <Ceu nuvens={[{ x: '6%', y: 30, largura: 70 }, { x: '70%', y: 70, largura: 90 }]} />
        {dados.perfil.foto_url ? (
          <Image source={{ uri: dados.perfil.foto_url }} style={estilos.foto} contentFit="cover" />
        ) : (
          <View style={[estilos.foto, estilos.fotoInicial]}>
            <Text style={estilos.inicial}>{inicial}</Text>
          </View>
        )}
        {editandoNome ? (
          <View style={estilos.linhaNome}>
            <TextInput
              value={nome}
              onChangeText={setNome}
              autoFocus
              maxLength={60}
              placeholder="Seu nome"
              placeholderTextColor={Cores.textoClaro}
              style={estilos.entradaNome}
              onSubmitEditing={guardarNome}
              returnKeyType="done"
            />
            <Pressable onPress={guardarNome} hitSlop={10} accessibilityLabel="Salvar nome">
              <Ionicons name="checkmark-circle" size={30} color={Cores.verdeEscuro} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setEditandoNome(true)} style={estilos.linhaNome} accessibilityLabel="Editar nome">
            <Text style={estilos.nome}>{nomeMostrado}</Text>
            <Ionicons name="pencil" size={16} color={Cores.marinho} />
          </Pressable>
        )}
        {usuario.email && <Text style={estilos.email}>{usuario.email}</Text>}
      </View>

      <View style={estilos.corpo}>
        {/* Progresso */}
        <View style={estilos.progresso}>
          <View style={[estilos.numero, { backgroundColor: Cores.amareloClaro }]}>
            <Text style={estilos.numeroValor}>⭐ {dados.missoes}</Text>
            <Text style={estilos.numeroRotulo}>missões cumpridas</Text>
          </View>
          <View style={[estilos.numero, { backgroundColor: Cores.azulClaro }]}>
            <Text style={estilos.numeroValor}>🎮 {dados.cenarios}</Text>
            <Text style={estilos.numeroRotulo}>cenários jogados</Text>
          </View>
        </View>

        {/* Meus filhos */}
        <Text style={estilos.secao}>Meus filhos</Text>
        <View style={estilos.cartao}>
          {filhos.length === 0 && !adicionando && (
            <Text style={estilos.vazio}>Conte pra gente quem são as crianças da sua vida.</Text>
          )}
          {filhos.map((f) => (
            <View key={f.id} style={estilos.filho}>
              <View style={estilos.filhoBolinha}>
                <Text style={estilos.filhoInicial}>{f.apelido.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={estilos.filhoNome}>{f.apelido}</Text>
                {idade(f.ano_nascimento) && <Text style={estilos.filhoIdade}>{idade(f.ano_nascimento)}</Text>}
              </View>
              <Pressable onPress={() => confirmarRemover(f)} hitSlop={10} accessibilityLabel={`Remover ${f.apelido}`}>
                <Ionicons name="trash-outline" size={20} color={Cores.textoSuave} />
              </Pressable>
            </View>
          ))}

          {adicionando ? (
            <View style={estilos.formFilho}>
              <TextInput
                value={novoApelido}
                onChangeText={setNovoApelido}
                placeholder="Apelido (ex.: Pedrinho)"
                placeholderTextColor={Cores.textoClaro}
                maxLength={40}
                autoFocus
                style={[estilos.entrada, { flex: 2 }]}
              />
              <TextInput
                value={novoAno}
                onChangeText={(texto) => setNovoAno(texto.replace(/\D/g, '').slice(0, 4))}
                placeholder="Ano nasc."
                placeholderTextColor={Cores.textoClaro}
                keyboardType="number-pad"
                style={[estilos.entrada, { flex: 1 }]}
              />
              <Pressable
                onPress={guardarFilho}
                disabled={salvando || !novoApelido.trim()}
                style={[estilos.botaoMini, (!novoApelido.trim() || salvando) && { opacity: 0.4 }]}
                accessibilityLabel="Salvar">
                <Ionicons name="checkmark" size={22} color={Cores.marinho} />
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => setAdicionando(true)} style={estilos.adicionar}>
              <Ionicons name="add-circle-outline" size={22} color={Cores.azulEscuro} />
              <Text style={estilos.adicionarTexto}>Adicionar criança</Text>
            </Pressable>
          )}
        </View>
        <Text style={estilos.nota}>Guardamos só o apelido e o ano de nascimento. Nada de nome completo.</Text>

        {/* Favoritos */}
        <Text style={estilos.secao}>Favoritos</Text>
        <View style={estilos.cartao}>
          {dados.favoritos.length === 0 ? (
            <Text style={estilos.vazio}>Toque no ♡ de um café, história ou situação para salvar aqui.</Text>
          ) : (
            dados.favoritos.map((f) => (
              <Pressable
                key={`${f.tipo}-${f.item_id}`}
                onPress={() => router.push(ROTA_FAVORITO(f))}
                style={({ pressed }) => [estilos.favorito, pressed && { opacity: 0.7 }]}>
                <Text style={estilos.favoritoEmoji}>{ICONE_FAVORITO[f.tipo]}</Text>
                <Text style={estilos.favoritoTitulo} numberOfLines={2}>
                  {f.titulo ?? 'Sem título'}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={Cores.textoClaro} />
              </Pressable>
            ))
          )}
        </View>

        {/* Ajuda e privacidade */}
        <Text style={estilos.secao}>Ajuda</Text>
        <LinksAjuda />

        {/* Conta */}
        <Pressable onPress={sair} style={({ pressed }) => [estilos.botaoSair, pressed && estilos.pressionado]}>
          <Ionicons name="log-out-outline" size={20} color={Cores.marinho} />
          <Text style={estilos.botaoSairTexto}>Sair da conta</Text>
        </Pressable>
        <Pressable onPress={confirmarExcluir} hitSlop={8} style={{ alignSelf: 'center' }}>
          <Text style={estilos.excluir}>Excluir minha conta</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  ceu: {
    alignItems: 'center',
    paddingBottom: Espaco.lg,
    paddingHorizontal: Espaco.lg,
    borderBottomLeftRadius: Raio.lg,
    borderBottomRightRadius: Raio.lg,
    overflow: 'hidden',
    gap: 6,
  },
  titulo: {
    fontFamily: Fontes.extra,
    fontSize: t(24),
    color: Cores.marinho,
    marginTop: Espaco.sm,
  },
  subtitulo: {
    fontFamily: Fontes.media,
    fontSize: t(15),
    color: Cores.textoSuave,
  },
  corpo: {
    padding: Espaco.lg,
    gap: Espaco.md,
  },
  cartao: {
    backgroundColor: Cores.superficie,
    borderRadius: Raio.md,
    padding: Espaco.md,
    gap: Espaco.md,
    ...Contorno,
  },
  beneficio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
  },
  beneficioEmoji: {
    fontSize: t(26),
  },
  beneficioTitulo: {
    fontFamily: Fontes.extra,
    fontSize: t(16),
    color: Cores.marinho,
  },
  beneficioTexto: {
    fontFamily: Fontes.regular,
    fontSize: t(14),
    color: Cores.textoSuave,
  },
  botaoEntrar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm + 2,
    height: 54,
    borderRadius: Raio.pilula,
    ...Contorno,
  },
  botaoGoogle: {
    backgroundColor: Cores.superficie,
  },
  botaoApple: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  botaoEntrarTexto: {
    fontFamily: Fontes.extra,
    fontSize: t(16),
  },
  nota: {
    fontFamily: Fontes.regular,
    fontSize: t(13),
    lineHeight: t(18),
    color: Cores.textoSuave,
    textAlign: 'center',
  },
  pressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  foto: {
    width: 92,
    height: 92,
    borderRadius: 46,
    ...Contorno,
    borderWidth: 3,
  },
  fotoInicial: {
    backgroundColor: Cores.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: {
    fontFamily: Fontes.extra,
    fontSize: t(38),
    color: Cores.marinho,
  },
  linhaNome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
    marginTop: Espaco.sm,
  },
  nome: {
    fontFamily: Fontes.extra,
    fontSize: t(22),
    color: Cores.marinho,
  },
  entradaNome: {
    minWidth: 180,
    fontFamily: Fontes.extra,
    fontSize: t(20),
    color: Cores.marinho,
    backgroundColor: Cores.superficie,
    borderRadius: Raio.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...Contorno,
  },
  email: {
    fontFamily: Fontes.regular,
    fontSize: t(13),
    color: Cores.textoSuave,
  },
  progresso: {
    flexDirection: 'row',
    gap: Espaco.md,
  },
  numero: {
    flex: 1,
    borderRadius: Raio.md,
    padding: Espaco.md,
    alignItems: 'center',
    ...Contorno,
  },
  numeroValor: {
    fontFamily: Fontes.extra,
    fontSize: t(24),
    color: Cores.marinho,
  },
  numeroRotulo: {
    fontFamily: Fontes.media,
    fontSize: t(13),
    color: Cores.textoSuave,
  },
  secao: {
    fontFamily: Fontes.extra,
    fontSize: t(19),
    color: Cores.marinho,
    marginTop: Espaco.sm,
    marginBottom: -Espaco.xs,
  },
  vazio: {
    fontFamily: Fontes.regular,
    fontSize: t(15),
    color: Cores.textoSuave,
  },
  filho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
  },
  filhoBolinha: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Cores.verdeClaro,
    alignItems: 'center',
    justifyContent: 'center',
    ...Contorno,
  },
  filhoInicial: {
    fontFamily: Fontes.extra,
    fontSize: t(18),
    color: Cores.verdeEscuro,
  },
  filhoNome: {
    fontFamily: Fontes.extra,
    fontSize: t(16),
    color: Cores.marinho,
  },
  filhoIdade: {
    fontFamily: Fontes.regular,
    fontSize: t(13),
    color: Cores.textoSuave,
  },
  formFilho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  entrada: {
    height: 44,
    borderRadius: Raio.sm,
    paddingHorizontal: 12,
    fontFamily: Fontes.media,
    fontSize: t(15),
    color: Cores.marinho,
    backgroundColor: Cores.fundo,
    ...Contorno,
  },
  botaoMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Cores.amarelo,
    alignItems: 'center',
    justifyContent: 'center',
    ...Contorno,
  },
  adicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.sm,
  },
  adicionarTexto: {
    fontFamily: Fontes.extra,
    fontSize: t(15),
    color: Cores.azulEscuro,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
  },
  linkTexto: {
    flex: 1,
    fontFamily: Fontes.media,
    fontSize: t(15),
    color: Cores.marinho,
  },
  favorito: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Espaco.md,
  },
  favoritoEmoji: {
    fontSize: t(22),
  },
  favoritoTitulo: {
    flex: 1,
    fontFamily: Fontes.media,
    fontSize: t(15),
    color: Cores.marinho,
  },
  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Espaco.sm,
    height: 50,
    borderRadius: Raio.pilula,
    backgroundColor: Cores.superficie,
    marginTop: Espaco.md,
    ...Contorno,
  },
  botaoSairTexto: {
    fontFamily: Fontes.extra,
    fontSize: t(16),
    color: Cores.marinho,
  },
  excluir: {
    fontFamily: Fontes.media,
    fontSize: t(14),
    color: Cores.erro,
    textDecorationLine: 'underline',
    marginTop: Espaco.sm,
  },
});
