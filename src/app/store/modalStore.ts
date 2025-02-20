import { create } from "zustand";

// 재구독 모달 관련 전역상태
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
