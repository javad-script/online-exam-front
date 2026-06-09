import { Navigate, type RouteObject } from "react-router";
import NotFoundPage from "@/pages/not-found-page";

const notFoundRedirect: RouteObject = {
	path: "*",
	element: <Navigate replace to="/404" />,
};
const notFoundRoute: RouteObject = {
	path: "/404",
	element: <NotFoundPage />,
};
export const notfound = [notFoundRedirect, notFoundRoute];
