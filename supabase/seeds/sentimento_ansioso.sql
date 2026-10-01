-- Espaço das Crianças: sentimento "Ansioso" 😰 com tudo dele:
-- o sentimento, uma história e duas missões.
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Pode rodar mais de uma vez: não duplica nada.

-- 1) O sentimento. Quem acolhe é a Lila, a tartaruga: devagar, uma respiração de cada vez.
insert into mundo_sentimentos (id, nome, emoji, cor, personagem_id, mensagem, ordem) values
  ('ansioso', 'Ansioso', '😰', '#8ED1C6', 'lila',
   'Quando a cabeça fica cheia de "e se...?", o coração acelera. Vamos devagar, no ritmo da tartaruga: uma respiração de cada vez.',
   5)
on conflict (id) do nothing;

-- 2) Ordem na tela: Feliz, Triste / Bravo, Com medo / Ansioso, Calmo
update mundo_sentimentos set ordem = 6 where id = 'calmo';

-- 3) Uma missão para quando a ansiedade aparece
insert into mundo_missoes (titulo, emoji, sentimento_id, descricao, passos, desenhar, ordem)
select 'Os 5 sentidos', '🖐️', 'ansioso', 'Para trazer a cabeça de volta para o agora.',
  '["Olhe em volta e encontre 5 coisas que você consegue ver", "Toque em 4 coisas e sinta como elas são", "Fique quietinho e escute 3 sons", "Descubra 2 cheiros perto de você", "Respire bem devagar 1 vez, enchendo a barriga"]'::jsonb,
  false, 6
where not exists (select 1 from mundo_missoes where titulo = 'Os 5 sentidos');

-- 4) Uma história sobre ansiedade
insert into mundo_historias (titulo, emoji, sentimento_id, personagem_id, paginas, pergunta_final, ordem)
select 'Lila e o dia da apresentação', '🐢', 'ansioso', 'lila',
  '[
    {"emoji": "🐢🏫", "texto": "Amanhã a Lila ia apresentar um trabalho para a turma inteira."},
    {"emoji": "🌙💭", "texto": "À noite, a cabeça não parava: e se eu esquecer? E se rirem de mim? E se der tudo errado?"},
    {"emoji": "💓🌀", "texto": "O coração batia rápido, a barriga ficava esquisita e o sono não vinha de jeito nenhum."},
    {"emoji": "🐙🤝", "texto": "O Tito percebeu e sentou do lado dela. Ele não disse que era bobagem. Disse só: vamos respirar juntos?"},
    {"emoji": "🌬️🎈", "texto": "Eles puxaram o ar contando até 4 e soltaram bem devagar contando até 6. Uma, duas, três vezes."},
    {"emoji": "📝📦", "texto": "Depois, a Lila escreveu as preocupações num papel e guardou numa caixinha. Elas continuavam lá, mas não precisavam ficar todas na cabeça."},
    {"emoji": "🐢🎤", "texto": "No dia seguinte, a voz tremeu um pouco no começo. E tudo bem. A Lila apresentou até o final."}
  ]'::jsonb,
  'O que costuma deixar você ansioso? O que ajuda o seu corpo a ficar mais calmo?',
  4
where not exists (select 1 from mundo_historias where titulo = 'Lila e o dia da apresentação');

-- 5) Mais uma missão: guardar as preocupações (termina no cantinho de desenhar)
insert into mundo_missoes (titulo, emoji, sentimento_id, descricao, passos, desenhar, ordem)
select 'Caixinha das preocupações', '📦', 'ansioso', 'Para tirar as preocupações da cabeça e guardar num lugar seguro.',
  '["Pense nas preocupações que estão na sua cabeça agora", "Desenhe ou escreva cada uma num papelzinho", "Guarde os papéis numa caixinha", "Combine com um adulto um horário para abrir a caixinha e conversar", "Pronto: a preocupação está guardada, e a cabeça pode descansar"]'::jsonb,
  true, 7
where not exists (select 1 from mundo_missoes where titulo = 'Caixinha das preocupações');

-- Conferir
select 'sentimento' as tipo, nome as titulo from mundo_sentimentos where id = 'ansioso'
union all select 'historia', titulo from mundo_historias where sentimento_id = 'ansioso'
union all select 'missao', titulo from mundo_missoes where sentimento_id = 'ansioso';
