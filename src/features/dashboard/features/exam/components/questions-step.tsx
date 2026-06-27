import { useQuery } from "@tanstack/react-query";
import { BadgeQuestionMarkIcon, BookAIcon, ImportIcon, SearchIcon, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { getBankQuestions } from "../../question-bank/api/bank-questions.api";
import { getQuestionBanks } from "../../question-bank/api/question-banks.api";
import type { TQuestion } from "../../question-bank/types/question.types";
import { type FormValues, questionTypes } from "../validations/new-exam.validation";

export function QuestionsStep() {
	const { watch, setValue, formState } = useFormContext<FormValues>();

	const selectedQuestionsData = watch("selectedQuestionsData") ?? [];

	const handleDeleteQuestion = (questionId: number) => {
		const updatedData = selectedQuestionsData.filter((q) => q.id !== questionId);
		setValue("selectedQuestionsData", updatedData);
		setValue(
			"questions",
			updatedData.map((q) => q.id),
			{ shouldValidate: formState.isSubmitted },
		);
	};

	return (
		<div className="flex flex-col gap-8 pt-4">
			<div className="max-h-125 overflow-y-auto" dir="ltr">
				<div className="flex flex-col w-full gap-4 flex-1" dir="rtl">
					{selectedQuestionsData.length < 1 ? (
						<div className="w-full flex flex-col items-center gap-3 py-12">
							<h2 className="text-lg">هنوز سوالی اضافه نشده است</h2>
							<span className="text-center max-w-1/2 text-muted-foreground">
								سوالات آزمون را از بانک سوالات وارد کنید. می‌توانید از چند بانک مختلف انتخاب کنید.
							</span>
						</div>
					) : (
						selectedQuestionsData.map((question, index) => (
							<div
								className="group rounded-xl w-full border-border border p-4 flex justify-between items-center"
								key={question.id}
							>
								<div className="flex items-center gap-4">
									<span className="text-lg text-primary">{index + 1}#</span>
									<div className="flex flex-col justify-baseline">
										<p className="text-lg max-w-62 truncate">{question.content}</p>
										<Badge className="text-xs">
											{questionTypes[question.type as keyof typeof questionTypes]}
										</Badge>
									</div>
								</div>
								<Button
									className="group-hover:opacity-100 opacity-0 duration-150 text-red-500"
									onClick={() => handleDeleteQuestion(question.id)}
									size="icon-lg"
									type="button"
									variant="ghost"
								>
									<Trash2 />
								</Button>
							</div>
						))
					)}
				</div>
			</div>

			{formState.errors.questions?.message && <FieldError errors={[formState.errors.questions]} />}

			<ImportQuestionModal />
		</div>
	);
}

export function ImportQuestionModal() {
	const { watch, setValue, formState } = useFormContext<FormValues>();
	const currentQuestionsData = watch("selectedQuestionsData") ?? [];

	const [step, setStep] = useState(1);
	const [searchValue, setSearchValue] = useState("");
	const [selectedBank, setSelectedBank] = useState<number | null>(null);
	const [checkedQuestions, setCheckedQuestions] = useState<TQuestion[]>([]);
	const [open, setOpen] = useState(false);

	const { data: banks } = useQuery({
		queryKey: ["question-banks"],
		queryFn: getQuestionBanks,
		staleTime: 1000 * 60,
	});

	const filteredQuestionBanks = useMemo(
		() =>
			banks?.data.filter((bank) => bank.title.toLowerCase().includes(searchValue.toLowerCase())),
		[banks, searchValue],
	);

	const { data: questions } = useQuery({
		queryKey: ["questions", selectedBank],
		queryFn: ({ queryKey }) => getBankQuestions(String(queryKey[1])),
		staleTime: 1000 * 60,
		enabled: selectedBank !== null,
	});

	const filteredQuestion = useMemo(
		() =>
			questions?.data?.filter((question) =>
				question.content.toLowerCase().includes(searchValue.toLowerCase()),
			),
		[questions, searchValue],
	);

	useEffect(() => {
		if (open) {
			setCheckedQuestions(currentQuestionsData);
			setSelectedBank(null);
			setSearchValue("");
			setStep(1);
		}
	}, [open, currentQuestionsData]);

	const handleUnCheckQuestion = (questionId: number) => {
		setCheckedQuestions((prev) => prev.filter((q) => q.id !== questionId));
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger>
				<Button
					className="w-full border-dashed border-primary h-20 mt-auto"
					type="button"
					variant="outline"
				>
					<ImportIcon /> وارد کردن سوال از بانک
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-3xl!">
				<DialogHeader>
					<DialogTitle>{step === 1 ? "انتخاب بانک سوال" : "انتخاب سوال"}</DialogTitle>
				</DialogHeader>

				<InputGroup>
					<InputGroupAddon>
						<SearchIcon />
					</InputGroupAddon>
					<InputGroupInput
						onChange={(e) => setSearchValue(e.currentTarget.value)}
						placeholder="جستجو"
						value={searchValue}
					/>
				</InputGroup>

				<div className="h-[40svh] overflow-y-scroll" dir="ltr">
					<div className="size-full" dir="rtl">
						{step === 1 && (
							<div className="flex flex-col gap-4">
								{filteredQuestionBanks?.map((bank) => (
									<FieldLabel
										className="rounded-lg!"
										htmlFor={`question-bank-${bank.id}`}
										key={bank.id}
										onClick={() => {
											setSelectedBank(bank.id);
											setStep(2);
										}}
									>
										<Field className="justify-between p-4" orientation="horizontal">
											<div className="flex items-center gap-4">
												<div className="bg-primary text-background rounded-md p-2">
													<BookAIcon />
												</div>
												<FieldContent>
													<FieldTitle>{bank.title}</FieldTitle>
													<FieldDescription>{bank.questions_count} سوال</FieldDescription>
												</FieldContent>
											</div>
										</Field>
									</FieldLabel>
								))}

								{filteredQuestionBanks &&
									filteredQuestionBanks.length < 1 &&
									banks?.data &&
									banks?.data.length > 0 && <span className="mx-auto">بدون نتیجه</span>}
								{banks?.data && banks?.data.length < 1 && (
									<>
										<h2 className="mx-auto text-lg">شما بانک سوالی ندارید</h2>
										<Link className="text-xs mx-auto" to="/question-bank">
											<Button type="button">ساخت بانک سوال</Button>
										</Link>
									</>
								)}
							</div>
						)}

						{step === 2 && (
							<div className="flex flex-col gap-4">
								<div className="w-full *:rounded-none flex gap-4 flex-col">
									{filteredQuestion?.map((question) => (
										<FieldLabel
											className="rounded-lg!"
											htmlFor={`question-${question.id}`}
											key={question.id}
										>
											<Field className="justify-between p-4" orientation="horizontal">
												<div className="flex items-center gap-4">
													<div className="bg-primary text-background rounded-md p-2">
														<BadgeQuestionMarkIcon />
													</div>
													<FieldContent>
														<FieldTitle>{question.content}</FieldTitle>
														<FieldDescription>
															{questionTypes[question.type as keyof typeof questionTypes]}
														</FieldDescription>
													</FieldContent>
												</div>
												<Checkbox
													checked={Boolean(checkedQuestions.find((q) => q.id === question.id))}
													id={`question-${question.id}`}
													onCheckedChange={(e) => {
														if (e) {
															setCheckedQuestions((prev) => [...prev, question]);
														} else {
															handleUnCheckQuestion(question.id);
														}
													}}
												/>
											</Field>
										</FieldLabel>
									))}
									{questions && questions.data.length < 1 && (
										<>
											<h2 className="mx-auto text-lg">این بانک سوال هیچ سوالی ندارد</h2>
											<Link className="text-xs mx-auto" to={`/question-bank/${selectedBank}`}>
												<Button type="button">افزودن سوال به بانک</Button>
											</Link>
										</>
									)}
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className="w-full flex items-center justify-between!">
					{step === 2 && (
						<>
							<Button
								onClick={() => {
									setStep(1);
									setSearchValue("");
									setCheckedQuestions(currentQuestionsData);
								}}
								type="button"
								variant="outline"
							>
								انصراف و بازگشت
							</Button>
							<Button
								onClick={() => {
									setValue("selectedQuestionsData", checkedQuestions);
									setValue(
										"questions",
										checkedQuestions.map((q) => q.id),
										{ shouldValidate: formState.isSubmitted },
									);
									setOpen(false);
								}}
								type="button"
							>
								وارد کردن
							</Button>
						</>
					)}
					{step === 1 && (
						<DialogClose>
							<Button type="button" variant="outline">
								انصراف
							</Button>
						</DialogClose>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
