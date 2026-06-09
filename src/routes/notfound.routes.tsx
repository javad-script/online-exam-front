import { Navigate, type RouteObject } from "react-router";

const notFoundRedirect: RouteObject = {
	path: "*",
	element: <Navigate replace to="/404" />,
};
const notFoundRoute: RouteObject = {
	path: "/404",
	element: <span>not found</span>,
};
export const notfound = [notFoundRedirect, notFoundRoute];
