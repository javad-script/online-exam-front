import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@reactuses/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	CheckIcon,
	CircleQuestionMarkIcon,
	InfoIcon,
	LoaderCircleIcon,
	SendIcon,
	SettingsIcon,
} from "lucide-react";
import { useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
	Stepper,
	StepperContent,
	StepperDescription,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperPanel,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/reui/stepper";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createExam } from "../api/exams.api";
import { PublishStep } from "../components/publish-step";
import { QuestionsStep } from "../components/questions-step";
import { SettingsStep } from "../components/settings-step";
import { useExamFormStore } from "../stores/draft-new-exam.store";
import { useNewExamWizardStore } from "../stores/new-exam-wizard.store";
import { type FormOutput, type FormValues, schema } from "../validations/new-exam.validation";

const steps = [
	{
		title: "تنظیمات",
		description: "اطلاعات اصلی",
		icon: <SettingsIcon className="size-4" />,
		component: SettingsStep,
		fields: ["title", "description", "date", "time", "duration_minutes"] as const,
	},
	{
		title: "سوالات",
		description: "مدیریت سوالات",
		icon: <CircleQuestionMarkIcon className="size-4" />,
		component: QuestionsStep,
		fields: ["questions"] as const,
	},
	{
		title: "انتشار",
		description: "بررسی نهایی",
		icon: <SendIcon className="size-4" />,
		component: PublishStep,
		fields: [] as const,
	},
];

export default function NewExamPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const formRef = useRef<HTMLFormElement>(null);

	// Zustand Stores
	const currentStep = useNewExamWizardStore((s) => s.currentStep);
	const setCurrentStep = useNewExamWizardStore((s) => s.setCurrentStep);

	const draft = useExamFormStore((state) => state.draft);
	const setDraft = useExamFormStore((state) => state.setDraft);
	const clearDraft = useExamFormStore((state) => state.clearDraft);

	// پارس کردن ایمن تاریخ پیش‌فرض لوکال‌استوری
	const defaultDate = useMemo(() => {
		if (!draft?.date) return undefined;
		const parsed = draft.date instanceof Date ? draft.date : new Date(draft.date);
		return Number.isNaN(parsed.getTime()) ? undefined : parsed;
	}, [draft?.date]);

	// مقداردهی اولیه فرم
	const form = useForm<FormValues, unknown, FormOutput>({
		resolver: zodResolver(schema),
		mode: "onSubmit",
		defaultValues: draft
			? { ...draft, date: defaultDate }
			: {
					title: "",
					description: "",
					random_questions: false,
					random_options: false,
					show_result: false,
					date: undefined,
					time: "",
					questions: [],
					selectedQuestionsData: [],
				},
	});

	// گوش دادن به مقادیر فرم بدون رندر مجدد کامپوننت با متد بسیار سبک watch() در متغیر خارجی
	const formData = form.watch();

	// بهینه‌سازی اصلی: استفاده از useDebounce برای اعمال تاخیر در نوشتن اطلاعات روی استور و لوکال‌استوری
	useDebounce(
		() => {
			setDraft(formData as FormValues);
		},
		500, // ۵۰۰ میلی‌ثانیه بعد از توقف کامل فعالیت کاربر عملیات ذخیره انجام می‌شود
		[formData],
	);

	const mutation = useMutation({
		mutationFn: (data: FormOutput) => createExam(data),
		onSuccess: () => {
			setCurrentStep(1);
			queryClient.invalidateQueries({ queryKey: ["exams"] });
			toast.success("آزمون با موفقیت ایجاد شد");
			clearDraft();
			navigate("/exams");
		},
	});

	const submit = (data: FormOutput) => {
		mutation.mutate(data);
	};

	const active = steps[currentStep - 1];

	const next = async () => {
		const valid = await form.trigger(active.fields);
		if (valid) {
			setCurrentStep(Math.min(currentStep + 1, steps.length));
		}
	};

	const prev = () => {
		setCurrentStep(Math.max(currentStep - 1, 1));
	};

	return (
		<FormProvider {...form}>
			<form id="exam-form" onSubmit={form.handleSubmit(submit)} ref={formRef}>
				<Stepper
					className="mx-auto w-full max-w-5xl space-y-8"
					indicators={{
						completed: <CheckIcon className="size-3.5" />,
						loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
					}}
					onValueChange={setCurrentStep}
					value={currentStep}
				>
					<StepperNav>
						{steps.map((step, index) => (
							<StepperItem className="relative" key={step.title} step={index + 1}>
								<StepperTrigger className="pointer-events-none">
									<StepperIndicator>{step.icon}</StepperIndicator>
									<div>
										<StepperTitle>{step.title}</StepperTitle>
										<StepperDescription>{step.description}</StepperDescription>
									</div>
								</StepperTrigger>
								{index < steps.length - 1 && <StepperSeparator />}
							</StepperItem>
						))}
					</StepperNav>

					<StepperPanel>
						{steps.map((step, index) => {
							const StepComponent = step.component;

							return (
								<StepperContent className="space-y-4" key={step.title} value={index + 1}>
									{index === 1 && (
										<Alert className="w-full bg-primary/10 text-primary">
											<InfoIcon />
											<AlertTitle>
												سوالات از بانک سوالات مدیریت می‌شوند. برای ویرایش سوال، به{" "}
												<Link to={"/question-bank"}>بانک سوالات</Link> مراجعه کنید.
											</AlertTitle>
										</Alert>
									)}
									<Card>
										<CardContent className="min-h-96">
											<StepComponent />
										</CardContent>

										<CardFooter
											className={cn("justify-between", currentStep === 1 && "justify-end")}
										>
											{currentStep !== 1 && (
												<Button onClick={prev} type="button" variant="outline">
													قبلی
												</Button>
											)}

											{currentStep === steps.length ? (
												<div className="flex gap-4">
													<Button
														disabled={mutation.isPending}
														form="exam-form"
														onClick={() => form.setValue("status", "draft")}
														type="submit"
														variant={"outline"}
													>
														ذخیره پیش نویس
													</Button>
													<Button
														disabled={mutation.isPending}
														form="exam-form"
														onClick={() => form.setValue("status", "published")}
														type="submit"
													>
														انتشار
													</Button>
												</div>
											) : (
												<Button onClick={next} type="button">
													بعدی
												</Button>
											)}
										</CardFooter>
									</Card>
								</StepperContent>
							);
						})}
					</StepperPanel>
				</Stepper>
			</form>
		</FormProvider>
	);
}
