import { create } from "zustand";

type UserState = {
  hasLogin: boolean;

  setHasLogin: (value: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  hasLogin: false,

  setHasLogin: (value) => set({ hasLogin: value }),
}));
