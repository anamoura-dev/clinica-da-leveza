# Checklist de lançamento — App Clínica da Leveza

Marque [x] conforme for fazendo. ✅ = já feito no app.

## No app (código) — pronto
- [x] ✅ Nome na tela do iPhone: **Leveza** (na loja: "Clínica da Leveza")
- [x] ✅ Ícone próprio (balão no céu) e tela de abertura com o balão — sem ícone padrão do Expo
- [x] ✅ Identificador do app: `br.com.aprendendoaserleve.app` (iOS e Android)
- [x] ✅ Declaração de criptografia (`ITSAppUsesNonExemptEncryption: false`) e textos de permissão
- [x] ✅ `eas.json` pronto para gerar o app instalável (perfis `preview` e `production`)
- [x] ✅ Excluir conta dentro do app (Perfil → "Excluir minha conta")
- [x] ✅ "Entrar com Apple" pronto no código (ligar em `src/constants/recursos.ts` → `APPLE_ATIVO`)
- [x] ✅ Nada de telas "em breve" visíveis: a Lupa some do menu enquanto `LUPA_ATIVA = false`
- [x] ✅ Política de privacidade dentro do app (Perfil → "Política de privacidade")
- [x] ✅ Links de ajuda no Perfil: agendar consulta, livros da Ana, e-mail e Instagram (os dois últimos aparecem quando preenchidos)
- [x] ✅ Agendamento pelo WhatsApp (sem guardar dados no app)
- [x] ✅ Consentimento antes de usar a IA (Lupa) — pronto para quando ela for ligada
- [x] ✅ Trava para adultos ao sair do Espaço das Crianças
- [x] ✅ Textos deixam claro: não é diagnóstico, não substitui profissional
- A 1ª versão sai **grátis e sem assinatura** (menos coisa para a Apple revisar). A assinatura (Leveza+) entra numa atualização.

## 1. Seus dados (preencher no código)
- [ ] `src/constants/clinica.ts`: e-mail, Instagram e CNPJ (só se a Ana Paula tiver; senão, a política mostra só o nome dela)
- [ ] `src/constants/clinica.ts` → `Agenda`: valores, regras do sinal, endereço, link do Tivita (quando a Ana Paula confirmar)
- [ ] Revisar a política (`docs/politica-de-privacidade.md`), de preferência com um(a) advogado(a)
- [ ] Publicar a política num link público — numa página do site da Ana Paula ou num Google Docs/Notion público (a Apple e o Google pedem esse link)

## 2. Conteúdo (Supabase)
- [ ] Trocar TODO conteúdo de exemplo por conteúdo de verdade (pauladas, ManuaLeve, Cafés, Jogos, Espaço das Crianças). A Apple reprova conteúdo "de mentirinha" (regra 2.1).
- [ ] Trocar o **Site URL** para `clinicadaleveza://auth` (hoje está com o endereço do Expo Go)

## 3. Google (login)
- [ ] Gerar uma nova chave secreta, trocar no Supabase e excluir a antiga (a antiga apareceu numa conversa)
- [ ] Tela de consentimento OAuth: nome "Clínica da Leveza", logo, link da política e do site; publicar em **"Em produção"**

## 4. Apple — conta
- [ ] Conta Apple Developer (US$ 99/ano) — pessoa física (mais rápido) ou empresa (precisa de D-U-N-S)
- [ ] Provedor Apple no Supabase + `APPLE_ATIVO = true` (**obrigatório**: quem oferece login com Google precisa oferecer "Entrar com Apple")

## 5. App instalável (EAS)
- [ ] `npm install -g eas-cli` e `eas login` (conta Expo grátis)
- [ ] `eas init` (liga o projeto à sua conta Expo)
- [ ] `eas build --platform ios --profile production` → `eas submit --platform ios`
- [ ] Testar pelo TestFlight: login Google/Apple, excluir conta, agendar, sem internet, iPhone SE e grande

## 6. App Store Connect (cadastro na loja)
- [ ] Nome: "Clínica da Leveza", subtítulo, descrição, palavras-chave
- [ ] Categoria: Saúde e fitness ou Educação — **não** "Kids"
- [ ] Classificação etária (questionário)
- [ ] "Privacidade do app": nome, e-mail, foto (conta), dados informados pelo usuário (apelido/ano das crianças), conteúdo do usuário (favoritos/progresso); nada usado para rastreamento
- [ ] Prints da loja (iPhone 6,9" ou 6,7") — fiéis ao app
- [ ] Link de suporte (uma página com contato: página no site da Ana Paula ou Linktree do Instagram) e link da política
- [ ] Notas para o revisor: login é opcional; "Conversar com a Ana" só abre o WhatsApp da profissional (nada é vendido nem pago no app); trava de adulto no Espaço das Crianças é uma conta de multiplicação
