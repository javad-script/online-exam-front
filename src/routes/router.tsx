import { createBrowserRouter, type RouteObject } from "react-router";
import Providers from "@/app/providers";
import RootLayout from "@/components/layouts/root-layout";
import { authRoutes } from "@/features/auth/routes";
import { dashboardRoutes } from "@/features/dashboard/routes";
import { notfound } from "./not-found.routes";

const exam: RouteObject = {
	path: "/e/:examId",
	element: <span>exam id</span>,
};

const router = createBrowserRouter([
	{
		element: <Providers />,
		children: [
			{
				element: <RootLayout />,
				children: [...dashboardRoutes, ...authRoutes, exam, ...notfound],
			},
		],
	},
]);

export default router;
