"use client";

import { HelpCircle, ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "¿Cuánto descuenta el AFP en El Salvador?",
    answer:
      "El AFP retiene el 7.25% de tu salario bruto mensual. Este dinero va directo a tu cuenta individual de ahorro para pensiones.",
  },
  {
    question: "¿Cuánto descuenta el ISSS en 2026?",
    answer:
      "El ISSS descuenta el 3% del salario. Tiene un tope máximo de cotización; esto significa que el descuento máximo que te pueden hacer es de $30 mensuales (cuando tu salario es de $1,000 o más).",
  },
  {
    question: "¿Cómo se calcula el Impuesto sobre la Renta (ISR)?",
    answer:
      "El ISR se calcula con tablas progresivas emitidas por el Ministerio de Hacienda. Primero, a tu salario bruto se le resta el AFP y el ISSS para obtener tu 'salario gravable'. Ese monto se busca en la tabla vigente de 2026 para aplicar el porcentaje y la cuota fija correspondiente.",
  },
  {
    question: "¿Cuántos días me tocan de aguinaldo?",
    answer:
      "Según el Código de Trabajo, depende de tu antigüedad: de 1 a 3 años son 15 días de salario; de 3 a 10 años, 19 días; y más de 10 años, 21 días. Si tienes menos de un año en la empresa, se te calcula de forma proporcional a los días trabajados.",
  },
];

export function FaqSection() {
  return (
    <section className="space-y-6 pt-10" aria-labelledby="faq-heading">
      <div className="flex items-center gap-3 justify-center mb-8">
        <div className="p-3 bg-muted/40 rounded-2xl border border-border/50">
          <HelpCircle className="w-6 h-6 text-[#1D9E75]" />
        </div>
        <h2 id="faq-heading" className="text-2xl font-bold tracking-tight">
          Preguntas frecuentes
        </h2>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map(({ question, answer }) => (
          <details
            key={question}
            className="group rounded-2xl border border-border/50 bg-card hover:bg-muted/10 transition-colors"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-semibold [&::-webkit-details-marker]:hidden">
              {question}
              <ChevronDown
                className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="px-5 pb-5 pt-1">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
