import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CopyPlusIcon, EditIcon, EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { getBankQuestions } from "../api/bank-questions.api";
import { DeleteQuestionModal } from "../components/question-delete-modal";
import { QuestionsTable } from "../components/questions-table";
import type { TQuestion } from "../types/question.types";

const colHeaders = {
	content: "متن سوال",
	type: "نوع",
	questions_grade: "نمره",
};

export const columns: ColumnDef<TQuestion>[] = [
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
		accessorKey: "content",
		header: "متن سوال",
		cell: ({ row }) => {
			return (
				<Link className="text-right" to={`#`}>
					{row.getValue("content")}
				</Link>
			);
		},
	},
	{
		accessorKey: "type",
		header: () => <div className="text-right">نوع</div>,
		cell: ({ row }) => {
			const value: keyof typeof questionTypes = row.getValue("type");

			return (
				<Badge className="text-right font-medium" variant={"secondary"}>
					{questionTypes[value] ?? "ناشناخته"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "grade",
		header: "نمره",
	},
	{
		id: "actions",
		header: () => <div className="text-right">عملیات</div>,
		cell: ({ row }) => <QuestionActions row={row.original} />,
	},
];

export const questionTypes = {
	MULTIPLE_CHOICE_FOUR_OPTIONS: "چهار گزینه‌ای",
	MULTIPLE_CHOICE: "چند گزینه‌ای",
	TRUE_FALSE: "درست / نادرست",
	SHORT_ANSWER: "پاسخ کوتاه",
	LONG_ANSWER: "پاسخ تشریحی",
	FILL_IN_THE_BLANK: "جای خالی",
	MATCHING: "تطبیقی",
	DESCRIPTIVE: "تشریحی",
} as const;

export default function QuestionBankSinglePage() {
	const { id } = useParams();
	const { data, error } = useQuery({
		queryKey: ["bank-questions", id],
		queryFn: () => getBankQuestions(id as string),
		staleTime: 1000 * 60,
		enabled: id !== undefined,
	});
	useEffect(() => {
		if (error) toast.error("خطا در دریافت اطلاعات");
	}, [error]);
	return (
		<div>
			<QuestionsTable
				colHeaders={colHeaders}
				columns={columns}
				config={{
					search: { placeholder: "جستجو در سوالات", enabled: true, column: "question" },
					pagination: true,
					select: true,
					visibility: true,
				}}
				data={data?.data.questions ?? []}
			/>
		</div>
	);
}

type QuestionBankActionsProps = {
	row: TQuestion;
};

export function QuestionActions({ row }: QuestionBankActionsProps) {
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
						<EyeIcon />
						مشاهده
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate(`#`)}>
						<EditIcon />
						ویرایش
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(row.id))}>
						<CopyPlusIcon />
						کپی شناسه
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					<DeleteQuestionModal row={row} />
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
