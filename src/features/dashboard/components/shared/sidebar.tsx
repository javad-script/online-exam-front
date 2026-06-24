import { FilesIcon, LandmarkIcon, LayoutDashboardIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { sidebarStore } from "@/stores/sidebar.store";

type TNavItem = {
	label: string;
	href: string;
	icon: ReactNode;
};

const navItems = [
	{
		label: "داشبورد",
		href: "/",
		icon: <LayoutDashboardIcon className="size-4.5" />,
	},
	{
		label: "آزمون ها",
		href: "/exams",
		icon: <FilesIcon className="size-4.5" />,
	},
	{
		label: "بانک سوالات",
		href: "/question-bank",
		icon: <LandmarkIcon className="size-4.5" />,
	},
] satisfies TNavItem[];

export default function Sidebar() {
	const isSidebarOpen = sidebarStore((s) => s.isSidebarOpen);

	return (
		<>
			<aside
				className={cn(
					"border-foreground/25 text-foreground bg-background lg fixed top-0 right-0 z-50 h-svh w-8/10 border-l transition-transform duration-300 sm:w-64 lg:sticky lg:w-64 lg:transition-none",
					isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
				)}
			>
				<Link
					className="border-foreground/25 flex h-18 w-full items-center gap-4 border-b px-4"
					to={"/"}
				>
					<img alt="." className="size-8 rounded-full" src="/favicon.svg" />
					<h1 className="text-lg font-light">فرا آزمون</h1>
				</Link>
				<nav className="mt-10 flex w-full flex-col gap-2 px-4">
					{navItems.map((i) => (
						<NavItem {...i} key={i.href} />
					))}
				</nav>
			</aside>
			<SidebarOverlay />
		</>
	);
}

export function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
	const closeSidebar = sidebarStore((s) => s.closeSidebar);
	return (
		<Link
			className="hover:bg-muted flex h-full w-full items-center gap-2 rounded-lg px-2 py-2 transition"
			onClick={closeSidebar}
			to={href}
		>
			{icon}
			<span className="text-base">{label}</span>
		</Link>
	);
}

export function SidebarOverlay() {
	const closeSidebar = sidebarStore((s) => s.closeSidebar);
	const isSidebarOpen = sidebarStore((s) => s.isSidebarOpen);

	if (!isSidebarOpen) return null;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: this is overlay
		// biome-ignore lint/a11y/useKeyWithClickEvents: this is overlay
		<div
			className="bg-foreground/20 fixed top-0 left-0 z-40 h-full w-full lg:hidden"
			onClick={closeSidebar}
		></div>
	);
}
