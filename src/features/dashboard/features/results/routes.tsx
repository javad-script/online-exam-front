import type { RouteObject } from "react-router";
import ExamsPage from "./pages/results.page";

export const resultsRoutes: RouteObject[] = [
	{
		path: "results",
		element: <ExamsPage />,
	},
	{
		path: "results/:examId",
		element: <div>hi</div>,
	},
];
