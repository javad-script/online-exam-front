import { useSuspenseQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CopyPlusIcon, DoorOpenIcon, EditIcon, MoreHorizontalIcon } from "lucide-react";
import { lazy } from "react";
import { Link, useNavigate } from "react-router";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/axios";
import type { TApiResponse } from "@/validations/api-response.validation";
import { DeleteBankModal } from "../components/delete-modal";
import { QuestionBankTable } from "../components/question-bank-table";
import type { TQuestionBank } from "../types/question-bank.types";

const QuestionBankDrawer = lazy(() => import("../components/question-bank-drawer"));

export const columns: ColumnDef<TQuestionBank>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				aria-label="Select all"
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && false)}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				aria-label="Select row"
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
			/>
		),
	},
	{
		accessorKey: "title",
		header: "نام",
		cell: ({ row }) => {
			return (
				<Link className="text-right" to={`/question-bank/${row.original.id}`}>
					{row.getValue("title")}
				</Link>
			);
		},
	},
	{
		accessorKey: "is_public",
		header: () => <div className="text-right">نوع</div>,
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
		header: "تعداد سوالات",
	},
	{
		id: "actions",
		header: () => <div className="text-right">عملیات</div>,
		cell: ({ row }) => <QuestionBankActions row={row.original} />,
	},
];

export default function QuestionBankPage() {
	const { data } = useSuspenseQuery({
		queryKey: ["question-banks"],
		queryFn: async () => {
			const res = await api.get<TApiResponse<TQuestionBank[]>>("/api/dashboard/banks");

			return res.data.data;
		},
		staleTime: 10_000,
	});

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
				<QuestionBankTable columns={columns} data={data ?? []} />
			</CardContent>
		</Card>
	);
}

type QuestionBankActionsProps = {
	row: TQuestionBank;
};

export function QuestionBankActions({ row }: QuestionBankActionsProps) {
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button className="h-8 w-8 p-0" variant="ghost">
					<MoreHorizontalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
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
