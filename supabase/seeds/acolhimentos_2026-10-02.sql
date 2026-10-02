-- Frases de acolhimento — tela "Não sei. Só entrei." (02/10/2026)
-- Ficam na mesma tabela das pauladas, com uso = 'acolhimento' (não aparecem na abertura).
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Se rodar de novo, não duplica. Para tirar uma frase: Table Editor → pauladas → ativa = false.
-- (Textos para a Ana Paula revisar. O app já traz estas mesmas frases caso o banco esteja vazio.)

insert into pauladas (texto, ativa, uso)
select v.texto, true, 'acolhimento'
from (values
  ('Tudo bem não saber por onde começar. Você já começou: está aqui.'),
  ('Hoje pode ser só um respiro. Ninguém está te cobrando nada nesta tela.'),
  ('Cansaço não é sinal de que você está fazendo errado. Às vezes é só sinal de que está fazendo muito.'),
  ('Você não precisa ter todas as respostas para ser um lugar seguro para o seu filho.'),
  ('Nem todo dia é dia de aprender alguma coisa. Alguns dias são só para atravessar.'),
  ('Se hoje foi difícil, isso não apaga tudo o que você já construiu.'),
  ('Seu filho está em construção. Você também. E tudo bem.'),
  ('Pausa também é cuidado. Inclusive com você.'),
  ('Errar com seu filho não te desqualifica. Voltar para consertar também é educar.'),
  ('Antes de cuidar de alguém, vale perguntar: e você, como está?'),
  ('Não precisa chegar aqui inteiro. Pode chegar do jeito que dá.'),
  ('Às vezes, o melhor começo é parar um pouquinho.')
) as v(texto)
where not exists (select 1 from pauladas p where p.texto = v.texto);
