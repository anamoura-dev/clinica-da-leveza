import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { supabase } from '../../../lib/supabase';

export type Personagem = {
  id: string;
  nome: string;
  especie: string;
  emoji: string;
  cor: string;
  fala: string;
};

export type Sentimento = {
  id: string;
  nome: string;
  emoji: string;
  cor: string;
  personagem_id: string | null;
  mensagem: string;
};

export type Pagina = { emoji: string; texto: string };

export type Historia = {
  id: string;
  titulo: string;
  emoji: string;
  sentimento_id: string | null;
  personagem_id: string | null;
  paginas: Pagina[];
  pergunta_final: string | null;
  audio_url: string | null;
};

export type Missao = {
  id: string;
  titulo: string;
  emoji: string;
  sentimento_id: string | null;
  descricao: string | null;
  passos: string[];
  desenhar: boolean;
};

function falhou(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

/** Tudo o que a tela inicial do Espaço das Crianças precisa, de uma vez. */
export async function buscarMundo() {
  const [p, s, h, m] = await Promise.all([
    supabase.from('mundo_personagens').select('*').order('ordem'),
    supabase.from('mundo_sentimentos').select('*').order('ordem'),
    supabase
      .from('mundo_historias')
      .select('id, titulo, emoji, sentimento_id, personagem_id')
      .order('ordem'),
    supabase
      .from('mundo_missoes')
      .select('id, titulo, emoji, sentimento_id, descricao, desenhar')
      .order('ordem'),
  ]);
  falhou(p.error || s.error || h.error || m.error);
  return {
    personagens: (p.data ?? []) as Personagem[],
    sentimentos: (s.data ?? []) as Sentimento[],
    historias: (h.data ?? []) as Pick<Historia, 'id' | 'titulo' | 'emoji' | 'sentimento_id' | 'personagem_id'>[],
    missoes: (m.data ?? []) as Omit<Missao, 'passos'>[],
  };
}

export async function buscarHistoria(id: string) {
  const { data, error } = await supabase.from('mundo_historias').select('*').eq('id', id).maybeSingle();
  falhou(error);
  if (!data) throw new Error('História não encontrada.');
  const historia = data as Historia;
  let personagem: Personagem | null = null;
  if (historia.personagem_id) {
    const res = await supabase.from('mundo_personagens').select('*').eq('id', historia.personagem_id).maybeSingle();
    personagem = (res.data as Personagem | null) ?? null;
  }
  return { historia, personagem };
}

export async function buscarMissao(id: string) {
  const { data, error } = await supabase.from('mundo_missoes').select('*').eq('id', id).maybeSingle();
  falhou(error);
  if (!data) throw new Error('Missão não encontrada.');
  return data as Missao;
}

// ---------- Estrelas (missões cumpridas), guardadas só no celular ----------

const CHAVE_MISSOES = 'mundo:missoes-concluidas';

async function lerConcluidas(): Promise<string[]> {
  try {
    const texto = await AsyncStorage.getItem(CHAVE_MISSOES);
    const lista = texto ? JSON.parse(texto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export async function marcarMissaoConcluida(id: string) {
  const atuais = await lerConcluidas();
  if (!atuais.includes(id)) {
    await AsyncStorage.setItem(CHAVE_MISSOES, JSON.stringify([...atuais, id]));
  }
}

/** Lista de missões concluídas; atualiza sempre que a tela volta a aparecer. */
export function useMissoesConcluidas() {
  const [concluidas, setConcluidas] = useState<string[]>([]);
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      lerConcluidas().then((lista) => {
        if (ativo) setConcluidas(lista);
      });
      return () => {
        ativo = false;
      };
    }, []),
  );
  return concluidas;
}
