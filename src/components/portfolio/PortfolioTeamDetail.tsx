// src/components/portfolio/table/PortfolioTeamDetail.tsx
import { Row } from "@tanstack/react-table";
import { Portfolio, PortfolioUser } from "@/interfaces/portfolio.interface";

interface PortfolioTeamDetailProps {
  row: Row<Portfolio>;
}

export function PortfolioTeamDetail({ row }: PortfolioTeamDetailProps) {
  const team = row.original.users || [];

  if (team.length === 0) {
    return (
      <div className="p-4 bg-slate-50/50 border-l-4 border-slate-300 m-2 rounded-r-lg shadow-inner">
        <p className="text-xs font-medium text-slate-500 italic">
          No hay miembros asignados a esta cartera.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50/50 border-l-4 border-secondary/50 m-2 rounded-r-lg shadow-inner">
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
        Detalle del Equipo
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {team.map((member: PortfolioUser) => (
          <div
            key={member.id}
            className="bg-white border rounded-md p-3 flex flex-col shadow-sm"
          >
            <span className="font-bold text-sm text-primary">
              {member.user.firstName} {member.user.lastName}
            </span>
            <span className="text-xs font-semibold text-secondary-text mt-1">
              {member.roleInPortfolio}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
