import { create } from "zustand";

type ModalState = {
  isRenewModalOpen: boolean;
  isSidebarOpen: boolean;

  setIsRenewModalOpen: (value: boolean) => void;
  setIsSidebarOpen: (value: boolean) => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isRenewModalOpen: false,
  isSidebarOpen: true,

  setIsRenewModalOpen: (value) => set({ isRenewModalOpen: value }),
  setIsSidebarOpen(value) {
    set({ isSidebarOpen: value });
  },
}));
