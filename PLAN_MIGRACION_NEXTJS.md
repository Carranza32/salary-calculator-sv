# Plan de migración: Calculadora Salarial SV → Web (Next.js)

Documento de especificación para reimplementar esta app Flutter en un **proyecto Next.js separado**. Está pensado para que Cursor (u otro agente) entienda el dominio, la lógica de negocio y las pantallas sin depender del código Dart.

---

## 1. Resumen del producto

| Campo | Valor |
|-------|--------|
| **Nombre** | Calculadora Salarial SV |
| **Mercado** | El Salvador |
| **Idioma UI** | Español (`es-SV`) |
| **Moneda** | USD (`$`) |
| **Año normativo** | 2025 (tablas ISR, salarios mínimos, porcentajes AFP/ISSS) |
| **Propósito** | Calcular salario neto con deducciones legales, proyectar beneficios laborales, simular presupuesto 50/30/20 y comparar ofertas guardadas en historial |

### Valor para el usuario

1. Saber cuánto recibe realmente (AFP, ISSS, ISR).
2. Ver costo patronal y beneficios anuales estimados (aguinaldo, vacaciones, indemnización).
3. Organizar gastos según regla **50/30/20** y ver “dinero libre” (ahorro automático).
4. Guardar cálculos con nombre para comparar ofertas de trabajo.
5. Exportar/compartir resultados (imagen y PDF).

---

## 2. Arquitectura actual (Flutter) → equivalente web

| Flutter | Recomendación Next.js |
|---------|------------------------|
| `flutter_riverpod` | Zustand, Jotai o React Context + hooks |
| `hive` (local NoSQL) | `localStorage` + JSON, o **IndexedDB** (Dexie.js) si el historial crece |
| `Material 3` | **shadcn/ui** + Tailwind, o MUI |
| `google_fonts` (Inter) | `next/font` → Inter |
| `fl_chart` | Recharts o Chart.js (opcional; la app actual usa poco gráficos) |
| `screenshot` + `share_plus` | `html-to-image` / `dom-to-image` + Web Share API o descarga |
| `pdf` + `printing` | `@react-pdf/renderer` o `jspdf` |
| Bottom navigation (3 tabs) | Layout con tabs o sidebar en desktop; bottom nav en móvil |
| Tema claro/oscuro | `next-themes` |

**Importante:** La lógica de cálculo debe vivir en **módulos TypeScript puros** (`lib/salary/`) sin dependencias de React, para tests unitarios y reutilización en Server Components si hace falta.

---

## 3. Estructura de navegación

Tres secciones principales (equivalente al `IndexedStack` + `NavigationBar`):

```
/                    → Calculadora (tab por defecto)
/presupuesto         → Mi Presupuesto (50/30/20)
/historial           → Historial de cálculos guardados
```

**Comportamiento:**

- Al tocar fuera de inputs, cerrar teclado/foco (en web: blur del input activo).
- Desde Calculadora, CTA “Ir a Presupuesto” cambia a tab `/presupuesto`.
- Presupuesto sin salario neto válido → estado vacío: “Primero calcula tu salario”.
- Historial vacío → estado vacío con mensaje educativo.

---

## 4. Módulo de cálculo salarial (CRÍTICO — portar fielmente)

Archivo fuente de referencia: `lib/services/salary_calculator_service.dart`

### 4.1 Constantes 2025

```typescript
// Porcentajes
const AFP_TRABAJADOR = 0.0725;   // 7.25%
const AFP_PATRONAL = 0.0875;     // 8.75%
const ISSS_TRABAJADOR = 0.03;    // 3%
const ISSS_PATRONAL = 0.075;     // 7.5%

// Topes ISSS (salario base máx. $1,000)
const ISSS_TOPE_SALARIO = 1000;
const ISSS_TOPE_TRABAJADOR = 30;   // máx. descuento trabajador
const ISSS_TOPE_PATRONAL = 75;     // máx. aporte patronal

// Salario mínimo industria/comercio/servicios 2025
const SALARIO_MINIMO_INDUSTRIA = 408.80;
```

### 4.2 Tabla ISR mensual (Decreto vigente mayo 2025)

