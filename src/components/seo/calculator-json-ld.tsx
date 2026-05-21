const DESCRIPTION =
  "Calcula tu salario neto en El Salvador al instante. Descubre cuánto te descuentan de AFP, ISSS e impuesto sobre la renta (ISR) con datos actualizados 2025.";

export function CalculatorJsonLd() {
  const jsonLd = {
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export { DESCRIPTION as CALCULATOR_META_DESCRIPTION };
