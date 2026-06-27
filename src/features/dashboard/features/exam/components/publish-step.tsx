import { useFormContext } from "react-hook-form";
import { FieldError } from "@/components/ui/field";

import { type FormValues, schema } from "../validations/new-exam.validation";

export function PublishStep() {
	const { watch, formState } = useFormContext<FormValues>();
	const values = watch();

	const { data, success } = schema.safeParse(values);

	return (
		<div className="space-y-4 pt-4">
			{success ? (
				<ExamSummaryCard {...data} />
			) : (
				<p className="text-muted-foreground text-center text-sm">
					لطفاً مراحل قبلی را تکمیل کنید تا خلاصه آزمون نمایش داده شود.
				</p>
			)}

			{formState.errors.questions?.message && <FieldError errors={[formState.errors.questions]} />}
		</div>
	);
}

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface ExamSummaryProps {
	start_time: Date;
	title: string;
	description: string;
	random_questions: boolean;
	random_options: boolean;
	show_result: boolean;
	duration_minutes: number;
	questions: number[];
	status: "draft" | "published";
}

export function ExamSummaryCard(props: ExamSummaryProps) {
	return (
		<>
			<p className="mx-auto text-muted-foreground w-full text-center text-lg">
				خلاصه اطلاعات و تنظیمات آزمون
			</p>
			<Table className="text-right" dir="rtl">
				<TableBody>
					<TableRow>
						<TableCell className="font-medium">عنوان آزمون</TableCell>
						<TableCell className="text-right w-1/2">{props.title}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">توضیحات</TableCell>
						<TableCell className="text-right w-1/2">{props.description}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">وضعیت انتشار</TableCell>
						<TableCell className="text-right w-1/2">
							{props.status === "published" ? "منتشر شده" : "پیش‌نویس"}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">مدت زمان (دقیقه)</TableCell>
						<TableCell className="text-right w-1/2">{props.duration_minutes} دقیقه</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">تعداد سوالات</TableCell>
						<TableCell className="text-right w-1/2">{props.questions.length} سوال</TableCell>
					</TableRow>

					<TableRow>
						<TableCell className="font-medium">نمایش نتیجه</TableCell>
						<TableCell className="text-right w-1/2">{props.show_result ? "بله" : "خیر"}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">سوالات تصادفی</TableCell>
						<TableCell className="text-right w-1/2">
							{props.random_questions ? "بله" : "خیر"}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell className="font-medium">گزینه‌های تصادفی</TableCell>
						<TableCell className="text-right w-1/2">
							{props.random_options ? "بله" : "خیر"}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
}
