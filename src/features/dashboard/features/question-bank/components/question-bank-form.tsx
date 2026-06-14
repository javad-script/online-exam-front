import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";

const schema = z.object({
	title: z.string().min(3, "نام بانک باید حداقل ۳ حرف باشد"),
	description: z.string().default(""),
	is_public: z.boolean(),
});

type TQuestionBankForm = z.infer<typeof schema>;

export default function QuestionBankForm({
	className,
	callback,
}: React.ComponentProps<"form"> & { callback: () => void }) {
	const {
		register,
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			is_public: false,
		},
	});
	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: async (data: TQuestionBankForm) => {
			await api.post("/api/dashboard/banks", data);
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["question-banks"],
			});
			toast.success("بانک ایجاد شد");
			callback();
		},
	});

	const submitHandler = async (data: TQuestionBankForm) => {
		console.log(data);
		await createMutation.mutateAsync(data);
		callback();
	};

	return (
		<form
			className={cn("grid items-start gap-6", className)}
			onSubmit={handleSubmit(submitHandler)}
		>
			<div className="grid gap-3">
				<Label htmlFor="title">نام بانک</Label>
				<Input {...register("title")} />
			</div>
			<div className="grid gap-3">
				<Label htmlFor="username">توضیحات بانک</Label>
				<Textarea className="max-h-52" {...register("description")} />
			</div>
			<div className="grid gap-3">
				<Label>نوع بانک</Label>
				<Controller
					control={control}
					name="is_public"
					render={({ field }) => (
						<RadioGroup
							className="max-w-sm"
							onValueChange={(value) => field.onChange(value === "true")}
							value={String(field.value)}
						>
							<FieldLabel htmlFor="private">
								<Field orientation="horizontal">
									<FieldContent>
										<FieldTitle>خصوصی</FieldTitle>
										<FieldDescription>فقط شما دسترسی دارید</FieldDescription>
									</FieldContent>

									<RadioGroupItem id="private" value="false" />
								</Field>
							</FieldLabel>

							<FieldLabel htmlFor="public">
								<Field orientation="horizontal">
									<FieldContent>
										<FieldTitle>عمومی</FieldTitle>
										<FieldDescription>دیگران هم دسترسی دارند</FieldDescription>
									</FieldContent>

									<RadioGroupItem id="public" value="true" />
								</Field>
							</FieldLabel>
						</RadioGroup>
					)}
				/>
			</div>
			<Button disabled={isSubmitting} type="submit">
				{isSubmitting ? "در حال ایجاد" : "ایجاد"}
			</Button>
		</form>
	);
}
