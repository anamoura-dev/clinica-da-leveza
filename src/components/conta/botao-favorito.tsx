import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable } from 'react-native';

import { TipoFavorito, useFavorito } from '@/components/conta/dados';
import { Cores } from '@/constants/theme';

/** Coração de favorito (fica no cabeçalho das telas de detalhe). */
export function BotaoFavorito({ tipo, itemId, titulo }: { tipo: TipoFavorito; itemId?: string; titulo?: string }) {
  const { favorito, alternar } = useFavorito(tipo, itemId, titulo);
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        alternar();
      }}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={favorito ? 'Tirar dos favoritos' : 'Salvar nos favoritos'}>
      <Ionicons name={favorito ? 'heart' : 'heart-outline'} size={24} color={favorito ? Cores.terracota : Cores.marinho} />
    </Pressable>
  );
}
