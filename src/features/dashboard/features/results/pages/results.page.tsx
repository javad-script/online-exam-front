import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CopyPlusIcon, EditIcon, EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ReTable } from "@/features/dashboard/components/re-table";
import { getResults } from "../api/results.api";
import { ExamDeleteModal } from "../components/result-delete-modal";
import type { TExam } from "../types/exam.types";

const colHeaders = {
	title: "عنوان",
	status: "وضعیت",
	description: "نوع",
	duration_minutes: "مدت",
	show_result: "نمایش نتیجه",
	show_correct_answers: "نمایش پاسخ صحیح",
	random_questions: "سوالات تصادفی",
	random_options: "گزینه های تصادفی",
	published_at: "تاریخ انتشار",
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
	const { data, error, isLoading } = useQuery({
		queryKey: ["results"],
		queryFn: () => getResults(),
		staleTime: 1000 * 60,
	});
	useEffect(() => {
		if (error) toast.error("خطا در دریافت اطلاعات");
	}, [error]);
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">آزمون های پایان یافته</CardTitle>
				<CardDescription>می توانید آزمون های پایان یافته را مدیریت کنید</CardDescription>
			</CardHeader>
			<CardContent>
				<ReTable
					colHeaders={colHeaders}
					columns={columns}
					config={{
						search: { placeholder: "جستجو", enabled: true, column: "title" },
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
				<DropdownMenuGroup onClick={() => setOpen(false)}>
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
