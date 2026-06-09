import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/stores/auth.store";

export default function ProtectedRoute() {
	const token = useAuth((s) => s.token);

	if (!token) return <Navigate replace to="/auth" />;

	return <Outlet />;
}
