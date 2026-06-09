import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { RefreshCcwIcon } from "lucide-react";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useOtpMutation } from "../hooks/use-otp.mutation";
import { useOtpCountdown } from "../hooks/use-otp-countdown";
import { useVerifyOtp } from "../hooks/use-verify-otp.mutation";
import { useAuth } from "../stores/auth.store";
import {
	type TVerifyOtpRequest,
	verifyOtpRequestSchema,
} from "../validations/verify-otp.validation";

export function VerifyOtpForm() {
	const [searchParams] = useSearchParams();
	const mobile = searchParams.get("mobile");
	const setOtpBlockExpireTime = useAuth((s) => s.setOtpBlockExpireTime);
	const navigate = useNavigate();
	const setToken = useAuth((s) => s.setToken);
	const otpMutation = useOtpMutation(({ data }) => {
		setOtpBlockExpireTime(data.remaining_seconds);
		reset();
	});
	const verifyMutation = useVerifyOtp(({ data }) => {
		reset();
		navigate("/");
		setToken(data.token);
	});

	const expiresAt = useAuth((s) => s.otpBlockExpireTime);

	const second = useOtpCountdown(expiresAt.getTime());

	const {
		handleSubmit,
		reset,
		control,
		setFocus,
		formState: { errors, isSubmitting },
	} = useForm<TVerifyOtpRequest>({
		resolver: zodResolver(verifyOtpRequestSchema),
		mode: "onSubmit",
		defaultValues: {
			mobile,
		},
	});
	useEffect(() => setFocus("code"), [setFocus]);

	const onSubmit = async (data: TVerifyOtpRequest) => {
		await verifyMutation.mutateAsync(data);
	};

	const [isResendPending, startResendTransition] = useTransition();

	const handleResend = () =>
		startResendTransition(async () => {
			await otpMutation.mutateAsync({ mobile });
			setFocus("code");
		});

	if (!mobile) navigate("/auth/request");

	return (
		<div className="flex flex-col gap-6">
			<form onSubmit={handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className="flex flex-col items-center gap-2 text-center">
						<Link className="flex flex-col items-center gap-2 font-medium" to="#">
							<div className="flex size-12 mb-4 items-center justify-center rounded-md">
								<img alt="." className="size-full rounded-full" src="/favicon.svg" />
							</div>
							<span className="sr-only">سامانه آزمون آنلاین</span>
						</Link>

						<h1 className="text-xl font-bold">تأیید کد</h1>

						<FieldDescription>
							کد ارسال شده به شماره <span dir="ltr">{mobile}</span> را وارد کنید.
						</FieldDescription>
					</div>

					<Field>
						<FieldLabel className="flex w-full justify-between items-center">
							<span>کد تأیید</span>
							<Button
								className="flex items-center gap-1 "
								disabled={second > 0 || isResendPending}
								onClick={handleResend}
								type="button"
								variant="link"
							>
								{isResendPending ? (
									<span>در حال ارسال</span>
								) : (
									<>
										{second < 1 && <RefreshCcwIcon />}
										ارسال مجدد کد
										{second > 0 && ` (${second})`}
									</>
								)}
							</Button>
						</FieldLabel>

						<div className="flex justify-center" dir="ltr">
							<Controller
								control={control}
								name="code"
								render={({ field }) => (
									<InputOTP
										maxLength={4}
										onBlur={field.onBlur}
										onChange={field.onChange}
										pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
										value={field.value}
									>
										<InputOTPGroup>
											<InputOTPSlot className="text-xl size-10" index={0} />
											<InputOTPSlot className="text-xl size-10" index={1} />
											<InputOTPSlot className="text-xl size-10" index={2} />
											<InputOTPSlot className="text-xl size-10" index={3} />
										</InputOTPGroup>
									</InputOTP>
								)}
							/>
						</div>

						{errors.code && (
							<p className="text-sm text-red-700 opacity-65">{errors.code.message}</p>
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
							{isSubmitting ? "در حال بررسی..." : "ادامه"}
						</Button>
					</Field>

					<Field className="flex flex-col gap-3">
						<p className="text-sm space-x-2 mt-2">
							<span>شماره همراه صحیح نیست؟</span>
							<Link className="w-full" to={"/auth/request"}>
								<span className="hover:underline underline-offset-4 text-primary ">
									تغییر شماره
								</span>
							</Link>
						</p>
					</Field>
				</FieldGroup>
			</form>

			<FieldDescription className="px-6 text-center">
				کد تأیید معمولاً ظرف چند ثانیه ارسال می‌شود. در صورت عدم دریافت، از گزینه ارسال مجدد استفاده
				کنید.
			</FieldDescription>
		</div>
	);
}
