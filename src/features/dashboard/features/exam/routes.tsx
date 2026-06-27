import type { RouteObject } from "react-router";
import ExamsPage from "./pages/exams.page";
import NewExamPage from "./pages/new-exam.page";

export const examRoutes: RouteObject[] = [
	{
		path: "exams",
		element: <ExamsPage />,
	},
	{
		path: "exams/new",
		element: <NewExamPage />,
	},
	{
		path: "exams/:examId/edit",
		element: <div>hi</div>,
	},
];
