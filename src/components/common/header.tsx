"use client";

import { BellIcon, PlusIcon, SidebarIcon, User2Icon } from "lucide-react";
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
import { useAuth } from "@/features/auth/stores/auth.store";
import { sidebarStore } from "@/stores/sidebar.store";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function Header() {
	const openSidebar = sidebarStore((s) => s.openSidebar);
	const logout = useAuth((s) => s.logout);

	return (
		<header className="border-foreground/25 bg-background fixed top-0 z-30 flex h-18 w-full items-center justify-between border-b px-4 transition-all duration-0 lg:right-64 lg:w-[calc(100vw-16rem)]">
			<div className="flex items-center gap-2">
				<Button className="lg:hidden" onClick={openSidebar} size={"icon-lg"} variant={"ghost"}>
					<SidebarIcon className="size-4.5" />
				</Button>
				<HeaderBreadcrumb className="hidden lg:block" />
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
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Avatar className="size-10">
							<AvatarFallback>
								<User2Icon />
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent sideOffset={24}>
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={logout}>خروج از حساب</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}

const ROUTE_BREADCRUMB: Record<string, { label: string; path: string }> = {
	dashboard: { label: "داشبورد", path: "/" },
	exams: { label: "آزمون‌ ها", path: "/exams" },
};

function HeaderBreadcrumb({ className }: { className?: string }) {
	const location = useLocation();
	const segments = location.pathname.split("/").filter(Boolean);
	const lastIndex = segments.length - 1;
	return (
		<Breadcrumb className={className}>
			<BreadcrumbList>
				<BreadcrumbLink
					className="text-base hover:text-foreground transition-colors text-foreground/70"
					to={ROUTE_BREADCRUMB.dashboard.path}
				>
					{ROUTE_BREADCRUMB.dashboard.label}
				</BreadcrumbLink>
				{segments.map((segment, index) => {
					const route = ROUTE_BREADCRUMB[segment];
					if (!route) return null;

					const isLast = index === lastIndex;
					const isFirst = index === 0;

					return (
						<Fragment key={segment}>
							{isFirst && <BreadcrumbSeparator />}
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage className="text-base">{route.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink
										className="text-base hover:text-foreground text-foreground/70 transition-colors"
										to={route.path}
									>
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
