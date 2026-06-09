import type { RouteObject } from "react-router";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import ProtectedRoute from "./protected-route";

export const dashboardRoutes: RouteObject[] = [
	{
		element: <ProtectedRoute />,
		children: [
			{
				path: "/",
				element: <DashboardLayout />,
			},
		],
	},
];
