import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

type Estado<T> = {
  dados: T | null;
  erro: string | null;
  carregando: boolean;
  /** true quando a internet falhou e a tela mostra a última versão guardada no celular */
  offline: boolean;
  /** aumenta a cada carga que deu certo (útil como `key` para reiniciar estados locais) */
  versao: number;
};

/** Troca mensagens técnicas ("Network request failed"...) por uma frase que a pessoa entende. */
export function mensagemAmigavel(e: unknown) {
  const texto = e instanceof Error ? e.message : '';
  if (/network|fetch|internet|timeout|tempo|abort|conex/i.test(texto) || !texto) {
    return 'Parece que você está sem internet. Confira a conexão e tente de novo.';
  }
  // Mensagens que nós mesmos escrevemos (ex.: "Café não encontrado.") passam como estão.
  if (/^[A-ZÀ-Ú][^{}<>]*\.$/.test(texto) && !/[A-Za-z]+Error/.test(texto)) return texto;
  return 'Algo deu errado por aqui. Tente de novo daqui a pouquinho.';
}

async function lerCache<T>(chave: string): Promise<T | null> {
  try {
    const texto = await AsyncStorage.getItem(`cache:${chave}`);
    return texto ? (JSON.parse(texto) as T) : null;
  } catch {
    return null;
  }
}

function salvarCache(chave: string, dados: unknown) {
  AsyncStorage.setItem(`cache:${chave}`, JSON.stringify(dados)).catch(() => {});
}

/**
 * Busca dados (ex.: no Supabase) e controla carregando / erro / tentar de novo.
 *
 * `carregar` deve ser memorizada com useCallback (com os parâmetros da rota
 * como dependência), devolver os dados ou lançar um Error com a mensagem.
 *
 * `chave` (opcional) guarda a última versão no celular: sem internet, a tela
 * mostra o que já foi visto em vez de um erro. Não use para dados pessoais.
 */
export function useDados<T>(carregar: () => Promise<T>, chave?: string) {
  const [estado, setEstado] = useState<Estado<T>>({
    dados: null,
    erro: null,
    carregando: true,
    offline: false,
    versao: 0,
  });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    let chegou = false; // a resposta da internet já veio?

    // Mostra na hora a última versão guardada (se houver) enquanto busca a nova.
    if (chave) {
      lerCache<T>(chave).then((guardado) => {
        if (ativo && !chegou && guardado) {
          setEstado((atual) =>
            atual.dados ? atual : { dados: guardado, erro: null, carregando: false, offline: false, versao: atual.versao + 1 },
          );
        }
      });
    }

    carregar()
      .then((dados) => {
        chegou = true;
        if (chave) salvarCache(chave, dados);
        if (ativo) setEstado((atual) => ({ dados, erro: null, carregando: false, offline: false, versao: atual.versao + 1 }));
      })
      .catch(async (e: unknown) => {
        chegou = true;
        const guardado = chave ? await lerCache<T>(chave) : null;
        if (!ativo) return;
        if (guardado) {
          // Sem internet: continua mostrando o que já foi visto.
          setEstado((atual) => ({ dados: atual.dados ?? guardado, erro: null, carregando: false, offline: true, versao: atual.dados ? atual.versao : atual.versao + 1 }));
        } else {
          setEstado((atual) => ({ ...atual, dados: null, erro: mensagemAmigavel(e), carregando: false }));
        }
      });
    return () => {
      ativo = false;
    };
  }, [carregar, chave, tentativa]);

  /** Mostra "carregando" e busca de novo (botão "Tentar de novo"). */
  const tentarDeNovo = useCallback(() => {
    setEstado((atual) => ({ ...atual, erro: null, carregando: true }));
    setTentativa((n) => n + 1);
  }, []);

  /** Busca de novo em silêncio, mantendo o que já está na tela. */
  const atualizar = useCallback(() => setTentativa((n) => n + 1), []);

  return { ...estado, tentarDeNovo, atualizar };
}
