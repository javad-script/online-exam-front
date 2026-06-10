import type { RouteObject } from "react-router";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import ProtectedRoute from "@/routes/protected-route";
import MainPage from "./pages/main-page";

export const dashboardRoutes: RouteObject[] = [
	{
		element: <ProtectedRoute />,
		children: [
			{
				element: <DashboardLayout />,
				children: [
					{
						index: true,
						element: <MainPage />,
					},
					{
						path: "exams",
						element: <div>exams</div>,
					},
				],
			},
		],
	},
];
