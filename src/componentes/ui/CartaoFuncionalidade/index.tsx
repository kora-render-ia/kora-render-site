import { motion } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineSquare3Stack3D,
  HiOutlineSparkles as HiVarinha,
  HiOutlineArrowsPointingOut,
  HiOutlineBolt,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

const mapaIcones: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sparkles: HiOutlineSparkles,
  sun: HiOutlineSun,
  sliders: HiOutlineAdjustmentsHorizontal,
  layers: HiOutlineSquare3Stack3D,
  wand: HiVarinha,
  expand: HiOutlineArrowsPointingOut,
  zap: HiOutlineBolt,
  refresh: HiOutlineArrowPath,
};

interface PropriedadesCartaoFuncionalidade {
  icone: string;
  titulo: string;
  descricao: string;
  indice: number;
  numero: string;
  destacado?: boolean;
}

export default function CartaoFuncionalidade({
  icone,
  titulo,
  descricao,
  indice,
  numero,
  destacado,
}: PropriedadesCartaoFuncionalidade) {
  const Icone = mapaIcones[icone] ?? HiOutlineSparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (indice % 4) * 0.06 }}
      className={mesclarClasses(
        "group relative flex flex-col justify-between rounded-quadro border border-borda bg-fundo-elevado p-5 shadow-suave transition-colors duration-200 hover:border-marca/40",
        destacado && "sm:col-span-2 sm:row-span-2 sm:p-7"
      )}
    >
      <div>
        <div className="flex items-center justify-between">
          <Icone
            size={destacado ? 26 : 20}
            className="text-marca transition-transform duration-200 group-hover:scale-110"
            aria-hidden="true"
          />
          <span className="numero-tecnico text-[10px] text-texto-suave">{numero}</span>
        </div>
        <h3
          className={mesclarClasses(
            "mt-5 font-titulo font-semibold text-texto-primario",
            destacado ? "text-xl" : "text-sm"
          )}
        >
          {titulo}
        </h3>
        <p
          className={mesclarClasses(
            "mt-1.5 leading-relaxed text-texto-secundario",
            destacado ? "max-w-xs text-sm" : "text-[13px]"
          )}
        >
          {descricao}
        </p>
      </div>
    </motion.div>
  );
}
