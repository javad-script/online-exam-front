import { Suspense } from "react";
import { Outlet } from "react-router";
import Header from "../common/header";
import Sidebar from "../common/sidebar";
import { Spinner } from "../ui/spinner";

export default function DashboardLayout() {
	return (
		<div className="flex h-auto">
			<Sidebar />
			<Header />
			<main className="relative flex-1 px-4 pt-22">
				<Suspense fallback={<Spinner />}>
					<Outlet />
				</Suspense>
			</main>
		</div>
	);
}
