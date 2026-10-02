-- ManuaLeve — os 15 capítulos do livro da Ana Paula (versão "ajustado", 02/10/2026)
-- Antes, rode a migração supabase/migrations/20261002120000_manualeve_capitulos.sql.
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Pode rodar de novo: se o texto mudar, ele ATUALIZA o capítulo (não duplica).

insert into manualeve_capitulos (id, numero, titulo, tema, emoji, historia, fala, traducao, quando_buscar_ajuda, pergunta, ordem) values

('vendaval', 1, 'Quando tudo vira um vendaval', null, '🌪️',
$$Tem horas que parece que alguém apertou um botão dentro de mim.

Eu estava bem. De repente… não estou mais.

O barulho fica alto. O corpo fica quente. A cabeça fica confusa.

É como se eu fosse uma panela de pressão sem válvula.

Então eu explodo.

Choro. Grito. Jogo coisas. Me jogo no chão também (sim, eu sei que é dramático… mas na hora parece necessário).$$,
$$Não estou contra você. Estou contra um sentimento gigante que apareceu aqui dentro.$$,
$$Isso se chama desregulação emocional.

Em português claro: a criança perdeu o acesso ao freio interno.

O cérebro infantil ainda está em construção. Autorregulação é habilidade aprendida, não botão de fábrica.

Nessas horas, o adulto funciona como:
🧭 bússola
🪵 tronco firme no meio da enchente
📉 regulador emprestado$$,
$$Mas atenção importante:

Se as crises são muito frequentes, muito intensas, ou começam a prejudicar relações, escola ou rotina familiar, é essencial buscar avaliação profissional.

Manual ajuda a entender. Especialista ajuda a intervir.

Cada criança precisa de um olhar não protocolável.$$,
$$Quando meu filho perde o controle, eu tento vencer a crise ou ajudar o sistema emocional dele a aprender a se organizar?$$,
1),

('birra', 2, 'A famosa birra', null, '🍭',
$$Quando você diz “não”, parece que alguém desligou meu desenho favorito no meio.

Sem aviso. Sem trilha sonora de encerramento.

Meu desejo estava lá em cima… e de repente caiu igual Wi-Fi ruim.

Meu corpo fica quente. Minha garganta vira sirene. Minhas pernas querem protestar.$$,
$$Eu não estou tentando te vencer. Estou tentando sobreviver ao tamanho do que eu senti.$$,
$$Birra é neurociência acontecendo ao vivo na sua sala.

O cérebro emocional da criança (sistema límbico) é tipo um gerente hiperativo.

Já o cérebro racional (córtex pré-frontal) ainda é estagiário.

Resultado: emoção decide… antes da razão chegar.

Frustração dói de verdade no cérebro infantil. Não é frescura. Mas também não significa que o limite deva desaparecer.$$,
$$Importante:
• birras muito intensas ou persistentes
• sofrimento prolongado
• impacto em escola ou relações

merecem avaliação profissional.

Manual orienta. Acompanhamento personaliza.$$,
$$Eu estou ensinando meu filho a tolerar frustração ou apenas tentando silenciar o barulho da emoção dele?$$,
2),

('mao-fala-primeiro', 3, 'Quando a mão fala primeiro', 'Agressividade', '🥊',
$$Tem hora que algo aqui dentro fica perigoso.

Não sei explicar direito. Só sei que fico em modo “defesa ninja”.

Antes que eu perceba… minha mão já resolveu a situação.$$,
$$Eu não queria machucar. Eu queria parar de sentir isso.$$,
$$A agressividade infantil costuma ser um cérebro em alarme.

A amígdala cerebral — nosso detector de ameaças — fica hiperativa.

E o freio racional ainda não está pronto para negociar.

Ou seja: a criança não está pensando. Está reagindo.

Interromper o comportamento é necessário. Ensinar alternativas é essencial.$$,
$$Mas agressividade frequente, intensa ou crescente precisa de investigação ampla:
• família
• rotina
• vínculos
• desenvolvimento
• regulação sensorial

Nada disso é protocolável.$$,
$$Estou enxergando apenas o tapa ou o medo que veio antes dele?$$,
3),

('silencio', 4, 'O silêncio que faz barulho', null, '🤐',
$$Eu não grito. Eu não reclamo.

Eu só guardo.

É como ter uma mochila invisível cheia de sentimentos.

Pesada. Mas ninguém vê.$$,
$$Eu fico quieto porque não sei se posso ser eu mesmo.$$,
$$Algumas crianças regulam emoções se encolhendo.

O cérebro aprende cedo que expressar pode ser arriscado.

Isso pode gerar adaptação excessiva. Ou ansiedade silenciosa.

Quietude não é sempre tranquilidade.$$,
$$Mudanças bruscas de comportamento, isolamento ou sofrimento interno merecem olhar especializado.

Manual observa sinais. Profissional investiga profundidade.$$,
$$Meu filho está em paz ou apenas tentando não incomodar?$$,
4),