| Desde | Hasta | % | Sobre excedente de | Cuota fija |
|-------|-------|---|-------------------|------------|
| 0.01 | 550.00 | 0% | — | 0 |
| 550.01 | 895.24 | 10% | 550.00 | 17.67 |
| 895.25 | 2038.10 | 20% | 895.24 | 60.00 |
| 2038.11 | ∞ | 30% | 2038.10 | 288.57 |

**Base gravable ISR** = `salarioBruto - afpTrabajador - isssTrabajador`

Para cada tramo: si `porcentaje === 0` → ISR = 0; si no →  
`ISR = (baseGravable - sobreExcedente) * porcentaje + cuotaFija`

*(Existe también tabla quincenal en el código Flutter; la app UI usa principalmente cálculo mensual.)*

### 4.3 Funciones de cálculo

| Función | Regla |
|---------|--------|
| `calcularAFPTrabajador(bruto)` | `bruto * 7.25%` (sin tope) |
| `calcularAFPPatronal(bruto)` | `bruto * 8.75%` (sin tope) |
| `calcularISSSTrabajador(bruto)` | Si `bruto >= 1000` → **30**; si no → `bruto * 3%` |
| `calcularISSSPatronal(bruto)` | Si `bruto >= 1000` → **75**; si no → `bruto * 7.5%` |
| `calcularISR(...)` | Según tabla mensual y base gravable |
| `calcularSalario(bruto, afpEntidad?)` | Orquesta todo y devuelve `SalaryResult` |

### 4.4 Modelo `SalaryResult`

```typescript
interface SalaryResult {
  salarioBruto: number;
  afpTrabajador: number;
  afpPatronal: number;
  isssTrabajador: number;
  isssPatronal: number;
  renta: number;                    // ISR
  salarioNeto: number;
  salarioNetoQuincenal: number;     // salarioNeto / 2
  totalDeducciones: number;         // afp + isss + renta
  deduccionesTotalesPatronales: number;
  afpEntidad: string;               // "Crecer" | "Confia" (solo informativo; mismos %)
}

// Getters calculados
salarioLiquidoMensual = salarioBruto + deduccionesTotalesPatronales;
salarioLiquidoQuincenal = salarioLiquidoMensual / 2;
```

### 4.5 Regla 50/30/20

Sobre **salario neto**:

| Bucket | % | Campos |
|--------|---|--------|
| Necesidades | 50% | `necesidades`, `necesidadesQuincenal` |
| Gustos | 30% | `gustos`, `gustosQuincenal` |
| Ahorros | 20% | `ahorros`, `ahorrosQuincenal` |

`calcularAhorroAnual(salarioNeto)` → mensual = neto×20%, anual = mensual×12.

### 4.6 Proyección de beneficios anuales

Depende de `tenureKey`:

| Key | Etiqueta UI |
|-----|-------------|
| `menos_1` | Menos de 1 año |
| `1_3` | 1-3 años |
| `3_10` | 3-10 años |
| `mas_10` | Más de 10 años |

`calcularBeneficiosAnuales(salarioBruto, tenureKey)`:

- **Aguinaldo:** días según antigüedad (7 / 15 / 19 / 21) × salario diario (`bruto/30`).
- **Vacaciones:** 15 días + 30% prima → `15 * diario * 1.30`.
- **Indemnización (despido injustificado):** años estimados por tramo × 30 días (mín. 15 días) × diario.

### 4.7 Salarios mínimos 2025 (referencia)

- Industria/comercio/servicios: **$408.80**
- Maquila: **$402.26**
- Agrícola: **$272.72**

`validarSalarioMinimo(salario)` → `salario >= 408.80` (opcional en UI).

---

## 5. Pantalla: Calculadora

### Inputs persistentes (localStorage)

| Clave | Tipo | Default |
|-------|------|---------|
| `salary` | number | 0 |
| `afp_entity` | string | `"Crecer"` |
| `tenure` | string | `"1_3"` |

### UI — componentes

1. **SalaryInputCard**
   - Campo numérico salario bruto (`$` prefijo).
   - Botón limpiar.
   - Selector AFP: **Crecer** | **Confia** (no cambia porcentajes; solo se guarda y muestra en PDF/historial).
   - Chips antigüedad (4 opciones).
   - `onChange` → recalcular en tiempo real.

