# Checklist de lançamento — App Clínica da Leveza

Marque [x] conforme for fazendo. ✅ = já feito no app.

## No app (código)
- [x] ✅ Excluir conta dentro do app (Perfil → "Excluir minha conta")
- [x] ✅ "Entrar com Apple" pronto no código (ligar em `src/constants/recursos.ts` → `APPLE_ATIVO`)
- [x] ✅ Nada de telas "em breve" visíveis: a Lupa some do menu enquanto `LUPA_ATIVA = false`
- [x] ✅ Política de privacidade dentro do app (Perfil → "Política de privacidade")
- [x] ✅ "Fale com a gente" no Perfil (aparece quando o e-mail/Instagram estiverem preenchidos)
- [x] ✅ Consentimento antes de usar a IA (Lupa) — pronto para quando ela for ligada
- [x] ✅ Trava para adultos ao sair do Espaço das Crianças
- [x] ✅ Textos deixam claro: não é diagnóstico, não substitui profissional
- [ ] Assinatura (Leveza+) pelo sistema de compras da Apple, com "Restaurar compras" e termos visíveis

## Seus dados (preencher)
- [ ] `src/constants/clinica.ts`: razão social, CNPJ, e-mail, Instagram, site
- [ ] Revisar `docs/politica-de-privacidade.md` (de preferência com um(a) advogado(a))
- [ ] Publicar a política num link público (site da clínica, Notion público ou Google Docs "qualquer pessoa com o link")

## Supabase
- [ ] Conteúdo de verdade em todas as seções (pauladas, ManuaLeve, Cafés, Jogos, Espaço das Crianças)
- [ ] Trocar o **Site URL** para `clinicadaleveza://auth` (hoje está com o endereço do Expo Go)

## Google (login)
- [ ] Gerar uma nova chave secreta, trocar no Supabase e excluir a antiga (a antiga apareceu numa conversa)
- [ ] Tela de consentimento OAuth: preencher link da política de privacidade e publicar em **"Em produção"**

## Apple
- [ ] Conta Apple Developer (US$ 99/ano) — pessoa física (mais rápido) ou empresa (precisa de D-U-N-S)
- [ ] Provedor Apple no Supabase + `APPLE_ATIVO = true`
- [ ] App no App Store Connect: nome, descrição, palavras-chave, categoria (Saúde e fitness ou Educação — **não** "Kids")
- [ ] Classificação etária (questionário)
- [ ] "Privacidade do app" (formulário): dados coletados = nome, e-mail, foto, dados informados pelo usuário (apelido/ano das crianças), conteúdo do usuário (favoritos/progresso); não usados para rastreamento
- [ ] Prints da loja (iPhone 6,7" e 6,5") — fiéis ao app
- [ ] Link de suporte (site, Instagram ou e-mail) e link da política
- [ ] Notas para o revisor: o login é opcional; como testar (ex.: entrar com uma conta Google de teste)

## Antes de enviar
- [ ] Testar o app instalado (build do EAS), não só no Expo Go
- [ ] Testar sem internet: mensagens de erro aparecem e o botão "Tentar de novo" funciona
- [ ] Testar num iPhone pequeno (SE) e num grande
