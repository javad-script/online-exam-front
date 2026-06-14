import { Suspense } from "react";
import { Outlet } from "react-router";
import { Spinner } from "../../../../components/ui/spinner";
import Header from "../shared/header";
import Sidebar from "../shared/sidebar";

export default function DashboardLayout() {
	return (
		<div className="flex h-auto">
			<Sidebar />

			<main className="relative flex-1 ">
				<Header />
				<div className="px-4 pt-4">
					<Suspense fallback={<Spinner />}>
						<Outlet />
					</Suspense>
				</div>
			</main>
		</div>
	);
}