2. **ResultCard** (solo si `salario > 0`)
   - Destacar salario neto mensual y quincenal.
   - Gradiente primary → secondary.

3. **PresupuestoCTA**
   - Botón para navegar a `/presupuesto`.

4. **DeductionsBreakdownCard**
   - AFP 7.25%, ISSS 3% (con nota de tope $30), ISR, total deducciones.

5. **PatronalContributionsCard**
   - AFP patronal 8.75%, ISSS patronal 7.5% (tope $75), total patronal.
   - Salario líquido mensual/quincenal para empleador.

6. **BenefitsProjectionCard**
   - Aguinaldo, vacaciones, indemnización (estimado anual).
   - Disclaimer legal: estimaciones según Código de Trabajo SV.

7. **ShareActionsMenu** (AppBar cuando hay resultado)
   - Guardar en historial (modal con título opcional, max 50 chars).
   - Compartir imagen (captura de widget resumen).
   - Compartir PDF / Vista previa PDF.

### Cálculo en tiempo real

`useMemo` o derivado de estado: cuando cambia `salary`, `afp_entity`, `tenure` → `calcularSalario` + `calcularBeneficiosAnuales` + `calcular503020`.

---

## 6. Pantalla: Mi Presupuesto (50/30/20)

### Prerrequisito

`salarioNeto` efectivo > 0:

```
effectiveSalarioNeto = simulatedNetSalary ?? salaryResult.salarioNeto
```

- `simulatedNetSalary`: opcional en localStorage; permite probar un neto sin recalcular bruto (p. ej. desde historial).
- Si no hay salario → pantalla vacía con enlace a Calculadora.

### Modelo de gasto (`Expense`)

```typescript
type ExpenseCategory = 'necesidades' | 'gustos' | 'ahorros';

interface Expense {
  id: string;              // timestamp ms como string
  nombre: string;
  monto: number;
  categoria: ExpenseCategory;
  descripcion?: string;
  fechaCreacion: string;   // ISO date
  esRecurrente: boolean;   // default true
  icono?: string;          // clave de icono (ver mapas abajo)
}
```

**Regla de negocio importante:** La categoría **ahorros** en gastos manuales está **deprecada**. El ahorro mostrado es **automático**:

```
ahorroAutomatico = max(0, salarioNeto - totalNecesidades - totalGustos)
```

Solo se agregan gastos en **necesidades** y **gustos** (el formulario no debe ofrecer categoría ahorros al crear).

### Modelo `BudgetSummary`

Calculado a partir de gastos + salario neto:

| Campo | Fórmula |
|-------|---------|
| `presupuestoNecesidades` | neto × 0.50 |
| `presupuestoGustos` | neto × 0.30 |
| `presupuestoAhorros` | neto × 0.20 |
| `totalNecesidades/Gustos/Ahorros` | suma por categoría (ahorro = automático) |
| `saldoRestante` | neto - (nec + gustos + ahorro) |
| `diferencia*` | presupuesto - gastado por categoría |
| `porcentaje*` | (gastado / neto) × 100 |
| `estaDentroPresupuesto` | saldoRestante >= 0 |

### UI — secciones

1. **Banner educativo** (dismissible, persistir `budget_edu_banner_dismissed` en localStorage).
2. **Dashboard “Tu Dinero Libre”** — muestra `totalAhorros` (ahorro automático) con barras de progreso por categoría.
3. **Categorías expandibles** (3 cards: Necesidades, Gustos, Ahorro).
   - Necesidades/Gustos: lista de gastos, editar, eliminar, agregar.
   - Ahorro: solo mensaje motivacional + monto automático (no lista editable).
4. **Carrusel educativo** (3+ slides explicando 50/30/20).
5. **Proyección anual** = `totalAhorros * 12`.
6. **FAB** “Agregar Gasto” → modal/bottom sheet.

### Formulario agregar/editar gasto

- Nombre (requerido).
- Monto (requerido, > 0).
- Categoría: necesidades | gustos.
- Descripción opcional.
- Selector de icono por categoría (mapas `ExpenseIcons` en `expense_model.dart`).
- Gastos sugeridos/templates opcionales: Renta, Electricidad, Netflix, etc.

### Acciones

