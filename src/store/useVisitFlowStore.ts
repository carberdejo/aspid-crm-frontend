import { create } from "zustand";

export type FlowType = "VISIT" | "QUOTE" | null;
export type ModalType = "MAIN" | "CLIENT" | "CONTACT" | null;

interface VisitFlowStore {
  // --- ESTADO ---
  activeModal: ModalType;
  flowType: FlowType;
  newClientId?: string; // ID del cliente que acaba de registrarse
  newContactId?: string; // ID del contacto que acaba de registrarse
  selectedClientId?: string; // ID del cliente seleccionado

  // --- ACCIONES DE NAVEGACIÓN ---
  openMain: (flow: FlowType) => void;
  openClient: () => void;
  openContact: () => void;
  closeAll: () => void;
  backToMain: () => void;

  // --- ACCIONES DE DATOS ---
  setNewClientId: (id?: string) => void;
  setNewContactId: (id?: string) => void;
  clearNewClientId: () => void;
  clearNewContactId: () => void;

  setSelectedClientId: (id?: string) => void;
}

export const useVisitFlowStore = create<VisitFlowStore>((set) => ({
  // 1. Estado Inicial
  activeModal: null,
  flowType: null,
  newClientId: undefined,
  newContactId: undefined,
  selectedClientId: undefined,

  // 2. Navegación de modales
  // Zustand fusiona esto automáticamente con el resto del estado, no borra los IDs
  // Al abrir el MAIN, marcamos qué flujo es (VISIT o QUOTE)
  openMain: (flow) => set({ activeModal: "MAIN", flowType: flow }),
  openClient: () => set({ activeModal: "CLIENT" }) /* PROXIMO A ELIMINAR */,
  openContact: () => set({ activeModal: "CONTACT" }),

  // Aquí sí sobreescribimos todo para resetear
  closeAll: () =>
    set({
      activeModal: null,
      flowType: null,
      newClientId: undefined /* PROXIMO A ELIMINAR */,
      newContactId: undefined,
      selectedClientId: undefined,
    }),
  backToMain: () => set({ activeModal: "MAIN" }),

  // 3. Gestión de IDs de nuevos registros
  setNewClientId: (id) => set({ newClientId: id }) /* PROXIMO A ELIMINAR */,
  setNewContactId: (id) => set({ newContactId: id }),
  clearNewClientId: () =>
    set({ newClientId: undefined }) /* PROXIMO A ELIMINAR */,
  clearNewContactId: () => set({ newContactId: undefined }),

  // 4. Gestión del cliente seleccionado actualmente
  setSelectedClientId: (id) => set({ selectedClientId: id }),
}));
