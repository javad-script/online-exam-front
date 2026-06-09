"use client";

import { BellIcon, PlusIcon, SidebarIcon } from "lucide-react";
import { Fragment } from "react";
import { useLocation } from "react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { sidebarStore } from "@/stores/sidebar.store";

export default function Header() {
	const openSidebar = sidebarStore((s) => s.openSidebar);

	return (
		<header className="border-foreground/25 bg-background fixed top-0 z-30 flex h-18 w-full items-center justify-between border-b px-4 transition-all duration-0 lg:right-64 lg:w-[calc(100vw-16rem)]">
			<div className="flex items-center gap-2">
				<Button className="lg:hidden" onClick={openSidebar} size={"icon-lg"} variant={"ghost"}>
					<SidebarIcon className="size-4.5" />
				</Button>
				<Separator className="my-auto h-6 lg:hidden" orientation={"vertical"} />
				<HeaderBreadcrumb />
			</div>

			<div className="flex items-center gap-2">
				<Button className="flex items-center gap-1 rounded-md px-4 py-2">
					<span>آزمون جدید</span> <PlusIcon className="size-4.5" />
				</Button>
				<Popover>
					<PopoverTrigger>
						<Button className="relative px-2 py-2" variant={"ghost"}>
							<span className="bg-primary text-background absolute top-0 right-0 flex size-3 animate-pulse items-center justify-center rounded-full"></span>
							<BellIcon className="size-4.5" />
						</Button>
					</PopoverTrigger>
					<PopoverContent align="end" sideOffset={24}>
						list
					</PopoverContent>
				</Popover>
			</div>
		</header>
	);
}

const ROUTE_BREADCRUMB: Record<string, { label: string; path: string }> = {
	dashboard: { label: "داشبورد", path: "/" },
	exams: { label: "آزمون‌ ها", path: "/exams" },
};

function HeaderBreadcrumb() {
	const location = useLocation();
	const segments = location.pathname.slice(1).split("/");
	const lastIndex = segments.length - 1;

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{segments.map((segment, index) => {
					const route = ROUTE_BREADCRUMB[segment];
					if (!route) return null;

					const isLast = index === lastIndex;

					return (
						<Fragment key={segment}>
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className="text-base">{route.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink className="text-base" href={route.path}>
										{route.label}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
