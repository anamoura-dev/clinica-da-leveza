import { useCallback, useEffect, useState } from 'react';

type Estado<T> = {
  dados: T | null;
  erro: string | null;
  carregando: boolean;
  /** aumenta a cada carga que deu certo (útil como `key` para reiniciar estados locais) */
  versao: number;
};

/**
 * Busca dados (ex.: no Supabase) e controla carregando / erro / tentar de novo.
 *
 * `carregar` deve ser memorizada com useCallback (com os parâmetros da rota
 * como dependência), devolver os dados ou lançar um Error com a mensagem.
 */
export function useDados<T>(carregar: () => Promise<T>) {
  const [estado, setEstado] = useState<Estado<T>>({ dados: null, erro: null, carregando: true, versao: 0 });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    carregar()
      .then((dados) => {
        if (ativo) setEstado((atual) => ({ dados, erro: null, carregando: false, versao: atual.versao + 1 }));
      })
      .catch((e: unknown) => {
        const mensagem = e instanceof Error ? e.message : 'Algo deu errado.';
        if (ativo) setEstado((atual) => ({ ...atual, dados: null, erro: mensagem, carregando: false }));
      });
    return () => {
      ativo = false;
    };
  }, [carregar, tentativa]);

  /** Mostra "carregando" e busca de novo (botão "Tentar de novo"). */
  const tentarDeNovo = useCallback(() => {
    setEstado((atual) => ({ ...atual, erro: null, carregando: true }));
    setTentativa((t) => t + 1);
  }, []);

  /** Busca de novo em silêncio, mantendo o que já está na tela. */
  const atualizar = useCallback(() => setTentativa((t) => t + 1), []);

  return { ...estado, tentarDeNovo, atualizar };
}
