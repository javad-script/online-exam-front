import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";
import { queryClient } from "../lib/react-query";

export default function Providers() {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
		</QueryClientProvider>
	);
}
