const DESCRIPTION =
  "Calcula tu salario neto en El Salvador al instante. Descubre cuánto te descuentan de AFP, ISSS e impuesto sobre la renta (ISR) con datos actualizados 2026.";

export function CalculatorJsonLd() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Calculadora Salarial SV",
      applicationCategory: "FinanceApplication",
      description: DESCRIPTION,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      operatingSystem: "Web",
      inLanguage: "es-SV",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cuánto descuenta el AFP en El Salvador?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El AFP retiene el 7.25% de tu salario bruto mensual. Este dinero va directo a tu cuenta individual de ahorro para pensiones.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto descuenta el ISSS en 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El ISSS descuenta el 3% del salario. Tiene un tope máximo de cotización; esto significa que el descuento máximo que te pueden hacer es de $30 mensuales (cuando tu salario es de $1,000 o más).",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo se calcula el Impuesto sobre la Renta (ISR)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El ISR se calcula con tablas progresivas emitidas por el Ministerio de Hacienda. Primero, a tu salario bruto se le resta el AFP y el ISSS para obtener tu 'salario gravable'. Ese monto se busca en la tabla vigente de 2026 para aplicar el porcentaje y la cuota fija correspondiente.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuántos días me tocan de aguinaldo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Según el Código de Trabajo, depende de tu antigüedad: de 1 a 3 años son 15 días de salario; de 3 a 10 años, 19 días; y más de 10 años, 21 días. Si tienes menos de un año en la empresa, se te calcula de forma proporcional a los días trabajados.",
          },
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export { DESCRIPTION as CALCULATOR_META_DESCRIPTION };

