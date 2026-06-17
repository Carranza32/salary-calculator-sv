"use client";

import { useRef, useState } from "react";
import { useSalaryStore } from "@/stores/salary-store";
import { useHistoryStore } from "@/stores/history-store";
import { formatCurrency } from "@/lib/format";
import { Download, ImageIcon, Save, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShareableResultWidget } from "@/components/share/shareable-result-widget";
import { exportResultAsImage, exportResultAsPdf } from "@/lib/export/share-export";
import { useCountUp } from "@/hooks/use-count-up";

export function ResultCard() {
  const result = useSalaryStore((s) => s.result);
  const salary = useSalaryStore((s) => s.salary);
  const afpEntity = useSalaryStore((s) => s.afpEntity);
  const tenure = useSalaryStore((s) => s.tenure);
  const viewPerspective = useSalaryStore((s) => s.viewPerspective);
  const includeInsaforp = useSalaryStore((s) => s.includeInsaforp);
  const benefits = useSalaryStore((s) => s.benefits);
  const saveEntry = useHistoryStore((s) => s.saveEntry);

  const [saveOpen, setSaveOpen] = useState(false);
  const [title, setTitle] = useState("");

  // ── GSAP count-up refs ────────────────────────────────────────────────
  const heroRef = useRef<HTMLSpanElement>(null);
  const biweeklyRef = useRef<HTMLSpanElement>(null);

  // Derive values before early return (hooks must always run)
  const isFreelance = result?.isFreelance ?? false;
  const showEmployerCost = viewPerspective === "empleador" && !isFreelance;

  const mainAmount = result
    ? showEmployerCost
      ? result.salarioLiquidoMensual
      : result.salarioNeto
    : 0;

  const biweeklyAmount = result
    ? showEmployerCost
      ? result.salarioLiquidoQuincenal
      : result.salarioNeto / 2
    : 0;

  // ── Count-up animations (always before early return) ─────────────────
  useCountUp(heroRef, mainAmount, formatCurrency, 0.45);
  useCountUp(biweeklyRef, biweeklyAmount, formatCurrency, 0.40);

  if (!result || result.salarioBruto <= 0) return null;

  const mainLabel = showEmployerCost
    ? "Costo total mensual"
    : isFreelance
    ? "Líquido a recibir"
    : "Salario neto mensual";

  const subLabel = showEmployerCost
    ? "Costo quincenal estimado"
    : "Cada quincena";

  const footNote = isFreelance
    ? "Servicios Profesionales · Retención 10%"
    : showEmployerCost
    ? `Aportes patronales incluidos${includeInsaforp ? " + Insaforp" : ""}`
    : "Calculado con tabla ISR 2026";

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleSave = () => {
    saveEntry({ salarioBruto: salary, afpEntidad: afpEntity, tenure, title: title || undefined });
    toast.success("Cálculo guardado en historial");
    setSaveOpen(false);
    setTitle("");
  };

  const handleImage = async () => {
    try {
      await exportResultAsImage("shareable-result");
      toast.success("Imagen lista para compartir");
    } catch {
      toast.error("No se pudo generar la imagen");
    }
  };

  const handlePdf = async () => {
    try {
      console.log("handlePdf: Iniciando generación de PDF...", {
        result,
        viewPerspective,
        includeInsaforp,
        hasBenefits: !!benefits
      });
      await exportResultAsPdf(
        result,
        viewPerspective,
        includeInsaforp,
        benefits,
        title || undefined
      );
      console.log("handlePdf: PDF generado con éxito");
      toast.success("PDF descargado");
    } catch (err) {
      console.error("handlePdf: Error capturado en generación de PDF:", err);
      toast.error("No se pudo generar el PDF");
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/?s=${salary}&afp=${afpEntity}&ant=${tenure}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Calculadora Salarial El Salvador 2026",
          text: `Calculé mi salario neto de $${salary} en El Salvador.`,
          url: shareUrl,
        });
        toast.success("¡Cálculo compartido!");
      } catch {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Enlace copiado al portapapeles");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  return (
    <>
      {/* ── Card Shell ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl text-white"
        style={{
          background: "linear-gradient(145deg, #1aab7c 0%, #127a57 55%, #0d5c40 100%)",
          boxShadow:
            "0 20px 60px -10px rgba(18, 122, 87, 0.55), 0 4px 20px -4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* ── Subtle ambient glows ────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 20% 0%, rgba(255,255,255,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 85% 100%, rgba(0,0,0,0.18) 0%, transparent 70%)",
          }}
        />

        {/* ── Content ─────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col gap-0">

          {/* Top section: label + hero number */}
          <div className="px-7 pt-7 pb-5">
            {/* Label row */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-100/70 mb-1 select-none">
              {mainLabel}
            </p>

            {/* Hero amount */}
            <div className="flex items-end gap-3 mt-1">
              <span
                ref={heroRef}
                className="font-extrabold tracking-tight tabular-nums leading-none"
                style={{ fontSize: "clamp(2.6rem, 6vw, 3.5rem)" }}
              >
                {formatCurrency(mainAmount)}
              </span>
            </div>

            {/* Footnote */}
            <p className="mt-2 text-[11px] text-emerald-100/55 font-medium select-none">
              {footNote}
            </p>
          </div>

          {/* Divider */}
          <div
            className="mx-7"
            style={{ height: "1px", background: "rgba(255,255,255,0.10)" }}
          />

          {/* Bottom section: Quincena + Actions */}
          <div className="px-7 py-5 flex items-center justify-between gap-4 flex-wrap">
            {/* Quincena pill */}
            <div
              className="flex flex-col gap-0.5"
              style={{
                background: "rgba(0,0,0,0.15)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "14px",
                padding: "10px 16px",
                minWidth: "160px",
              }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100/60 select-none">
                {subLabel}
              </span>
              <span ref={biweeklyRef} className="text-xl font-bold tabular-nums text-white">
                {formatCurrency(biweeklyAmount)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { label: "Guardar", icon: Save, onClick: () => setSaveOpen(true) },
                { label: "Imagen", icon: ImageIcon, onClick: handleImage },
                { label: "PDF", icon: Download, onClick: handlePdf },
                { label: "Compartir", icon: Share2, onClick: handleShare },
              ].map(({ label, icon: Icon, onClick }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60 flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white transition-all duration-200 px-3 py-2 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.16)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.08)";
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Off-screen share widget ──────────────────────────────────── */}
      <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
        <ShareableResultWidget id="shareable-result" />
      </div>

      {/* ── Save Dialog ───────────────────────────────────────────────── */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar en historial</DialogTitle>
            <DialogDescription>
              Nombre opcional (máx. 50 caracteres) para comparar ofertas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="history-title">Título</Label>
            <Input
              id="history-title"
              maxLength={50}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Oferta Empresa X"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default ResultCard;
