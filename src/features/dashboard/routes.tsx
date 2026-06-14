import type { RouteObject } from "react-router";
import DashboardLayout from "@/features/dashboard/components/layouts/dashboard-layout";
import ProtectedRoute from "@/routes/protected-route";
import QuestionBankPage from "./features/question-bank/pages/question-bank-page";
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
					{
						path: "question-bank",
						element: <QuestionBankPage />,
					},
					{
						path: "question-bank/:id",
						element: <div>question-bank</div>,
					},
				],
			},
		],
	},
];
