import type { RouteObject } from "react-router";
import ProtectedRoute from "@/routes/protected-route";
import QuestionBankSinglePage from "./features/question-bank/pages/question-bank.page";
import QuestionBankPage from "./features/question-bank/pages/question-banks.page";
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
						element: <QuestionBankSinglePage />,
					},
				],
			},
		],
	},
];