- CRUD gastos (IndexedDB o localStorage array).
- “Limpiar presupuesto” → confirmación → borrar todos los gastos.

### Iconos sugeridos (mapear a Lucide/Heroicons)

**Necesidades:** money, home, bolt, water_drop, wifi, phone, local_grocery_store, directions_bus, school, medical_services…

**Gustos:** restaurant, movie, shopping_bag, sports_soccer, subscriptions, celebration…

**Ahorros (solo referencia UI):** savings, account_balance, emergency, travel_explore…

---

## 7. Pantalla: Historial

### Modelo `SalaryHistoryEntry`

```typescript
interface SalaryHistoryEntry {
  id: string;                    // UUID o key de storage
  salarioBruto: number;
  salarioNeto: number;
  salarioNetoQuincenal: number;
  afpTrabajador: number;
  isssTrabajador: number;
  renta: number;
  totalDeducciones: number;
  afpEntidad: string;
  fecha: string;                 // ISO
  nota?: string;                 // legacy
  title?: string;                // nombre personalizado ("Oferta empresa X")
  tenure?: string;
}
```

`displayTitle` = `title` || `nota` || `"Cálculo {fecha formateada}"`

### Lista

- Orden: fecha descendente.
- Card: título, bruto, neto, fecha.
- Tap → bottom sheet / drawer con detalle completo.
- Eliminar individual / limpiar todo.

### Acción “Probar en mi Presupuesto”

Desde detalle del historial:

1. Restaurar en calculadora: `salary`, `afp_entity`, `tenure` del entry.
2. `clearSimulation()` del neto simulado.
3. Navegar a `/presupuesto`.
4. Toast: “Presupuesto actualizado con nuevo salario”.

*(Nota: en Flutter el botón restaura bruto y va a presupuesto; el presupuesto usa el neto recalculado del bruto restaurado.)*

---

## 8. Persistencia local (web)

| Datos | Clave sugerida | Contenido |
|-------|----------------|-----------|
| Salario y prefs | `current_salary` | `{ salary, afp_entity, tenure, simulated_net_salary? }` |
| Historial | `salary_history` | `SalaryHistoryEntry[]` |
| Gastos | `expenses` | `Expense[]` |
| Preferencias UI | `app_prefs` | `{ budget_edu_banner_dismissed: boolean }` |

**Sin backend en v1:** todo client-side. Opcional futuro: sync con cuenta (Supabase, etc.).

---

## 9. Exportación y compartir

### Imagen

- Widget `ShareableResultWidget`: resumen visual (bruto, deducciones, neto, 50/30/20).
- Capturar DOM → PNG → Web Share API o descarga `salary_calculation_{timestamp}.png`.

### PDF

Contenido mínimo (ver `pdf_service.dart`):

- Fecha/hora, nota opcional.
- Salario bruto, entidad AFP.
- Deducciones trabajador (AFP, ISSS, ISR, total).
- Aportes patronales.
- Salario neto mensual/quincenal.
- Regla 50/30/20.
- Footer legal: “Cálculo estimado… consultar contador”.

Acciones: descargar, compartir, vista previa en nueva pestaña.

---

## 10. Diseño y UX

| Aspecto | Valor |
|---------|--------|
| Color seed | `#006B5E` (teal) |
| Tipografía | Inter |
| Estilo | Material 3 — cards con `border-radius: 20px`, elevación 0, bordes sutiles |
| Modo | Claro + oscuro (preferencia sistema) |
| Locale fechas | `es` — `dd MMM yyyy` |
| Moneda | `Intl.NumberFormat('es-SV', { style: 'currency', currency: 'USD' })` |
| Animaciones | Entrada suave en cards (opcional: Framer Motion) |
| Responsive | Mobile-first; en desktop considerar max-width centrado (~480–640px) o layout 2 columnas |

---

## 11. Estructura de carpetas sugerida (Next.js 14+ App Router)

