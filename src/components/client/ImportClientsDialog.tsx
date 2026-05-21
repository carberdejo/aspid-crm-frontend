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
  RefreshCw,
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

  // Controla si mostramos los 10 primeros o la lista completa con scroll
  const [showAllRucs, setShowAllRucs] = useState(false);

  const { mutate: importExcel, isPending } = useImportClients();

  // Limpiamos los estados si el modal se cierra
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setFile(null);
        setResults(null);
        setShowAllRucs(false);
      }, 300);
    }
    onOpenChange(isOpen);
  };

  const handleImport = () => {
    if (!file) return;
    setShowAllRucs(false);
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
                Sube el archivo Excel maestro (.xlsx o .csv) para cargar o
                sincronizar la base de datos comercial.
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
                  RUC, RAZON SOCIAL, DIRECCION, ACTUAL, SEGMENTO.
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

        {/* VISTA 2: REPORTE DE RESULTADOS (UPSERT) */}
        {results && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-primary">
                Reporte de Importación y Sincronización
              </DialogTitle>
              <DialogDescription>
                Resultados del procesamiento del archivo en la base de datos.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Tarjetas de Resumen actualizadas al Upsert */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                  <CheckCircle2 className="text-emerald-500 mb-2" size={28} />
                  <span className="text-2xl font-black text-emerald-700">
                    {results.stats.successfullyInserted}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                    Nuevos
                  </span>
                </div>

                {/* Cambiado a Azul para representar actualizaciones exitosas */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                  <RefreshCw
                    className="text-blue-500 mb-2 animate-none"
                    size={26}
                  />
                  <span className="text-2xl font-black text-blue-700">
                    {results.stats.successfullyUpdated}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    Actualizados
                  </span>
                </div>

                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                  <XCircle className="text-red-500 mb-2" size={28} />
                  <span className="text-2xl font-black text-red-700">
                    {results.stats.errorsCount}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                    Errores
                  </span>
                </div>
              </div>

              {/* Detalle de RUCs Actualizados (Con Scroll Opcional Expandible) */}
              {results.details.updatedRucs &&
                results.details.updatedRucs.length > 0 && (
                  <Alert
                    variant="info"
                    className="bg-blue-50/50 border-blue-200 transition-all duration-300"
                  >
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800 font-bold">
                      Empresas Actualizadas (Sincronizadas)
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 text-xs mt-2">
                      Se actualizaron los datos de{" "}
                      {results.details.updatedRucs.length} clientes existentes
                      de forma correcta.
                      {!showAllRucs ? (
                        /* VISTA CONTRAÍDA */
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {results.details.updatedRucs
                            .slice(0, 10)
                            .map((ruc) => (
                              <Badge
                                key={ruc}
                                variant="outline"
                                className="bg-white text-blue-700 border-blue-200 font-mono"
                              >
                                {ruc}
                              </Badge>
                            ))}
                          {results.details.updatedRucs.length > 10 && (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 border-blue-300 cursor-pointer hover:bg-blue-200 transition-colors flex items-center gap-1 font-bold"
                              onClick={() => setShowAllRucs(true)}
                            >
                              +{results.details.updatedRucs.length - 10} más{" "}
                              <ChevronDown size={12} />
                            </Badge>
                          )}
                        </div>
                      ) : (
                        /* VISTA EXPANDIDA CON SCROLL INTERNO */
                        <div className="mt-3">
                          <div className="max-h-[140px] overflow-y-auto bg-white/75 border border-blue-200 rounded-md p-2 flex flex-wrap gap-1.5 custom-scrollbar shadow-inner">
                            {results.details.updatedRucs.map((ruc) => (
                              <Badge
                                key={ruc}
                                variant="outline"
                                className="bg-white text-blue-700 border-blue-200 font-mono"
                              >
                                {ruc}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={() => setShowAllRucs(false)}
                              className="text-[10px] font-bold text-blue-800 hover:text-blue-600 flex items-center gap-1 transition-colors uppercase tracking-wider"
                            >
                              Ocultar lista <ChevronUp size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

              {/* Detalle de Errores Críticos (Filas rotas o RUCs repetidos dentro del Excel) */}
              {results.details.errors.length > 0 && (
                <Alert
                  variant="destructive"
                  className="bg-red-50/50 border-red-200"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-bold">
                    Filas Omitidas o Corruptas
                  </AlertTitle>
                  <AlertDescription className="text-xs mt-2">
                    Las siguientes {results.details.errors.length} filas
                    presentaron inconsistencias y fueron omitidas para
                    resguardar la BD:
                    <div className="mt-3 max-h-[150px] overflow-y-auto bg-white rounded-lg border border-red-100 custom-scrollbar shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-red-50 sticky top-0 border-b border-red-100">
                          <tr>
                            <th className="px-3 py-2 font-bold text-red-800 text-[11px] uppercase tracking-wider">
                              Fila Excel
                            </th>
                            <th className="px-3 py-2 font-bold text-red-800 text-[11px] uppercase tracking-wider">
                              Motivo del Rechazo
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.details.errors.map((err, i) => (
                            <tr
                              key={i}
                              className="border-t border-red-50 hover:bg-red-50/40 transition-colors"
                            >
                              <td className="px-3 py-1.5 font-mono text-red-600 font-bold">
                                {err.row}
                              </td>
                              <td className="px-3 py-1.5 text-slate-600 font-medium">
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
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8 transition-transform active:scale-95 shadow-md"
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
