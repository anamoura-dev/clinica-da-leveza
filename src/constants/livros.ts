import type { ImageSource } from 'expo-image';

/**
 * Livros infantis da Ana Paula (vendidos no site dela).
 * ✏️ Para mudar texto, link ou capa, é só editar aqui.
 */
export type Livro = {
  id: string;
  titulo: string;
  chamada: string; // frase curta para cartões
  resumo: string; // texto da página "Livros da Ana"
  capa: ImageSource;
  link: string;
};

export const LIVROS: Livro[] = [
  {
    id: 'leve',
    titulo: 'Leve',
    chamada: 'Caminhos possíveis para a criança, sem excesso de peso e sempre conectada.',
    resumo:
      'Baseado na Filosofia Sistêmica, o LEVE nasceu como um convite às crianças (e seus pais) de encontrarem caminhos possíveis, sem excessos de peso, mas sempre conectados! É um olhar para o lugar que cada criança ocupa em sua família e suas tentativas genuínas de tomar pra ela as mazelas daqueles que a cercam.',
    capa: require('../../assets/images/livros/leve.jpg'),
    link: 'https://aprendendoaserleve.com.br/produto/leve/',
  },
  {
    id: 'infancia-futebol-clube',
    titulo: 'Infância Futebol Clube',
    chamada: 'Ninguém joga sozinho, especialmente no desenvolvimento infantil.',
    resumo:
      'Quem você escala para fazer parte do seu time? Com quem troca os melhores passes na construção dos gols que deseja marcar? Lembre-se: ninguém joga sozinho, especialmente quando o “jogo” é o desenvolvimento infantil e a bola ⚽ já está rolando! Vem jogar com a gente!',
    capa: require('../../assets/images/livros/infancia-futebol-clube.jpg'),
    link: 'https://aprendendoaserleve.com.br/produto/infancia-futebol-clube/',
  },
];

/** Escolhe sempre o mesmo livro para o mesmo conteúdo (alternando entre os livros). */
export function livroPara(semente: string) {
  let soma = 0;
  for (const letra of semente) soma += letra.charCodeAt(0);
  return LIVROS[soma % LIVROS.length];
}
