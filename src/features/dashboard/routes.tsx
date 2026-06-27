import type { RouteObject } from "react-router";
import ProtectedRoute from "@/routes/protected-route";
import { examRoutes } from "./features/exam/routes";
import { QuestionBankRoutes } from "./features/question-bank/routes";
import { resultsRoutes } from "./features/results/routes";
import DashboardLayout from "./layouts/dashboard-layout";
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
					...examRoutes,
					...resultsRoutes,
					...QuestionBankRoutes,
				],
			},
		],
	},
];
