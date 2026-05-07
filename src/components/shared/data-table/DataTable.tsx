"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel, // 1. Importar esto
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";
import React, { useState } from "react"; // 2. Importar useState

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  showPagination?: boolean;
  filters?: React.ReactNode;
  renderSubComponent?: (props: { row: any }) => React.ReactNode;
  meta?: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  isLoading = false,
  showPagination = true,
  filters,
  renderSubComponent, // Desestructurar la prop
  meta,
}: DataTableProps<TData, TValue>) {
  // 4. Estado para controlar qué filas están expandidas
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded, // Pasar el estado
    },
    onExpandedChange: setExpanded, // Función para actualizar estado
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(), // 5. Plugin para expansión
    getRowCanExpand: () => true,
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
    meta: meta,
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {filters && <div className="w-full">{filters}</div>}

      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-primary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3.5 text-left font-bold uppercase tracking-widest text-[10px]"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                    <span className="text-xs font-medium uppercase tracking-tighter">
                      Sincronizando datos...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                // 6. Usar Fragment para permitir la fila extra del subcomponente
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-muted/30 transition-colors group">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-gray-600">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* 7. Renderizado condicional de la fila de contactos */}
                  {row.getIsExpanded() && renderSubComponent && (
                    <tr className="bg-muted/10">
                      <td
                        colSpan={row.getVisibleCells().length}
                        className="p-0"
                      >
                        {renderSubComponent({ row })}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground italic text-xs uppercase"
                >
                  No se encontraron registros en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
            Mostrando registros del{" "}
            <span className="text-primary">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            al{" "}
            <span className="text-primary">
              {Math.min(currentPage * pageSize, total)}
            </span>{" "}
            de <span className="text-primary">{total}</span>
          </p>

          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center text-[11px] font-bold text-primary bg-muted px-3 h-8 rounded-md border border-border uppercase">
              Página {currentPage} / {totalPages || 1}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:text-secondary hover:border-secondary transition-all"
                onClick={() => onPageChange?.(1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:text-secondary hover:border-secondary transition-all"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:text-secondary hover:border-secondary transition-all"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:text-secondary hover:border-secondary transition-all"
                onClick={() => onPageChange?.(totalPages)}
                disabled={currentPage >= totalPages || isLoading}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