```
salary-calculator-web/
├── app/
│   ├── layout.tsx              # ThemeProvider, fuentes, metadata
│   ├── page.tsx                # Calculadora
│   ├── presupuesto/page.tsx
│   └── historial/page.tsx
├── components/
│   ├── calculator/
│   ├── budget/
│   ├── history/
│   └── ui/                     # shadcn
├── lib/
│   ├── salary/
│   │   ├── calculator.ts       # port de salary_calculator_service
│   │   ├── constants.ts
│   │   └── types.ts
│   ├── budget/
│   │   └── budget-service.ts
│   └── storage/
│       └── local-storage.ts
├── hooks/
│   ├── use-salary-calculator.ts
│   ├── use-budget.ts
│   └── use-history.ts
└── __tests__/
    └── salary-calculator.test.ts  # casos: $1500 ISSS tope, tramos ISR
```

---

## 12. Casos de prueba obligatorios (lógica)

Portar tests unitarios con estos escenarios:

| Salario bruto | Verificar |
|---------------|-----------|
| $500 | ISR = 0 (tramo exento) |
| $1,000 | ISSS trabajador = $30, patronal = $75 |
| $1,500 | ISSS topado; ISR según base gravable |
| $2,500 | Tramo ISR 30% |
| Cualquiera | `salarioNeto = bruto - afp - isss - renta` |
| $1,200 neto | 50/30/20 → 600 / 360 / 240 |
| Presupuesto | Gastos 400+300 en neto 1000 → ahorro auto = 300 |

---

## 13. Fases de implementación recomendadas

### Fase 1 — Core (MVP)
- [ ] `lib/salary/calculator.ts` con tests
- [ ] Página Calculadora + persistencia salario/AFP/tenure
- [ ] Cards de resultado, deducciones, patronal, beneficios

### Fase 2 — Presupuesto
- [ ] CRUD gastos + BudgetSummary + UI 50/30/20
- [ ] Banner y carrusel educativo
- [ ] Enlace Calculadora ↔ Presupuesto

### Fase 3 — Historial
- [ ] Guardar/listar/eliminar cálculos
- [ ] Detalle + “Probar en presupuesto”

### Fase 4 — Exportación
- [ ] PDF e imagen compartible

### Fase 5 — Pulido
- [ ] PWA (manifest, offline básico)
- [ ] SEO (`metadata`: calculadora salario El Salvador)
- [ ] Accesibilidad (labels, contraste, teclado)

---

## 14. Fuera de alcance v1 (opcional después)

- Autenticación / sync en la nube.
- Gráficos avanzados (`fl_chart` no se usa mucho en la app actual).
- Cálculo ISR quincenal en UI (existe en código pero no es flujo principal).
- Notificaciones push.
- Versión multi-país (app es **solo El Salvador**).

---

## 15. Prompt inicial para Cursor (proyecto nuevo)

Copiar al abrir el repo Next.js vacío:

```
Construye una app Next.js 14 (App Router, TypeScript, Tailwind, shadcn/ui) 
llamada "Calculadora Salarial SV" según PLAN_MIGRACION_NEXTJS.md.

Prioridades:
1. Portar EXACTAMENTE la lógica de lib/salary desde las constantes y fórmulas del doc (AFP, ISSS con topes, ISR 2025, 50/30/20, beneficios por tenure).
2. Tres rutas: /, /presupuesto, /historial con navegación inferior en móvil.
3. Persistencia en localStorage (salario, gastos, historial, prefs).
4. Español, moneda USD, locale es-SV.
5. Tests unitarios para salary calculator con los casos del doc.

No inventes porcentajes ni tablas ISR: usa solo las del documento.
```

---

## 16. Referencia rápida de archivos Flutter

| Área | Archivos clave |
|------|----------------|
| Cálculo | `lib/services/salary_calculator_service.dart` |
| Presupuesto | `lib/services/budget_service.dart`, `lib/screen/budget_screen.dart` |
| Modelos | `lib/models/expense_model.dart`, `lib/models/salary_history_model.dart` |
| Estado | `lib/providers/salary_provider.dart`, `budget_provider.dart`, `history_provider.dart` |
| UI Calc | `lib/screen/calculator_screen.dart`, `lib/widgets/salary_input_card.dart` |
| Share/PDF | `lib/services/share_service.dart`, `lib/services/pdf_service.dart` |
| Persistencia | `lib/services/hive_service.dart` |

---

*Documento generado para migración Flutter → Next.js. Actualizar si cambian leyes fiscales o laborales de El Salvador.*
