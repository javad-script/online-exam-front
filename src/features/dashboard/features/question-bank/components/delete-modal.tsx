import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import type { TQuestionBank } from "../types/question-bank.types";

export function DeleteBankModal({ row }: { row: TQuestionBank }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const queryClient = useQueryClient();
	const deleteMutation = useMutation({
		mutationFn: async () => {
			await api.delete(`/api/dashboard/banks/${row.id}`);
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["question-banks"],
			});
			setIsDeleteDialogOpen(false);
		},
	});
	return (
		<AlertDialog onOpenChange={setIsDeleteDialogOpen} open={isDeleteDialogOpen}>
			<AlertDialogTrigger
				render={
					<Button
						className="w-full bg-transparent px-2 hover:text-destructive justify-start"
						variant="ghost"
					>
						<Trash2Icon />
						حذف بانک
					</Button>
				}
			/>

			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>حذف بانک {row.title}</AlertDialogTitle>

					<AlertDialogDescription>
						این عملیات قابل بازگشت نیست و تمام اطلاعات مرتبط به‌ صورت دائمی حذف خواهند شد.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>انصراف</AlertDialogCancel>

					<AlertDialogAction
						className="text-destructive/65 hover:text-destructive"
						onClick={() => deleteMutation.mutate()}
						variant="outline"
					>
						{deleteMutation.isPending ? "در حال حذف..." : "حذف بانک"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
