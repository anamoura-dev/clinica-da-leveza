import { Redirect } from 'expo-router';

/**
 * Rota de volta do login (clinicadaleveza://auth).
 * Normalmente o navegador de login já devolve direto para a tela de Perfil;
 * se o link abrir o app "de fora", só leva a pessoa para o Perfil.
 */
export default function VoltaDoLogin() {
  return <Redirect href="/perfil" />;
}
