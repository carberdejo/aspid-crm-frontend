"use client";

import { SegmentsTab } from "@/components/industry-segments/SegmentsTab";
import { PortfoliosTab } from "@/components/portfolio/PortfoliosTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Factory } from "lucide-react";

export default function MasterDataPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Datos Maestros
          </h2>
          <p className="text-muted-foreground">
            Configuración global de rubros industriales y carteras de
            ingeniería.
          </p>
        </div>
      </div>

      <Tabs defaultValue="segments" className="space-y-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-slate-100 p-1">
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Factory size={16} />
            Segmentos
          </TabsTrigger>
          <TabsTrigger value="portfolios" className="flex items-center gap-2">
            <Briefcase size={16} />
            Carteras
          </TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="border-none p-0 outline-none">
          <SegmentsTab />
        </TabsContent>

        <TabsContent
          value="portfolios"
          className="border-none p-0 outline-none"
        >
          <PortfoliosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