('grude', 5, 'O grude oficial', null, '🧸',
$$Eu sei que às vezes pareço chiclete emocional.

Mas é que quando você sai… meu mundo fica meio sem Wi-Fi afetivo.$$,
$$Ficar perto de você me ajuda a organizar o caos aqui dentro.$$,
$$O cérebro infantil precisa de co-regulação.

Presença do adulto ativa circuitos de segurança. Literalmente.

Com o tempo, isso vira autorregulação.

Dependência saudável é ponte para autonomia.$$,
$$Mas ansiedade intensa de separação ou sofrimento extremo precisa de avaliação individualizada.

Cada família tem sua dança.$$,
$$Estou vendo manha ou necessidade legítima de segurança?$$,
5),

('sono', 6, 'A novela do sono', null, '🌙',
$$Quando a luz apaga, meus pensamentos fazem festa.

Replay do dia. Replay das emoções. Replay de tudo.

Dormir parece desligar do mundo… e eu ainda não sei se isso é seguro.$$,
$$Eu não estou te testando. Estou tentando me sentir protegido.$$,
$$Sono depende de regulação do sistema nervoso.

Cérebro agitado = corpo desperto.

Rotina previsível ajuda o cérebro a antecipar descanso.$$,
$$Mas insônia persistente, terror noturno ou ansiedade intensa precisam de avaliação.

Sono é tema clínico também.$$,
$$Estou brigando com o sintoma ou ajudando meu filho a acalmar o sistema?$$,
6),

('me-notar', 7, 'Eu faço de tudo pra você me notar', null, '🎭',
$$Às vezes eu invento moda.

Bagunço. Provoco. Repito aquilo que você já disse mil vezes pra não fazer.

Não é porque eu amo bronca. É porque bronca ainda é conexão.

É tipo tocar a campainha emocional da casa. Alguma resposta eu preciso ter.$$,
$$Eu prefiro atenção torta do que invisibilidade reta.$$,
$$O cérebro infantil é programado para buscar vínculo.

Quando a atenção positiva é escassa, qualquer atenção vira reforço.

Circuitos de recompensa são ativados até com interação negativa.

Não é manipulação sofisticada. É sobrevivência relacional básica.$$,
$$Mas comportamentos disruptivos frequentes pedem olhar sistêmico:
• rotina
• qualidade de vínculo
• ambiente escolar
• desenvolvimento emocional

Manual aponta possibilidades. Profissional investiga singularidades.$$,
$$Meu filho precisa errar para ser visto?$$,
7),

('medos', 8, 'Medos que aparecem do nada', null, '👻',
$$Eu sei… parece estranho.

De dia eu sou corajoso. De noite viro especialista em monstros imaginários.

Mas o medo é real dentro de mim.

Meu coração não sabe diferenciar fantasia de perigo de verdade.$$,
$$Meu cérebro ainda está aprendendo o que é seguro.$$,
$$Na infância, a amígdala cerebral é muito sensível.

Imaginação + imaturidade neurológica = sensação real de ameaça.

Validar o medo ajuda o cérebro a integrar experiência.

Ridicularizar ativa vergonha e aumenta ansiedade.$$,
$$Mas medos persistentes ou incapacitantes merecem avaliação profissional.

Nem tudo é fase. Nem tudo é problema.

Observar é arte.$$,
$$Estou ensinando meu filho a enfrentar o medo ou a sentir vergonha dele?$$,
8),

('volto-a-ser-bebe', 9, 'Quando eu volto a ser bebê', null, '🍼',
$$Eu sei amarrar o tênis. Eu sei falar direito.

Mas às vezes… eu esqueço.

Peço colo. Faço xixi na cama. Quero ajuda pra coisas que já fazia sozinho.$$,
$$Algo mudou aqui dentro. E eu precisei voltar para reorganizar.$$,
$$Regressão é estratégia adaptativa do cérebro.

Mudanças grandes ativam necessidade de segurança primária.

É como dar dois passos para trás para conseguir pular mais longe depois.$$,
$$Mas regressões prolongadas ou intensas precisam ser compreendidas no contexto familiar e emocional.

Não existe resposta padrão.

Existe história.$$,
$$Estou apressando a autonomia ou oferecendo base para ela acontecer?$$,
9),

('nao-vou', 10, 'O campeonato do “não vou”', null, '🚦',
$$Você fala. Eu travo.

Você insiste. Eu travo mais.

Não é birra nova. É sensação de controle.$$,
$$Eu estou descobrindo que existo separado de você.$$,
$$Entre 2 e 7 anos, o cérebro vive um boom de identidade.

Autonomia e oposição caminham juntas.

O córtex pré-frontal começa a ensaiar escolhas. Nem sempre com elegância.

Limite + espaço de decisão ajudam o cérebro a integrar responsabilidade.$$,
$$Mas oposição extrema ou sofrimento relacional pedem análise cuidadosa.

Educação não é disputa de poder. É construção de competência.$$,
$$Estou criando um obediente ou formando alguém capaz de pensar?$$,
10),

