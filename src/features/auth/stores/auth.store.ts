import { create } from "zustand";
import { persist } from "zustand/middleware";

type TAuth = {
	token: string | null;
	setToken: (token: string) => void;
	logout: () => void;
	otpBlockExpireTime: Date | null;
	setOtpBlockExpireTime: (otpBlockExpireTime: number) => void;
};

export const useAuth = create<TAuth>()(
	persist(
		(set) => ({
			token: null,
			setToken: (token: string) => set({ token }),
			logout: () => set({ token: null }),
			otpBlockExpireTime: null,
			setOtpBlockExpireTime: (second: number) =>
				set({ otpBlockExpireTime: new Date(Date.now() + 1000 * second) }),
		}),
		{ name: "auth" },
	),
);
