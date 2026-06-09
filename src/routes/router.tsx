import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import Providers from "@/components/common/providers";
import RootLayout from "@/components/layouts/root-layout";
import { authRoutes } from "./auth.routes";
import { dashboardRoutes } from "./dashboard.routes";

const other: RouteObject = {
	path: "*",
	element: <Navigate replace to="/404" />,
};
const notFound: RouteObject = {
	path: "/404",
	element: <span>not found</span>,
};
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
				children: [...dashboardRoutes, ...authRoutes, exam, notFound, other],
			},
		],
	},
]);

export default router;
