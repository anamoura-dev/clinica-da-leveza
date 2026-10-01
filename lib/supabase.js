import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import './cripto-polyfill';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Internet muito lenta: desiste depois de 15 s (a tela mostra "Tentar de novo"
// ou a versão guardada) em vez de ficar carregando para sempre.
const LIMITE_MS = 15000;
function fetchComLimite(url, opcoes = {}) {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), LIMITE_MS);
  if (opcoes.signal) opcoes.signal.addEventListener('abort', () => controle.abort());
  return fetch(url, { ...opcoes, signal: controle.signal }).finally(() => clearTimeout(timer));
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: fetchComLimite },
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // PKCE: o login pelo navegador (Google) volta com um código que o app troca pela sessão.
    flowType: 'pkce',
  },
});
