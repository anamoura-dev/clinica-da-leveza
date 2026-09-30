import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { supabase } from '../../../lib/supabase';

export type Perfil = { id: string; nome: string | null; foto_url: string | null };
export type Filho = { id: string; apelido: string; ano_nascimento: number | null };
export type TipoFavorito = 'cafe' | 'historia' | 'manualeve';
export type Favorito = { tipo: TipoFavorito; item_id: string; titulo: string | null; criado_em: string };
export type TipoProgresso = 'missao' | 'cenario';

function falhou(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

async function usuarioAtual() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

/** Tudo o que a tela de Perfil mostra, de uma vez. */
export async function buscarConta(usuarioId: string) {
  const [perfil, filhos, favoritos, progresso] = await Promise.all([
    supabase.from('perfis').select('id, nome, foto_url').eq('id', usuarioId).maybeSingle(),
    supabase.from('filhos').select('id, apelido, ano_nascimento').order('criado_em'),
    supabase.from('favoritos').select('tipo, item_id, titulo, criado_em').order('criado_em', { ascending: false }),
    supabase.from('progresso').select('tipo'),
  ]);
  falhou(perfil.error || filhos.error || favoritos.error || progresso.error);
  const contar = (tipo: TipoProgresso) => (progresso.data ?? []).filter((p) => p.tipo === tipo).length;
  return {
    perfil: (perfil.data as Perfil | null) ?? { id: usuarioId, nome: null, foto_url: null },
    filhos: (filhos.data ?? []) as Filho[],
    favoritos: (favoritos.data ?? []) as Favorito[],
    missoes: contar('missao'),
    cenarios: contar('cenario'),
  };
}

export async function salvarNome(usuarioId: string, nome: string) {
  const { error } = await supabase.from('perfis').upsert({ id: usuarioId, nome: nome.trim() || null });
  falhou(error);
}

export async function adicionarFilho(apelido: string, anoNascimento: number | null) {
  const { data, error } = await supabase
    .from('filhos')
    .insert({ apelido: apelido.trim(), ano_nascimento: anoNascimento })
    .select('id, apelido, ano_nascimento')
    .single();
  falhou(error);
  return data as Filho;
}

export async function removerFilho(id: string) {
  const { error } = await supabase.from('filhos').delete().eq('id', id);
  falhou(error);
}

/** Idade aproximada a partir do ano de nascimento. */
export function idade(ano: number | null) {
  if (!ano) return null;
  const anos = new Date().getFullYear() - ano;
  if (anos <= 0) return 'bebê';
  return anos === 1 ? '1 ano' : `${anos} anos`;
}

// ---------- Progresso ----------

/** Registra progresso na conta (se houver alguém logado). Sem login, não faz nada. */
export async function registrarProgresso(tipo: TipoProgresso, itemId: string) {
  const usuario = await usuarioAtual();
  if (!usuario) return;
  await supabase.from('progresso').upsert({ tipo, item_id: itemId }, { ignoreDuplicates: true });
}

export async function progressoNaConta(tipo: TipoProgresso): Promise<string[]> {
  const usuario = await usuarioAtual();
  if (!usuario) return [];
  const { data } = await supabase.from('progresso').select('item_id').eq('tipo', tipo);
  return (data ?? []).map((p) => p.item_id as string);
}

// ---------- Favoritos ----------

function pedirLogin() {
  Alert.alert('Salvar nos favoritos', 'Entre na sua conta para guardar seus favoritos. É rapidinho!', [
    { text: 'Agora não', style: 'cancel' },
    { text: 'Entrar', onPress: () => router.push('/perfil') },
  ]);
}

/** Estado do coração de um item + função para marcar/desmarcar. */
export function useFavorito(tipo: TipoFavorito, itemId: string | undefined, titulo: string | undefined) {
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    let ativo = true;
    if (!itemId) return;
    usuarioAtual().then((usuario) => {
      if (!usuario) return;
      supabase
        .from('favoritos')
        .select('item_id')
        .eq('tipo', tipo)
        .eq('item_id', itemId)
        .maybeSingle()
        .then(({ data }) => {
          if (ativo) setFavorito(!!data);
        });
    });
    return () => {
      ativo = false;
    };
  }, [tipo, itemId]);

  const alternar = useCallback(async () => {
    if (!itemId) return;
    const usuario = await usuarioAtual();
    if (!usuario) {
      pedirLogin();
      return;
    }
    const novo = !favorito;
    setFavorito(novo); // resposta imediata; desfaz se der erro
    const { error } = novo
      ? await supabase.from('favoritos').upsert({ tipo, item_id: itemId, titulo: titulo ?? null })
      : await supabase.from('favoritos').delete().eq('tipo', tipo).eq('item_id', itemId);
    if (error) {
      setFavorito(!novo);
      Alert.alert('Ops', 'Não foi possível salvar agora. Tente de novo.');
    }
  }, [favorito, tipo, itemId, titulo]);

  return { favorito, alternar };
}
