"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileSpreadsheet,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ImportResults,
  useImportClients,
} from "@/hooks/client/useImportClients";

interface ImportClientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportClientsDialog({
  open,
  onOpenChange,
}: ImportClientsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ImportResults | null>(null);

  // NUEVO ESTADO: Controla si mostramos los 10 primeros o la lista completa con scroll
  const [showAllRucs, setShowAllRucs] = useState(false);

  const { mutate: importExcel, isPending } = useImportClients();

  // Limpiamos los estados si el modal se cierra
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setFile(null);
        setResults(null);
        setShowAllRucs(false); // Reseteamos la vista de RUCs al cerrar
      }, 300);
    }
    onOpenChange(isOpen);
  };

  const handleImport = () => {
    if (!file) return;
    setShowAllRucs(false); // Nos aseguramos de que empiece contraído
    importExcel(file, {
      onSuccess: (data) => {
        setResults(data);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {/* VISTA 1: SUBIR ARCHIVO */}
        {!results && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-primary text-xl">
                <FileSpreadsheet className="text-emerald-600" />
                Importación Masiva de Clientes
              </DialogTitle>
              <DialogDescription>
                Sube el archivo Excel maestro (.xlsx o .csv) para cargar la base
                de datos comercial.
              </DialogDescription>
            </DialogHeader>

            <div className="py-8">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
                <UploadCloud size={48} className="text-slate-400 mb-4" />
                <Input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="max-w-[250px] mb-2 cursor-pointer"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Asegúrate de que las columnas coincidan con el formato
                  estándar:
                  <br />
                  RUC, RAZON SOCIAL, DIRECCION, etc.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {isPending ? "Procesando Excel..." : "Iniciar Importación"}
              </Button>
            </div>
          </>
        )}

        {/* VISTA 2: REPORTE DE RESULTADOS */}
        {results && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-primary">
                Reporte de Importación
              </DialogTitle>
              <DialogDescription>
                Resultados del procesamiento del archivo.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Tarjetas de Resumen */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="text-emerald-500 mb-2" size={28} />
                  <span className="text-2xl font-black text-emerald-700">
                    {results.stats.successfullyInserted}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600">
                    Creados
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <AlertCircle className="text-amber-500 mb-2" size={28} />
                  <span className="text-2xl font-black text-amber-700">
                    {results.stats.skippedDuplicatesCount}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-600">
                    Omitidos (Duplicados)
                  </span>
                </div>
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <XCircle className="text-red-500 mb-2" size={28} />
                  <span className="text-2xl font-black text-red-700">
                    {results.stats.errorsCount}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-red-600">
                    Errores Críticos
                  </span>
                </div>
              </div>

              {/* Detalle de Omitidos */}
              {results.details.skippedRucs.length > 0 && (
                <Alert
                  variant="warning"
                  className="bg-amber-50/50 border-amber-200 transition-all duration-300"
                >
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800 font-bold">
                    RUCs Existentes
                  </AlertTitle>
                  <AlertDescription className="text-amber-700 text-xs mt-2">
                    Se omitieron {results.details.skippedRucs.length} clientes
                    porque ya existen en la base de datos.
                    {/* VISTA CONTRAÍDA (Muestra 10) */}
                    {!showAllRucs ? (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {results.details.skippedRucs.slice(0, 10).map((ruc) => (
                          <Badge
                            key={ruc}
                            variant="outline"
                            className="bg-white text-amber-700 border-amber-200"
                          >
                            {ruc}
                          </Badge>
                        ))}
                        {results.details.skippedRucs.length > 10 && (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 border-amber-300 cursor-pointer hover:bg-amber-200 transition-colors flex items-center gap-1"
                            onClick={() => setShowAllRucs(true)}
                          >
                            +{results.details.skippedRucs.length - 10} más{" "}
                            <ChevronDown size={12} />
                          </Badge>
                        )}
                      </div>
                    ) : (
                      /* VISTA EXPANDIDA (Scrollable) */
                      <div className="mt-3">
                        <div className="max-h-[140px] overflow-y-auto bg-white/60 border border-amber-200 rounded-md p-2 flex flex-wrap gap-1.5 custom-scrollbar">
                          {results.details.skippedRucs.map((ruc) => (
                            <Badge
                              key={ruc}
                              variant="outline"
                              className="bg-white text-amber-700 border-amber-200"
                            >
                              {ruc}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => setShowAllRucs(false)}
                            className="text-[10px] font-bold text-amber-800 hover:text-amber-600 flex items-center gap-1 transition-colors"
                          >
                            OCULTAR LISTA <ChevronUp size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {/* Detalle de Errores */}
              {results.details.errors.length > 0 && (
                <Alert variant="destructive" className="bg-red-50/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-bold">
                    Filas Corruptas en Excel
                  </AlertTitle>
                  <AlertDescription className="text-xs mt-2">
                    Corrige estas filas en tu Excel y vuelve a subir el archivo.
                    Los demás registros sí se guardaron.
                    <div className="mt-3 max-h-[150px] overflow-y-auto bg-white rounded border border-red-100 custom-scrollbar">
                      <table className="w-full text-left">
                        <thead className="bg-red-50 sticky top-0">
                          <tr>
                            <th className="px-3 py-2 font-bold text-red-800">
                              Fila Excel
                            </th>
                            <th className="px-3 py-2 font-bold text-red-800">
                              Motivo
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.details.errors.map((err, i) => (
                            <tr
                              key={i}
                              className="border-t border-red-50 hover:bg-red-50/30 transition-colors"
                            >
                              <td className="px-3 py-1.5 font-mono text-red-600">
                                {err.row}
                              </td>
                              <td className="px-3 py-1.5 text-slate-600">
                                {err.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end border-t pt-4">
              <Button
                onClick={() => handleOpenChange(false)}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 transition-transform active:scale-95"
              >
                Entendido
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
