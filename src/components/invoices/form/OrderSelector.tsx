"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  ChevronDown,
  Search,
  Building2,
  Receipt,
  Loader2,
} from "lucide-react";
// IMPORTA TU INTERFAZ REAL (Ajusta la ruta según tu proyecto)
import { PurchaseOrder } from "@/interfaces";

interface OrderSelectorProps {
  options: PurchaseOrder[];
  onSearch: (term: string) => void;
  onSelect: (order: PurchaseOrder) => void;
  selectedId?: number;
  isLoading?: boolean; // Añadimos esto para mostrar un loader cuando el hook esté buscando
}

export function OrderSelector({
  options,
  onSearch,
  onSelect,
  selectedId,
  isLoading = false,
}: OrderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOrder = options.find((opt) => opt.id === selectedId);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleSelect = (order: PurchaseOrder) => {
    onSelect(order);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* BOTÓN DISPARADOR */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-12 px-4 rounded-xl border bg-white cursor-pointer transition-all ${
          isOpen
            ? "border-rose-400 ring-4 ring-rose-500/10"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selectedOrder ? (
            <>
              <Receipt size={16} className="text-rose-500 shrink-0" />
              <span className="text-sm font-bold text-slate-700 truncate">
                {selectedOrder.poNumber}{" "}
                <span className="text-slate-300 font-normal mx-1">|</span>{" "}
                {selectedOrder.clientName}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-slate-400">
              Buscar orden pendiente...
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* MENÚ DESPLEGABLE */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-3 border-b border-slate-50 bg-slate-50/50">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                autoFocus
                placeholder="Buscar por cliente o N° orden..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/10 transition-all"
              />
            </div>
          </div>

          <div className="max-h-[240px] overflow-y-auto custom-scrollbar p-1.5">
            {isLoading ? (
              <div className="py-8 flex justify-center items-center">
                <Loader2 className="animate-spin text-rose-500" size={24} />
              </div>
            ) : options.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <Receipt size={24} className="text-slate-200 mb-2" />
                <p className="text-xs font-bold text-slate-400">
                  No se encontraron órdenes
                </p>
              </div>
            ) : (
              options.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleSelect(order)}
                  className={`flex flex-col p-3 rounded-xl cursor-pointer transition-all mb-1 last:mb-0 ${
                    selectedId === order.id
                      ? "bg-rose-50 border border-rose-100"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                      {order.poNumber}
                    </span>
                    {selectedId === order.id && (
                      <Check
                        size={14}
                        className="text-rose-500"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
                    <Building2 size={12} className="shrink-0" />
                    <span className="truncate">{order.clientName}</span>
                  </div>
                  <div className="mt-2 text-xs font-black text-rose-600 bg-white px-2 py-0.5 rounded border border-rose-100 self-start">
                    {order.currency}{" "}
                    {new Intl.NumberFormat("es-PE").format(order.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
