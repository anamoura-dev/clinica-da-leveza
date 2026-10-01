import type { Session } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { supabase } from '../../../lib/supabase';

// No web, fecha a janelinha de login quando o Google devolve para o app.
WebBrowser.maybeCompleteAuthSession();

// "Entrar com Apple" liga/desliga em src/constants/recursos.ts
export { APPLE_ATIVO } from '@/constants/recursos';

/** Sessão atual (ou null) e se ainda está descobrindo. Atualiza sozinha no login/logout. */
export function useSessao() {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      setSessao(data.session);
      setCarregando(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) => {
      if (ativo) setSessao(nova);
    });
    return () => {
      ativo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return { sessao, usuario: sessao?.user ?? null, carregando };
}

/** Pega o ?code= que o Supabase devolve no link de volta. */
function codigoDaUrl(url: string) {
  const { queryParams } = Linking.parse(url);
  const codigo = queryParams?.code;
  return typeof codigo === 'string' ? codigo : null;
}

/** Login com Google pelo navegador (funciona no Expo Go e no app instalado). */
export async function entrarComGoogle() {
  const voltarPara = Linking.createURL('auth');
  // Em desenvolvimento, mostra no Terminal o endereço de volta (tem que estar nas Redirect URLs do Supabase).
  if (__DEV__) console.log('[login] endereço de volta:', voltarPara);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: voltarPara, skipBrowserRedirect: true },
  });
  if (error || !data.url) throw new Error(error?.message ?? 'Não foi possível abrir o login do Google.');

  const resultado = await WebBrowser.openAuthSessionAsync(data.url, voltarPara);
  if (resultado.type !== 'success') return false; // a pessoa fechou a janela

  const codigo = codigoDaUrl(resultado.url);
  if (!codigo) throw new Error('O Google não devolveu o login. Tente de novo.');
  const troca = await supabase.auth.exchangeCodeForSession(codigo);
  if (troca.error) throw new Error(troca.error.message);
  return true;
}

/** Login com Apple (só iPhone). Precisa de APPLE_ATIVO e do provedor Apple no Supabase. */
export async function entrarComApple() {
  if (Platform.OS !== 'ios') throw new Error('Entrar com Apple só funciona no iPhone.');
  const nonce = Crypto.randomUUID();
  const nonceHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);

  let credencial: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credencial = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: nonceHash,
    });
  } catch (e) {
    if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED') return false;
    throw e;
  }
  if (!credencial.identityToken) throw new Error('A Apple não devolveu o login.');

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credencial.identityToken,
    nonce,
  });
  if (error) throw new Error(error.message);

  // A Apple só manda o nome na primeira vez: guarda no perfil.
  const nome = [credencial.fullName?.givenName, credencial.fullName?.familyName].filter(Boolean).join(' ');
  if (nome && data.user) await supabase.from('perfis').update({ nome }).eq('id', data.user.id);
  return true;
}

export async function sair() {
  await supabase.auth.signOut();
}

/** Apaga a conta e todos os dados dela (função "excluir-conta" no Supabase). */
export async function excluirConta() {
  const { error } = await supabase.functions.invoke('excluir-conta', { method: 'POST' });
  if (error) throw new Error('Não foi possível excluir a conta agora. Tente de novo.');
  await supabase.auth.signOut();
}
