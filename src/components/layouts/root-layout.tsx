import { Outlet } from "react-router";
import { Toaster } from "sonner";
import AuthModal from "../common/auth-modal";

export default function RootLayout() {
	return (
		<>
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
		</>
	);
}
