// ⚠️ Gerado a partir do mesmo texto de docs/politica-de-privacidade.md.
// Se mudar aqui, mude lá também (ou peça para o Claude regerar os dois).
// Marcadores {NOME}, {RAZAO}, {CNPJ}, {EMAIL}, {DATA} são trocados pelos dados de src/constants/clinica.ts.

export type SecaoPolitica = { titulo: string; paragrafos: string[] };

export const POLITICA_DE_PRIVACIDADE: SecaoPolitica[] = [
  {
    "titulo": "Quem somos",
    "paragrafos": [
      "Este aplicativo é oferecido pela {NOME} ({RAZAO}, CNPJ {CNPJ}). Nesta política explicamos, de forma simples, quais dados o app usa, para quê e quais são os seus direitos, de acordo com a Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018)."
    ]
  },
  {
    "titulo": "Usar o app sem conta",
    "paragrafos": [
      "Quase tudo no app funciona sem criar conta. Sem conta, não guardamos nenhum dado seu nos nossos servidores. As estrelas do Espaço das Crianças ficam guardadas só no seu celular, e os desenhos feitos no app não são salvos nem enviados para lugar nenhum."
    ]
  },
  {
    "titulo": "Agendamento de consultas",
    "paragrafos": [
      "Na tela “Quero agendar uma consulta” você pode pedir um agendamento. Os dados que você preenche (nome, celular, e-mail, CPF e preferências de horário) não são guardados pelo app nem pelos nossos servidores: eles só montam uma mensagem que você mesma(o) envia pelo seu WhatsApp para a profissional. A partir daí, o atendimento, o cadastro para a nota fiscal e o pagamento do sinal seguem fora do app, pelos canais da clínica."
    ]
  },
  {
    "titulo": "Dados que guardamos quando você cria uma conta",
    "paragrafos": [
      "A conta é opcional. Se você entrar com Google ou Apple, guardamos:",
      "• Nome, e-mail e foto do perfil, enviados pelo Google ou pela Apple no login. Você pode trocar o nome no app.",
      "• Sobre as crianças: apenas um apelido e o ano de nascimento, se você quiser cadastrar. Não pedimos nome completo, foto, escola nem documentos de crianças.",
      "• Seus favoritos (cafés, histórias e situações salvas).",
      "• Seu progresso (missões cumpridas no Espaço das Crianças e cenários jogados)."
    ]
  },
  {
    "titulo": "Para que usamos esses dados",
    "paragrafos": [
      "Usamos os dados só para fazer o app funcionar para você: mostrar seu perfil, guardar favoritos e progresso, e lembrar das crianças cadastradas. Não vendemos seus dados, não usamos para publicidade e não os compartilhamos para marketing.",
      "A base legal é a execução do serviço que você pediu ao criar a conta e o seu consentimento (LGPD, art. 7º, I e V). Os dados das crianças são informados pelo responsável e tratados no melhor interesse delas (LGPD, art. 14)."
    ]
  },
  {
    "titulo": "Com quem os dados são compartilhados",
    "paragrafos": [
      "Usamos alguns serviços de terceiros para o app funcionar:",
      "• Supabase: guarda os dados da conta e o conteúdo do app. Os servidores podem ficar fora do Brasil.",
      "• Google e Apple: fazem o login, quando você escolhe entrar com eles.",
      "• YouTube: exibe os vídeos dos Cafés. Ao assistir, valem também as regras de privacidade do YouTube.",
      "• Lupa IA (quando estiver disponível): as mensagens que você escrever para a Lupa são enviadas à Anthropic, empresa que fornece a inteligência artificial, apenas para gerar a resposta. O app pede sua autorização antes da primeira conversa e não guarda as conversas."
    ]
  },
  {
    "titulo": "Por quanto tempo guardamos",
    "paragrafos": [
      "Guardamos os dados enquanto sua conta existir. Quando você exclui a conta, apagamos o perfil, as crianças cadastradas, os favoritos e o progresso."
    ]
  },
  {
    "titulo": "Seus direitos",
    "paragrafos": [
      "Você pode, a qualquer momento: ver e corrigir seus dados (no Perfil), apagar crianças cadastradas, e excluir sua conta e todos os dados dela pelo botão \"Excluir minha conta\", no Perfil. Para qualquer outro pedido previsto na LGPD, fale com a gente pelo e-mail abaixo."
    ]
  },
  {
    "titulo": "Segurança",
    "paragrafos": [
      "Cada pessoa só consegue ver e alterar os próprios dados. A comunicação do app com os servidores é criptografada."
    ]
  },
  {
    "titulo": "Crianças",
    "paragrafos": [
      "O app é feito para mães, pais e cuidadores. O Espaço das Crianças foi pensado para ser usado junto com um adulto e não coleta dados das crianças: os sentimentos escolhidos e os desenhos não são enviados para nenhum servidor."
    ]
  },
  {
    "titulo": "Fale com a gente",
    "paragrafos": [
      "Dúvidas ou pedidos sobre seus dados: {EMAIL}.",
      "Esta política pode ser atualizada. Quando houver mudanças importantes, avisaremos no app. Última atualização: {DATA}."
    ]
  }
];
