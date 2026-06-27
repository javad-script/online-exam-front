import * as z from "zod";
import type { TQuestion } from "../../question-bank/types/question.types";

function combineDateAndTime(date: Date | undefined, time: string) {
	const hours = Number(time.slice(0, 2));
	const minutes = Number(time.slice(2, 4));
	const startTime = new Date(date ?? new Date());
	startTime.setHours(hours, minutes, 0, 0);
	return startTime;
}

export const schema = z
	.object({
		title: z.string().min(3, "عنوان آزمون باید حداقل 3 کاراکتر باشد"),
		description: z.string(),
		random_questions: z.boolean(),
		random_options: z.boolean(),
		show_result: z.boolean(),
		duration_minutes: z
			.string("مدت الزامی است")
			.min(1, "مدت باید حداقل 1 دقیقه باشد")
			.transform(Number),
		questions: z.array(z.number()).min(1, "آزمون باید حداقل یک سوال داشته باشد"),
		// این فیلد کمکی کل آبجکت سوالات را در فرم نگه می‌دارد تا با ریلود صفحه متن سوالات گم نشود
		selectedQuestionsData: z.array(z.any()).default([]),
		date: z.date({ error: "تاریخ الزامی است" }),
		status: z.enum(["draft", "published"]).default("published"),
		time: z
			.string()
			.transform((val) => val.replace(/:/g, ""))
			.refine((val) => /^(?:(?:[01]\d|2[0-3])[0-5]\d|2400)$/.test(val), {
				message: "ساعت نامعتبر است",
			}),
	})
	.transform(({ date, time, selectedQuestionsData, ...rest }) => ({
		...rest,
		start_time: combineDateAndTime(date, time),
	}));

export type FormValues = z.input<typeof schema> & { selectedQuestionsData?: TQuestion[] };
export type FormOutput = z.output<typeof schema>;

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
