import { useCallback, useEffect, useState } from 'react';

type Estado<T> = {
  dados: T | null;
  erro: string | null;
  carregando: boolean;
};

/**
 * Busca dados (ex.: no Supabase) e controla carregando / erro / tentar de novo.
 *
 * `carregar` deve ser memorizada com useCallback (com os parâmetros da rota
 * como dependência), devolver os dados ou lançar um Error com a mensagem.
 */
export function useDados<T>(carregar: () => Promise<T>) {
  const [estado, setEstado] = useState<Estado<T>>({ dados: null, erro: null, carregando: true });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    carregar()
      .then((dados) => {
        if (ativo) setEstado({ dados, erro: null, carregando: false });
      })
      .catch((e: unknown) => {
        const mensagem = e instanceof Error ? e.message : 'Algo deu errado.';
        if (ativo) setEstado({ dados: null, erro: mensagem, carregando: false });
      });
    return () => {
      ativo = false;
    };
  }, [carregar, tentativa]);

  const tentarDeNovo = useCallback(() => {
    setEstado((atual) => ({ ...atual, erro: null, carregando: true }));
    setTentativa((t) => t + 1);
  }, []);

  return { ...estado, tentarDeNovo };
}
