import { create } from "zustand";

type SidebarStore = {
	isSidebarOpen: boolean;

	openSidebar: () => void;
	closeSidebar: () => void;
};

export const sidebarStore = create<SidebarStore>()((set) => ({
	isSidebarOpen: false,

	openSidebar: () => {
		set({ isSidebarOpen: true });
	},

	closeSidebar: () => {
		set({ isSidebarOpen: false });
	},
}));
