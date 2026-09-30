import { EmBreve } from '@/components/ui';
import { Cores } from '@/constants/theme';

export default function MundoDasCriancas() {
  return (
    <EmBreve
      icone="balloon-outline"
      titulo="Em breve"
      texto="Um cantinho para entrar no mundo das crianças."
      cor={Cores.pessegoEscuro}
      corFundo={Cores.pessegoClaro}
    />
  );
}
