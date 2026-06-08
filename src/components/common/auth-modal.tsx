"use client";

import { RequestOtpForm } from "@/features/auth/request-otp";
import { useAuth } from "@/stores/auth.store";
import { Dialog } from "../ui/dialog";

export default function AuthModal() {
	const authStep = useAuth((s) => s.step);
	const closeAuthModal = useAuth((s) => s.closeAuthModal);
	const isAuthModalOpen = useAuth((s) => s.isAuthModalOpen);
	return (
		<Dialog onOpenChange={closeAuthModal} open={isAuthModalOpen}>
			{authStep === "otp" && <RequestOtpForm />}
		</Dialog>
	);
}
