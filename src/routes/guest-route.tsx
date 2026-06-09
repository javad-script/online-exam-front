import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/features/auth/stores/auth.store";

export default function GuestRoute() {
	const token = useAuth((s) => s.token);

	if (token) return <Navigate replace to="/" />;
	return <Outlet />;
}
