import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CopyPlusIcon, DoorOpenIcon, EditIcon, MoreHorizontalIcon } from "lucide-react";
import { lazy, useEffect, useState } from "react";
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
import { ReTable } from "@/features/dashboard/components/re-table";
import { getQuestionBanks } from "../api/question-banks.api";
import { DeleteBankModal } from "../components/question-bank-delete-modal";
import type { TQuestionBank } from "../types/question-bank.types";

const QuestionBankDrawer = lazy(() => import("../components/question-bank-drawer"));

const colHeaders = {
	header: "متن سوال",
	description: "نوع",
	is_public: "دسترسی",
	questions_count: "سوالات",
};

export const columns: ColumnDef<TQuestionBank>[] = [
	// {
	// 	id: "select",
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			aria-label="Select all"
	// 			checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && false)}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			aria-label="Select row"
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 		/>
	// 	),
	// },
	{
		accessorKey: "title",
		header: "عنوان",
		cell: ({ row }) => {
			return (
				<Link className="text-right" to={`/question-bank/${row.original.id}`}>
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
				<div className="text-right max-w-auto">
					{value?.length > 60 ? `${value.slice(0, 60)}...` : value}
				</div>
			);
		},
	},
	{
		accessorKey: "is_public",
		header: () => <div className="text-right">دسترسی</div>,
		cell: ({ row }) => {
			const value = row.getValue("is_public");

			return (
				<Badge className="text-right font-medium" variant={value ? "default" : "secondary"}>
					{value ? "عمومی" : "خصوصی"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "questions_count",
		header: "سوالات",
		cell: ({ row }) => `${row.getValue("questions_count")} سوال`,
	},
	{
		id: "actions",
		header: () => <div className="text-right">عملیات</div>,
		cell: ({ row }) => <QuestionBankActions row={row.original} />,
	},
];

export default function QuestionBankPage() {
	const { data, error, isLoading } = useQuery({
		queryKey: ["question-banks"],
		queryFn: getQuestionBanks,
		staleTime: 1000 * 60,
	});
	useEffect(() => {
		if (error) toast.error("خطا در دریافت اطلاعات");
	}, [error]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">بانک سوالات</CardTitle>
				<CardDescription>
					می‌تونی سوال‌هات رو داخل بانک‌های سوال مختلف ذخیره و دسته‌بندی کنی و در ساخت هر آزمون، از همون
					سوال‌ها دوباره استفاده کنی.
				</CardDescription>
				<CardAction>
					<QuestionBankDrawer />
				</CardAction>
			</CardHeader>
			<CardContent>
				<ReTable
					colHeaders={colHeaders}
					columns={columns}
					config={{
						search: { placeholder: "جستجو در سوالات", enabled: true, column: "content" },
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

type QuestionBankActionsProps = {
	row: TQuestionBank;
};

export function QuestionBankActions({ row }: QuestionBankActionsProps) {
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
						<DoorOpenIcon />
						ورود به بانک
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate(`${row.id}`)}>
						<EditIcon />
						ویرایش
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(row.id))}>
						<CopyPlusIcon />
						کپی شناسه
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DeleteBankModal row={row} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
