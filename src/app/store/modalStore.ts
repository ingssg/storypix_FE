import { create } from "zustand";

// 모달 관련 전역상태
type ModalState = {
  isRenewModalOpen: boolean;
  isSidebarOpen: boolean;
  isFirstGuideModalOpen: boolean;

  setIsRenewModalOpen: (value: boolean) => void;
  setIsSidebarOpen: (value: boolean) => void;
  setIsFirstGuideModalOpen: (value: boolean) => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isRenewModalOpen: false,
  isSidebarOpen: true,
  isFirstGuideModalOpen: true,

  setIsRenewModalOpen: (value) => set({ isRenewModalOpen: value }),
  setIsSidebarOpen(value) {
    set({ isSidebarOpen: value });
  },
  setIsFirstGuideModalOpen(value) {
    set({ isFirstGuideModalOpen: value });
  },
}));
