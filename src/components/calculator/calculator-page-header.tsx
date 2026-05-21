export function CalculatorPageHeader() {
  return (
    <header className="mb-12 mt-6 flex flex-col items-center text-center space-y-5">
      {/* Etiqueta de País y Año */}
      <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-1.5 backdrop-blur-sm">
        <span className="text-sm leading-none">🇸🇻</span>
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          El Salvador · Actualizado 2026
        </span>
      </div>

      {/* Título Principal con Gradiente */}
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
        ¿Cuánto recibirás <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D9E75] to-[#0f5c43]">
          realmente
        </span>{" "}
        de tu salario?
      </h1>

      {/* Subtítulo */}
      <p className="max-w-xl text-base text-muted-foreground text-pretty sm:text-lg">
        Descubre tu salario neto exacto y toma el control de tu presupuesto.
        Cálculos al día con las retenciones de AFP, ISSS e ISR.
      </p>
    </header>
  );
}
