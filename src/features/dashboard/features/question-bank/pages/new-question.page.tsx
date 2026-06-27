import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/lib/axios";

const optionSchema = z.object({
	content: z.string(),
	is_correct: z.boolean().optional(),
});

const formSchema = z.object({
	content: z
		.string()
		.trim()
		.min(3, "متن سوال باید حداقل 3 کاراکتر باشد")
		.max(500, "متن سوال نمی‌تواند بیشتر از 500 کاراکتر باشد"),

	type: z.enum(["MULTIPLE_CHOICE_FOUR_OPTIONS"]),

	options: z
		.array(optionSchema)
		.length(4)
		.superRefine((options, ctx) => {
			const emptyExists = options.some((option) => option.content.trim().length === 0);

			if (emptyExists) {
				ctx.addIssue({
					code: "custom",
					path: [],
					message: "هر گزینه باید متنی داشته باشد",
				});
			}

			const correctCount = options.filter((option) => option.is_correct).length;

			if (correctCount !== 1) {
				ctx.addIssue({
					code: "custom",
					path: [],
					message: "دقیقاً یک گزینه صحیح را انتخاب کنید",
				});
			}
		}),
});

type QuestionFormData = z.input<typeof formSchema>;

export default function NewQuestionPage() {
	const params: { id?: string } = useParams();
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (data: QuestionFormData) => {
			const { data: question } = await api.post(`api/dashboard/bank/${params.id}/question`, data);
			return question;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["bank-questions", params.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["question-banks"],
			});
			toast.success("سوال اضافه شد. می توانید سوال بعدی را وارد کنید");
		},
	});
	const form = useForm<QuestionFormData>({
		resolver: zodResolver(formSchema),
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		criteriaMode: "all",

		defaultValues: {
			content: "",
			type: "MULTIPLE_CHOICE_FOUR_OPTIONS",

			options: Array.from({ length: 4 }, () => ({
				content: "",
				is_correct: undefined,
			})),
		},
	});
	function onSubmit(data: QuestionFormData) {
		mutation.mutate(data);
		form.reset();
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <nothing>
	useEffect(() => {
		form.reset();
	}, [isOpen]);

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger>
				<Button>
					<PlusIcon />
					افزودن سوال
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl!">
				<DialogHeader>
					<DialogTitle className="text-lg">افزودن سوال</DialogTitle>
				</DialogHeader>
				<form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							control={form.control}
							name="content"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="form-rhf-demo-description">متن سوال</FieldLabel>
									<InputGroup>
										<InputGroupTextarea
											{...field}
											aria-invalid={fieldState.invalid}
											className="min-h-24 resize-none"
											id="form-rhf-demo-description"
											placeholder="سوال خود را اینجا بنویسید"
											rows={6}
										/>
									</InputGroup>

									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Controller
							control={form.control}
							name="options"
							render={() => {
								const options = form.watch("options");
								const optionsError =
									form.formState.errors.options?.root ?? form.formState.errors.options;
								const hasOptionsError = Boolean(optionsError);

								return (
									<FieldSet>
										<FieldLegend>پاسخ‌ها</FieldLegend>

										<FieldDescription>دایره کنار گزینه صحیح را انتخاب کنید</FieldDescription>

										<RadioGroup
											onValueChange={(value) => {
												form.setValue(
													"options",
													options.map((option, index) => ({
														...option,
														is_correct: index === Number(value),
													})),
													{
														shouldValidate: false,
													},
												);
											}}
											value={String(options.findIndex((o) => o.is_correct))}
										>
											<div className="space-y-3">
												{options.map((_, index) => (
													<Field className="items-start gap-3" key={index} orientation="horizontal">
														<div className="h-12 min-w-6 flex items-center justify-center">
															<RadioGroupItem id={`option-${index}`} value={String(index)} />
														</div>

														<Controller
															control={form.control}
															name={`options.${index}.content`}
															render={({ field }) => (
																<Input
																	{...field}
																	className="h-12"
																	placeholder={`گزینه ${index + 1}`}
																/>
															)}
														/>
													</Field>
												))}
											</div>
										</RadioGroup>
										{hasOptionsError && <FieldError errors={[optionsError]} />}
									</FieldSet>
								);
							}}
						/>
					</FieldGroup>

					<DialogFooter className=" mt-10">
						<div className="flex justify-between w-full">
							<Button onClick={() => form.reset()} type="reset" variant={"outline"}>
								پاک کردن
							</Button>
							<Button type="submit">افزودن سوال</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
