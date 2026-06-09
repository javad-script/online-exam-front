import { create } from "zustand";
import { persist } from "zustand/middleware";

type TAuth = {
	mobile: string;
	setMobile: (mobile: string) => void;
	token: string | null;
	setToken: (token: string) => void;
	clear: () => void;
	otpBlockExpireTime: Date | null;
	setOtpBlockExpireTime: (otpBlockExpireTime: number) => void;
};

export const useAuth = create<TAuth>()(
	persist(
		(set) => ({
			mobile: "",
			setMobile: (mobile: string) => set({ mobile }),
			token: null,
			setToken: (token: string) => set({ token }),
			clear: () => set({ mobile: "", token: "" }),
			otpBlockExpireTime: null,
			setOtpBlockExpireTime: (second: number) =>
				set({ otpBlockExpireTime: new Date(Date.now() + 1000 * second) }),
		}),
		{ name: "auth" },
	),
);
