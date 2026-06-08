import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { queryClient } from "../../lib/react-query";
import { Toaster } from "../ui/sonner";
import AuthModal from "./auth-modal";

export default function Providers() {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
			<AuthModal />
			<Toaster
				dir="rtl"
				duration={4000}
				position="top-left"
				richColors={true}
				swipeDirections={["left", "top"]}
				theme="light"
			/>
		</QueryClientProvider>
	);
}
