import { EmBreve } from '@/components/ui';
import { Cores } from '@/constants/theme';

export default function Conversar() {
  return (
    <EmBreve
      icone="chatbubbles-outline"
      titulo="Em breve"
      texto="Aqui você vai poder conversar com a gente."
      cor={Cores.lavandaEscura}
      corFundo={Cores.lavandaClara}
    />
  );
}
