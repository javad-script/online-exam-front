import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function RootLayout() {
	return (
		<>
			<Outlet />
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