('corpo-nao-desliga', 11, 'O corpo que não desliga', null, '⚡',
$$Eu tento ficar parado. Sério.

Mas meu corpo parece ter tomado energético escondido.

Eu levanto. Eu mexo. Eu invento movimento.$$,
$$Mover é o jeito que encontrei de organizar minha mente.$$,
$$Movimento regula o cérebro infantil.

Sistema motor e atenção estão profundamente conectados.

Algumas crianças precisam de mais estímulo corporal para alcançar foco cognitivo.$$,
$$Mas inquietação persistente com prejuízo funcional merece avaliação multidisciplinar.

Cada cérebro tem seu ritmo. Cada família tem seu cenário.$$,
$$Estou tentando parar o corpo do meu filho ou ajudá-lo a encontrar equilíbrio?$$,
11),

('erro-pra-ter-certeza', 12, 'Quando eu erro só pra ter certeza', null, '🧩',
$$Tem vezes que eu sei que vai dar bronca.

Mesmo assim… eu faço.

Depois eu olho pra você.

Não é desafio. É pergunta silenciosa.$$,
$$Você ainda me ama quando eu falho?$$,
$$Pertencimento é necessidade neurológica básica.

O cérebro busca previsibilidade de vínculo.

Algumas crianças testam amor para confirmar segurança.

Resposta consistente constrói estabilidade emocional.$$,
$$Mas padrões repetitivos de autossabotagem podem indicar questões mais profundas.

E aí o olhar profissional é fundamental.$$,
null, -- o livro ainda não tem pergunta de cabeceira neste capítulo
12),

('dormir-sozinho', 13, 'Eu não quero dormir sozinho', null, '🛏️',
$$Quando você apaga a luz e fecha a porta, o quarto fica grande demais.

O silêncio faz barulho. Os pensamentos fazem companhia… mas nem sempre são legais.

Eu sei que você diz que está perto. Mas o escuro faz meu cérebro imaginar distâncias enormes.$$,
$$Dormir sozinho não é só sobre cama. É sobre me sentir seguro dentro de mim.$$,
$$O sono infantil depende de sensação neurológica de segurança.

O sistema nervoso só relaxa quando o cérebro entende que o ambiente é previsível.

Algumas crianças precisam de transições mais longas. Outras precisam de rituais claros.$$,
$$Mas dependência extrema, ansiedade intensa ou sofrimento noturno persistente merecem avaliação profissional.

Cada história de sono é única. Não é protocolável.$$,
$$Estou ensinando autonomia no ritmo do meu filho ou no ritmo da minha pressa?$$,
13),

('colegas', 14, 'Quando eu não me sinto querido pelos colegas', null, '🎒',
$$Na escola às vezes dói.

Não é tombo. É um sentimento estranho de ficar de fora.

Eles riem. Brincam. E eu fico tentando entender onde eu entro.$$,
$$Eu não preciso que você resolva tudo. Mas preciso saber que não estou sozinho.$$,
$$Pertencimento social ativa circuitos profundos do cérebro.

Exclusão pode gerar ansiedade, retraimento ou comportamentos compensatórios.

A infância é um laboratório de relações.$$,
$$Mas sofrimento social persistente não deve ser minimizado.

Avaliar habilidades sociais, autoestima, ambiente escolar e dinâmica familiar pode ser essencial.

Manual acolhe. Intervenção especializada direciona.$$,
$$Estou ensinando meu filho a se fortalecer ou apenas dizendo para ele “ignorar”?$$,
14),

('aprender', 15, 'Eu me esforço… mas não consigo aprender', null, '📚',
$$Eu tento prestar atenção. Eu tento copiar. Eu tento entender.

Mas as letras dançam. Os números fogem. E eu começo a achar que o problema sou eu.$$,
$$Eu não estou com preguiça. Estou cansado de tentar sem conseguir.$$,
$$Nem toda dificuldade de aprendizagem é transtorno.

Pode envolver:
• maturidade neurológica
• estilo cognitivo
• fatores emocionais
• método pedagógico
• autoestima
• sobrecarga$$,
$$Mas quando a dificuldade persiste ou causa sofrimento, investigar é cuidado — não exagero.

O cérebro aprende melhor quando se sente capaz.

Personalização é chave. Educação não é linha de montagem.$$,
$$Estou ajudando meu filho a aprender ou apenas cobrando desempenho?$$,
15)

on conflict (id) do update set
  numero = excluded.numero,
  titulo = excluded.titulo,
  tema = excluded.tema,
  emoji = excluded.emoji,
  historia = excluded.historia,
  fala = excluded.fala,
  traducao = excluded.traducao,
  quando_buscar_ajuda = excluded.quando_buscar_ajuda,
  pergunta = excluded.pergunta,
  ordem = excluded.ordem;
