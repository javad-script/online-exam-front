import type { RouteObject } from "react-router";
import RequestPage from "@/features/auth/pages/request-page";
import VerifyPage from "@/features/auth/pages/verify-page";
import GuestRoute from "@/routes/guest-route";

export const authRoutes: RouteObject[] = [
	{
		element: <GuestRoute />,
		children: [
			{
				path: "/auth/request",
				element: <RequestPage />,
			},
			{
				path: "/auth/verify",
				element: <VerifyPage />,
			},
		],
	},
];
