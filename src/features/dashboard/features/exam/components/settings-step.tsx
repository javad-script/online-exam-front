import { faIR } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { FormValues } from "../validations/new-exam.validation";

export function SettingsStep() {
	const { control } = useFormContext<FormValues>();
	const [calendarOpen, setCalendarOpen] = useState(false);

	return (
		<FieldGroup className="w-full">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Controller
					control={control}
					name="title"
					render={({ field, fieldState }) => (
						<Field className="col-span-2">
							<FieldLabel>عنوان آزمون</FieldLabel>
							<Input
								{...field}
								aria-invalid={fieldState.invalid}
								placeholder="مثال: آزمون ریاضی عمومی — ترم بهار ۱۴۰۳"
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={control}
					name="description"
					render={({ field, fieldState }) => (
						<Field className="col-span-2 " data-invalid={fieldState.invalid}>
							<FieldLabel>توضیحات</FieldLabel>
							<Textarea
								{...field}
								aria-invalid={fieldState.invalid}
								className="min-h-42"
								placeholder="توضیح مختصری از محتوا و هدف آزمون."
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Controller
					control={control}
					name="duration_minutes"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel>مدت آزمون</FieldLabel>
							<Input
								{...field}
								aria-invalid={fieldState.invalid}
								className="text-foreground"
								placeholder="مدت آزمون به دقیقه می‌باشد"
								type="number"
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					control={control}
					name="date"
					render={({ field, fieldState }) => {
						const selectedDate =
							field.value instanceof Date && !Number.isNaN(field.value.getTime())
								? field.value
								: undefined;
						return (
							<Field>
								<FieldLabel htmlFor="date-picker">تاریخ</FieldLabel>
								<Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
									<PopoverTrigger>
										<Button
											aria-invalid={fieldState.invalid}
											className="w-full justify-between font-normal"
											id="date-picker"
											type="button"
											variant="outline"
										>
											{field.value
												? new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
														day: "numeric",
														month: "long",
														year: "numeric",
													}).format(new Date(field.value))
												: "انتخاب تاریخ"}
											<ChevronDownIcon />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="start" className="overflow-hidden p-0">
										<Calendar
											aria-invalid={fieldState.invalid}
											buttonVariant="outline"
											captionLayout="dropdown"
											defaultMonth={selectedDate ?? new Date()}
											locale={faIR}
											mode="single"
											onSelect={(value) => {
												field.onChange(value);
												setCalendarOpen(false);
											}}
											selected={selectedDate}
											showOutsideDays={false}
										/>
									</PopoverContent>
								</Popover>
								<FieldError errors={[fieldState.error]} />
							</Field>
						);
					}}
				/>

				<Controller
					control={control}
					name="time"
					render={({ field, fieldState }) => {
						const formatTime = (value: string) => {
							if (value.includes(":")) return value;
							if (value.length <= 2) return value;
							return `${value.slice(0, 2)}:${value.slice(2, 4)}`;
						};

						const handleChange = (value: string) => {
							let cleaned = value.replace(/[^\d:]/g, "");
							const firstColonIndex = cleaned.indexOf(":");
							if (firstColonIndex !== -1) {
								cleaned =
									cleaned.slice(0, firstColonIndex + 1) +
									cleaned.slice(firstColonIndex + 1).replace(/:/g, "");
							}

							let digitCount = 0;
							let result = "";
							for (const char of cleaned) {
								if (char === ":") {
									result += char;
								} else if (digitCount < 4) {
									result += char;
									digitCount++;
								}
							}
							field.onChange(result);
						};

						const handleBlur = () => {
							const value = field.value ?? "";
							if (!value) {
								field.onBlur();
								return;
							}

							let hoursStr = "";
							let minutesStr = "";

							if (value.includes(":")) {
								const parts = value.split(":");
								hoursStr = parts[0] || "";
								minutesStr = parts[1] || "";
							} else {
								if (value.length <= 2) {
									hoursStr = value;
									minutesStr = "00";
								} else {
									hoursStr = value.slice(0, 2);
									minutesStr = value.slice(2);
								}
							}

							hoursStr = hoursStr.padStart(2, "0");
							minutesStr = minutesStr.padEnd(2, "0");

							const hours = Number(hoursStr);
							const minutes = Number(minutesStr);

							if (Number.isNaN(hours) || Number.isNaN(minutes) || hours > 23 || minutes > 59) {
								field.onChange("");
								field.onBlur();
								return;
							}

							field.onChange(`${hoursStr}:${minutesStr}`);
							field.onBlur();
						};

						return (
							<Field className="w-full">
								<FieldLabel htmlFor="time-picker">ساعت شروع</FieldLabel>
								<Input
									aria-invalid={fieldState.invalid}
									className="appearance-none text-center bg-background"
									dir="ltr"
									id="time-picker"
									inputMode="numeric"
									onBlur={handleBlur}
									onChange={(e) => handleChange(e.target.value)}
									placeholder="20:30"
									type="text"
									value={formatTime(field.value ?? "")}
								/>
								<FieldError errors={[fieldState.error]} />
							</Field>
						);
					}}
				/>
			</div>

			<Field>
				<FieldLabel>ویژگی های آزمون</FieldLabel>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<FieldLabel className="w-full" htmlFor="random_question">
						<Controller
							control={control}
							name="random_questions"
							render={({ field, fieldState }) => (
								<Field orientation="horizontal">
									<FieldContent>
										<FieldTitle>ترتیب تصادفی سوالات</FieldTitle>
										<FieldDescription>
											سوالات برای هر شرکت‌کننده به صورت تصادفی نمایش داده می‌شود
										</FieldDescription>
									</FieldContent>
									<Switch
										aria-invalid={fieldState.invalid}
										checked={field.value}
										id="random_question"
										name={field.name}
										onCheckedChange={field.onChange}
									/>
								</Field>
							)}
						/>
					</FieldLabel>

					<FieldLabel className="w-full" htmlFor="random_options">
						<Controller
							control={control}
							name="random_options"
							render={({ field, fieldState }) => (
								<Field orientation="horizontal">
									<FieldContent>
										<FieldTitle>ترتیب تصادفی گزینه ها</FieldTitle>
										<FieldDescription>
											گزینه های هر سوال برای هر شرکت‌کننده به صورت تصادفی نمایش داده می‌شود
										</FieldDescription>
									</FieldContent>
									<Switch
										aria-invalid={fieldState.invalid}
										checked={field.value}
										id="random_options"
										name={field.name}
										onCheckedChange={field.onChange}
									/>
								</Field>
							)}
						/>
					</FieldLabel>

					<FieldLabel className="w-full" htmlFor="show_result">
						<Controller
							control={control}
							name="show_result"
							render={({ field, fieldState }) => (
								<Field orientation="horizontal">
									<FieldContent>
										<FieldTitle>نمایش نتیجه</FieldTitle>
										<FieldDescription>
											نمایش نتیجه آزمون در پایان آزمون برای شرکت کنندگان
										</FieldDescription>
									</FieldContent>
									<Switch
										aria-invalid={fieldState.invalid}
										checked={field.value}
										id="show_result"
										name={field.name}
										onCheckedChange={field.onChange}
									/>
								</Field>
							)}
						/>
					</FieldLabel>
				</div>
			</Field>
		</FieldGroup>
	);
}
