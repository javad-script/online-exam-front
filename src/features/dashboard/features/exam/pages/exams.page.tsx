import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CopyPlusIcon, EditIcon, EyeIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { ReTable } from "@/features/dashboard/components/shared/re-table";
import { getExams } from "../api/exams.api";
import { ExamDeleteModal } from "../components/exam-delete-modal";
import type { TExam } from "../types/exam.types";

const colHeaders = {
	title: "عنوان",
	description: "توضیحات",
	duration_minutes: "مدت",
	status: "وضعیت",
	question_count: "سوالات",
	time_frame: "بازه زمانی",
};

export const columns: ColumnDef<TExam>[] = [
	{
		accessorKey: "title",
		header: "عنوان",
		cell: ({ row }) => {
			return (
				<Link className="text-right" to={`./${row.id}/edit`}>
					{row.getValue("title")}
				</Link>
			);
		},
	},
	{
		accessorKey: "description",
		header: "توضیحات",
		cell: ({ row }) => {
			const value: string = row.getValue("description");
			return (
				<div className="text-right truncate">
					{value.length > 60 ? `${value.slice(0, 60)}...` : value}
				</div>
			);
		},
	},
	{
		accessorKey: "duration_minutes",
		header: "مدت",
		cell: ({ row }) => `${row.getValue("duration_minutes")}  دقیقه`,
	},
	{
		accessorKey: "status",
		header: () => <div className="text-right">وضعیت</div>,
		cell: ({ row }) => {
			const value: keyof typeof examStatus = row.getValue("status");

			return (
				<Badge
					className="text-right font-medium"
					variant={value === "draft" ? "secondary" : "default"}
				>
					{examStatus[value] ?? "ناشناخته"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "questions_count",
		header: "سوالات",
		cell: ({ row }) => `${row.getValue("questions_count") ?? 0}  سوال`,
	},
	{
		accessorKey: "start_time",
		header: "بازه زمانی",
		cell: ({ row }) => {
			const value: string = row.getValue("start_time");
			const date = new Date(value);

			const datePart = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			}).format(date);

			const timePart = new Intl.DateTimeFormat("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
				hourCycle: "h23",
			}).format(date);

			return (
				<div className="w-full flex flex-col justify-center">
					<span>{datePart}</span>
					<span>ساعت {timePart}</span>
				</div>
			);
		},
	},
	{
		id: "actions",
		header: () => <div className="text-right">عملیات</div>,
		cell: ({ row }) => <ExamActions row={row.original} />,
	},
];

export const examStatus = {
	draft: "پیش نویس",
	published: "انتشار شده",
	closed: "پایان یافته",
} as const;

export default function ExamsPage() {
	const navigate = useNavigate();
	const { data, error, isLoading } = useQuery({
		queryKey: ["exams"],
		queryFn: () => getExams(),
		staleTime: 1000 * 60,
	});
	useEffect(() => {
		if (error) toast.error("خطا در دریافت اطلاعات");
	}, [error]);
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">آزمون ها</CardTitle>
				<CardDescription>می توانید آزمون جدید بسازید و انها را مدیریت کنید</CardDescription>
				<CardAction>
					<Button onClick={() => navigate("./new")}>
						<PlusIcon />
						ساخت آزمون جدید
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<ReTable
					colHeaders={colHeaders}
					columns={columns}
					config={{
						search: { placeholder: "جستجو در آزمون ها", enabled: true, column: "title" },
						pagination: true,
						select: false,
						visibility: true,
					}}
					data={data?.data ?? []}
					emptyMessage={isLoading ? <Spinner className="mx-auto" /> : "سوالی یافت نشد!"}
				/>
			</CardContent>
		</Card>
	);
}

type ExamActionsProps = {
	row: TExam;
};

export function ExamActions({ row }: ExamActionsProps) {
	const [open, setOpen] = useState(false);

	const navigate = useNavigate();

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger>
				<Button className="h-8 w-8 p-0" variant="ghost">
					<MoreHorizontalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuLabel>عملیات</DropdownMenuLabel>

					<DropdownMenuItem onClick={() => navigate(`${row.id}`)}>
						<EyeIcon />
						مشاهده
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate(`./${row.id}/edit`)}>
						<EditIcon />
						ویرایش
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(row.id))}>
						<CopyPlusIcon />
						کپی شناسه
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<ExamDeleteModal row={row} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
