// O React Native não tem a WebCrypto do navegador (crypto.subtle / getRandomValues).
// O login do Supabase (PKCE) usa essas funções para proteger o código de login;
// sem elas ele cai num modo mais fraco ("plain"). Aqui ligamos as do expo-crypto.
import * as ExpoCrypto from 'expo-crypto';

const cripto = globalThis.crypto ?? {};

if (typeof cripto.getRandomValues !== 'function') {
  cripto.getRandomValues = (array) => ExpoCrypto.getRandomValues(array);
}

if (!cripto.subtle || typeof cripto.subtle.digest !== 'function') {
  cripto.subtle = {
    ...(cripto.subtle ?? {}),
    // 'SHA-256' é o mesmo nome usado pelo expo-crypto (CryptoDigestAlgorithm.SHA256)
    digest: (algoritmo, dados) => ExpoCrypto.digest(algoritmo, dados),
  };
}

if (!globalThis.crypto) {
  globalThis.crypto = cripto;
}
