import type { RouteObject } from "react-router";
import QuestionBankSinglePage from "./pages/question-bank.page";
import QuestionBankPage from "./pages/question-banks.page";

export const QuestionBankRoutes: RouteObject[] = [
	{
		path: "question-bank",
		element: <QuestionBankPage />,
	},
	{
		path: "question-bank/:id",
		element: <QuestionBankSinglePage />,
	},
];
