import { Department } from '@/interfaces';
import { create } from 'zustand';

interface DepartmentState {
  departments: Department[];
  isLoading: boolean;
  setDepartments: (departments: Department[]) => void;
  setLoading: (loading: boolean) => void;
  getDepartmentName: (deptId: number) => string | undefined;
}

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  isLoading: true,

  setDepartments: (departments: Department[]) => {
    set({ departments, isLoading: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  getDepartmentName: (deptId: number) => {
    const { departments } = get();
    return departments.find((d) => d.id === deptId)?.name;
  },
}));
