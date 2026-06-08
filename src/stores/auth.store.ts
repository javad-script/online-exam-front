import { create } from "zustand";
import { persist } from "zustand/middleware";

type TAuth = {
	mobile: string;
	setMobile: (mobile: string) => void;
	step: "otp" | "verify";
	setStep: (step: string) => void;
	token: string | null;
	setToken: (token: string) => void;
	clear: () => void;
	isAuthModalOpen: boolean;
	openAuthModal: () => void;
	closeAuthModal: () => void;
};

export const useAuth = create<TAuth>()(
	persist(
		(set) => ({
			mobile: "",
			setMobile: (mobile: string) => set({ mobile }),
			step: "otp",
			setStep: (step: "otp" | "verify") => set({ step }),
			token: null,
			setToken: (token: string) => set({ token }),
			clear: () => set({ mobile: "", step: "otp", token: "" }),
			isAuthModalOpen: false,
			openAuthModal: () => set({ isAuthModalOpen: true }),
			closeAuthModal: () => set({ isAuthModalOpen: false }),
		}),
		{ name: "auth" },
	),
);
