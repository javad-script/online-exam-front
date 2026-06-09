import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryVerticalEndIcon, PhoneIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useOtpMutation } from "../hooks/use-otp.mutation";
import { useAuth } from "../stores/auth.store";
import { otpRequestSchema, type TOtpRequest } from "../validations/otp.validation";

export function RequestOtpForm() {
	const setOtpBlockExpireTime = useAuth((s) => s.setOtpBlockExpireTime);
	const navigate = useNavigate();
	const mutation = useOtpMutation(({ data }) => {
		reset();
		setOtpBlockExpireTime(data.remaining_seconds);
		navigate(`/auth/verify?mobile=${data.mobile}`);
	});
	const {
		register,
		handleSubmit,
		reset,
		setFocus,
		formState: { errors, isSubmitting },
	} = useForm<TOtpRequest>({
		mode: "onSubmit",
		resolver: zodResolver(otpRequestSchema),
	});

	useEffect(() => {
		setFocus("mobile");
	}, [setFocus]);

	const onSubmit = async (data: TOtpRequest) => {
		await mutation.mutateAsync(data);
	};

	useEffect(() => {
		setOtpBlockExpireTime(0);
	}, [setOtpBlockExpireTime]);

	return (
		<div className="flex flex-col gap-6">
			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<Link className="flex flex-col items-center gap-2 font-medium" to="#">
							<div className="flex size-8 items-center justify-center rounded-md">
								<GalleryVerticalEndIcon className="size-6" />
							</div>
							<span className="sr-only">سامانه آزمون آنلاین</span>
						</Link>

						<h1 className="text-xl font-bold">ورود یا ثبت‌نام</h1>

						<FieldDescription>
							شماره موبایل خود را وارد کنید تا کد تأیید برای شما ارسال شود.
						</FieldDescription>
					</div>

					<Field>
						<FieldLabel htmlFor="phone">شماره موبایل</FieldLabel>
						<InputGroup className="space-x-2 px-2 text-5xl" dir="ltr">
							<InputGroupAddon align={"inline-start"}>
								<PhoneIcon />
							</InputGroupAddon>
							<InputGroupInput
								{...register("mobile", {
									onChange: (e) => {
										e.target.value = e.target.value.replace(/\D/g, "");
									},
								})}
								autoComplete="off"
								className="h-10 text-left text-base! font-normal"
								inputMode="numeric"
								maxLength={11}
								placeholder="09123456789"
								spellCheck={false}
							/>
						</InputGroup>
						{errors.mobile && (
							<p className="text-sm text-red-700 opacity-65">{errors.mobile.message}</p>
						)}
					</Field>

					<Field>
						<Button
							className="w-full"
							disabled={isSubmitting}
							onClick={handleSubmit(onSubmit)}
							size={"lg"}
							type="submit"
						>
							{isSubmitting ? "در حال ارسال..." : "ادامه"}
						</Button>
					</Field>
				</FieldGroup>
			</form>
			<FieldDescription className="px-6 text-center">
				در صورت نداشتن حساب کاربری، با تأیید شماره موبایل حساب شما به‌صورت خودکار ایجاد خواهد شد.
			</FieldDescription>
		</div>
	);
}
