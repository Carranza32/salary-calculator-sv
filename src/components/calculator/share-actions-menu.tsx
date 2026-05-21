"use client";

import { useState } from "react";
import { Download, ImageIcon, Save, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { ShareableResultWidget } from "@/components/share/shareable-result-widget";
import { exportResultAsImage, exportResultAsPdf } from "@/lib/export/share-export";
import { useSalaryStore } from "@/stores/salary-store";
import { useHistoryStore } from "@/stores/history-store";

export function ShareActionsMenu() {
  const result = useSalaryStore((s) => s.result);
  const salary = useSalaryStore((s) => s.salary);
  const afpEntity = useSalaryStore((s) => s.afpEntity);
  const tenure = useSalaryStore((s) => s.tenure);
  const saveEntry = useHistoryStore((s) => s.saveEntry);

  const [saveOpen, setSaveOpen] = useState(false);
  const [title, setTitle] = useState("");

  if (!result || result.salarioBruto <= 0) return null;

  const handleSave = () => {
    saveEntry({
      salarioBruto: salary,
      afpEntidad: afpEntity,
      tenure,
      title: title || undefined,
    });
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
      await exportResultAsPdf(result, title || undefined);
      toast.success("PDF descargado");
    } catch {
      toast.error("No se pudo generar el PDF");
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setSaveOpen(true)}>
          <Save className="h-4 w-4" />
          Guardar
        </Button>
        <Button variant="outline" size="sm" onClick={handleImage}>
          <ImageIcon className="h-4 w-4" />
          Imagen
        </Button>
        <Button variant="outline" size="sm" onClick={handlePdf}>
          <Download className="h-4 w-4" />
          PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleImage}>
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
      </div>

      <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
        <ShareableResultWidget id="shareable-result" />
      </div>

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
