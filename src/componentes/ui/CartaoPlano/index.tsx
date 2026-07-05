import { motion } from "framer-motion";
import { HiCheck } from "react-icons/hi2";
import Botao from "../../comuns/Botao";
import MoldeCantos from "../MoldeCantos";
import { mesclarClasses } from "../../../utilitarios/mesclarClasses";

interface PropriedadesCartaoPlano {
  nome: string;
  preco: string;
  periodo: string;
  descricao: string;
  recursos: string[];
  rotuloCta: string;
  selo?: string;
  emDestaque?: boolean;
  indice: number;
}

export default function CartaoPlano({
  nome,
  preco,
  periodo,
  descricao,
  recursos,
  rotuloCta,
  selo,
  emDestaque,
  indice,
}: PropriedadesCartaoPlano) {
  const conteudo = (
    <div
      className={mesclarClasses(
        "flex h-full flex-col border border-borda p-6",
        emDestaque && "border-marca/50 bg-superficie/40"
      )}
    >
      {selo && (
        <span className="numero-tecnico mb-4 inline-flex w-fit items-center gap-1.5 border border-marca/40 bg-marca-suave px-2.5 py-1 text-[10px] uppercase tracking-wider text-marca">
          {selo}
        </span>
      )}

      <p className="numero-tecnico text-[11px] uppercase tracking-wider text-texto-suave">{nome}</p>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-titulo text-3xl font-semibold text-texto-primario">{preco}</span>
        <span className="text-sm text-texto-suave">{periodo}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-texto-secundario">{descricao}</p>

      <ul className="mt-6 flex-1 space-y-3 border-t border-borda pt-6">
        {recursos.map((recurso) => (
          <li key={recurso} className="flex items-start gap-2.5 text-sm text-texto-secundario">
            <HiCheck className="mt-0.5 shrink-0 text-marca" size={15} aria-hidden="true" />
            <span>{recurso}</span>
          </li>
        ))}
      </ul>

      <Botao
        variante={emDestaque ? "primario" : "secundario"}
        tamanho="md"
        className="mt-6 w-full"
        href="#"
      >
        {rotuloCta}
      </Botao>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: indice * 0.08 }}
      className="h-full"
    >
      {emDestaque ? <MoldeCantos corCanto="marca">{conteudo}</MoldeCantos> : conteudo}
    </motion.div>
  );
}
