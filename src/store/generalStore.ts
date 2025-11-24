import { create } from "zustand";
import { persist } from "zustand/middleware";

type General = {
  loadingKey?: string;
};

type GeneralState = {
  general: General | null;
  setGeneral: (general: General) => void;
  updateGeneral: (data: Partial<General>) => void;
  clearGeneral: () => void;
};

export const generalStore = create<GeneralState>()(
  persist(
    (set) => ({
      general: null,
      setGeneral: (general) => set({ general }),
      updateGeneral: (data) =>
        set((state) => ({
          general: state.general ? { ...state.general, ...data } : null,
        })),
      clearGeneral: () => set({ general: null }),
    }),
    {
      name: "general", // this will store in localStorage with this name
    }
  )
);
