-- Pauladas — lote de 30 frases (01/10/2026)
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Entram ativas e na abertura do app. Se rodar de novo, não duplica (pula frases que já existem).

insert into pauladas (texto, ativa, uso)
select v.texto, true, 'abertura'
from (values
  ('Seu filho não está dando trabalho. Talvez ele esteja dando uma informação.'),
  ('Tem coisa que você chama de personalidade porque não quer chamar de responsabilidade.'),
  ('Nem todo limite que seu filho testa precisa virar uma reunião de condomínio.'),
  ('Você quer uma criança autônoma, mas ainda administra até o estojo escolar dela? Aponta lápis, renova o marca-texto e repete tudo isso semanalmente?'),
  ('Às vezes, proteger seu filho do desconforto é só uma forma aparentemente nobre de tirar o direito dele de aprender.'),
  ('Você não precisa concordar com seu filho para compreendê-lo e respeitá-lo.'),
  ('Amor não transforma comportamento inadequado em comportamento aceitável.'),
  ('Seu filho pode estar precisando de ajuda. E você pode estar precisando rever a forma como está ajudando.'),
  ('Tem adulto chamando de “fase” aquilo que já virou padrão.'),
  ('Nem toda criança que chora precisa ser convencida a parar. Algumas precisam descobrir que podem continuar e sobreviver ao próprio choro.'),
  ('Você não precisa criar uma criança que nunca sofra. Precisa criar alguém que saiba atravessar o que sente.'),
  ('Às vezes você não está cansado de educar. Está cansado de fazer pelo outro o que o outro já poderia fazer.'),
  ('Se toda frustração do seu filho vira emergência, ele nunca descobre que frustração não mata.'),
  ('Seu filho não precisa ganhar todas as discussões. E você também não.'),
  ('Tem criança ocupando um lugar enorme na família porque os adultos deixaram em descuido espaço demais.'),
  ('Você pode estar chamando de ansiedade da criança aquilo que a família inteira está ensinando a ela a temer.'),
  ('Não é porque seu filho consegue fazer sozinho que ele vai querer fazer sozinho. Bem-vindo ao maravilhoso mundo da incoerência.'),
  ('Seu filho não precisa ser excelente em tudo. Mas precisa aprender que fazer a própria parte não é um talento especial.'),
  ('Você quer que seu filho respeite limites, mas o primeiro limite que ele encontra é a largura da sua paciência.'),
  ('Tem adulto esperando maturidade dos outros enquanto negocia diariamente com a própria imaturidade.'),
  ('Você não é um Pokémon. Seu filho também não. Ninguém vai evoluir porque você apertou um botão (da pressa).'),
  ('A gente quer os louros da mudança, mas quer pular a parte em que precisa repetir o básico até cansar.'),
  ('Talvez você não precise de uma nova estratégia. Talvez precise parar de abandonar a antiga no terceiro dia.'),
  ('Tem coisa que não precisa de mais explicação. Precisa de repetição.'),
  ('Você está sempre ensinando seu filho pelo exemplo, mesmo sem dizer ou sem perceber.'),
  ('Seu filho aprende muito sobre respeito observando o que você faz quando está com raiva.'),
  ('Nem tudo que incomoda precisa ser corrigido. Algumas coisas precisam ser compreendidas. Outras precisam mesmo ser ajustadas. Descobrir a diferença é o trabalho.'),
  ('Você pode amar profundamente alguém e, ainda assim, precisar dizer: “isso não está bom”.'),
  ('O problema de esperar uma grande transformação é esquecer que quase tudo importante foi construído no ordinário.'),
  ('Talvez a pessoa que você está esperando que mude esteja esperando exatamente a mesma coisa de você.')
) as v(texto)
where not exists (select 1 from pauladas p where p.texto = v.texto);

-- Conferir: quantas pauladas de abertura estão ativas agora
select count(*) as pauladas_ativas from pauladas where ativa and uso = 'abertura';
