import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CopyPlusIcon, EditIcon, EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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
import { questionTypes } from "../../exam/validations/new-exam.validation";
import { getBankQuestions } from "../api/bank-questions.api";
import { DeleteQuestionModal } from "../components/question-delete-modal";
import type { TQuestion } from "../types/question.types";
import NewQuestionPage from "./new-question.page";

const colHeaders = {
	content: "متن سوال",
	type: "نوع",
};

export const columns: ColumnDef<TQuestion>[] = [
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
		id: "actions",
		header: () => <div className="text-right">عملیات</div>,
		cell: ({ row }) => <QuestionActions row={row.original} />,
	},
];

export default function QuestionBankSinglePage() {
	const { id } = useParams();
	const { data, error, isLoading } = useQuery({
		queryKey: ["bank-questions", id],
		queryFn: () => getBankQuestions(id as string),
		staleTime: 1000 * 60,
		enabled: id !== undefined,
	});
	useEffect(() => {
		if (error) toast.error("خطا در دریافت اطلاعات");
	}, [error]);
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">سوالات بانک</CardTitle>
				<CardDescription>می توانید سوالات رو در بانک های سوال مدیریت کنید</CardDescription>
				<CardAction>
					<NewQuestionPage />
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
	row: TQuestion;
};

export function QuestionActions({ row }: QuestionBankActionsProps) {
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
