import { create } from "zustand";
import type { Channel, Space } from "../types";

export type ViewMode = "home" | "friends" | "space";

interface AppState {
  viewMode: ViewMode;
  selectedSpace: Space | null;
  selectedChannel: Channel | null;
  setViewMode: (mode: ViewMode) => void;
  selectSpace: (space: Space | null) => void;
  selectChannel: (channel: Channel | null) => void;
  openFriends: () => void;
  openHome: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  viewMode: "home",
  selectedSpace: null,
  selectedChannel: null,
  setViewMode: (viewMode) => set({ viewMode }),
  selectSpace: (selectedSpace) =>
    set({
      viewMode: selectedSpace ? "space" : "home",
      selectedSpace,
      selectedChannel: null,
    }),
  selectChannel: (selectedChannel) => set({ selectedChannel }),
  openFriends: () =>
    set({
      viewMode: "friends",
      selectedSpace: null,
      selectedChannel: null,
    }),
  openHome: () =>
    set({
      viewMode: "home",
      selectedSpace: null,
      selectedChannel: null,
    }),
}));
