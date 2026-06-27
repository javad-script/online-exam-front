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
import { deleteExam } from "../api/exams.api";
import type { TExam } from "../types/exam.types";

export function ExamDeleteModal({ row }: { row: TExam }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const queryClient = useQueryClient();
	const deleteMutation = useMutation({
		mutationFn: async () => {
			await deleteExam(row.id);
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["exams"],
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
						حذف آزمون
					</Button>
				}
			/>

			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>حذف آزمون</AlertDialogTitle>

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
						{deleteMutation.isPending ? "در حال حذف..." : "تایید"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
