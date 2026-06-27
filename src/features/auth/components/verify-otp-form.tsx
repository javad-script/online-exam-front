import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { RefreshCcwIcon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

import { verifyOtpApi } from "../api/verify-otp.api";
import { useOtpCountdown } from "../hooks/use-otp-countdown";
import { useOtpMutation } from "../hooks/use-request-otp.mutation";
import { useAuth } from "../stores/auth.store";
import {
	type TVerifyOtpRequest,
	verifyOtpRequestSchema,
} from "../validations/verify-otp.validation";

export function VerifyOtpForm() {
	const inputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const mobile = sessionStorage.getItem("mobile");
	const [submitTry, setSubmitTry] = useState(false);
	const setOtpBlockExpireTime = useAuth((s) => s.setOtpBlockExpireTime);
	const setToken = useAuth((s) => s.setToken);
	const expiresAt = useAuth((s) => s.otpBlockExpireTime);

	const otpBlockExpireTime = expiresAt ? new Date(expiresAt) : undefined;
	const second = useOtpCountdown(otpBlockExpireTime?.getTime());
	const [isResendPending, startResendTransition] = useTransition();

	// ۱. حل مشکل لود کامپوننت و ریدایرکت ایمن (باید بعد از تعریف هوک‌ها باشد)
	useEffect(() => {
		if (!mobile) {
			navigate("/auth/request");
		}
	}, [mobile, navigate]);

	const {
		handleSubmit,
		reset,
		control,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<TVerifyOtpRequest>({
		resolver: zodResolver(verifyOtpRequestSchema),
		mode: "onSubmit",
		defaultValues: {
			mobile: mobile ?? "",
			code: "", // ۲. مقداردهی اولیه به رشته خالی برای رفتار درست کامپوننت OTP
		},
	});

	// ۳. حل مشکل پاک نشدن المان‌های ظاهری کامپوننت OTP: ریست صریح فیلدها به رشته خالی
	const handleResetForm = () => {
		reset({
			mobile: mobile ?? "",
			code: "",
		});
	};

	const otpMutation = useOtpMutation(({ data }) => {
		setOtpBlockExpireTime(data.remaining_seconds);
		handleResetForm();
	});

	const verifyMutation = useMutation({
		mutationFn: verifyOtpApi,
		onSuccess: (data) => {
			handleResetForm();
			if (!data.success || !data.data) {
				toast.error(data.message);
				return;
			}
			setToken(data.data.token);
			navigate("/");
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message);
				return;
			}
			toast.error(error instanceof Error ? error.message : "خطایی رخ داد");
		},
	});

	const onSubmit = useCallback(
		async (data: TVerifyOtpRequest) => {
			await verifyMutation.mutateAsync(data);
		},
		[verifyMutation],
	);

	useLayoutEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleResend = () =>
		startResendTransition(async () => {
			if (!mobile) return;
			await otpMutation.mutateAsync({ mobile });
			inputRef.current?.focus();
		});

	// ۴. ارسال خودکار به محض تکمیل ۴ رقم
	const code = watch("code");
	useEffect(() => {
		if (code?.length === 4 && !submitTry) {
			handleSubmit(onSubmit)();
			setSubmitTry(true);
		}
	}, [code, handleSubmit, onSubmit, submitTry]);

	if (!mobile) return null;

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
								className="flex items-center gap-1"
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
										inputMode="numeric"
										maxLength={4}
										onBlur={field.onBlur}
										onChange={(val) => {
											const onlyDigits = val.replace(/\D/g, "");
											field.onChange(onlyDigits);
										}}
										ref={inputRef}
										value={field.value ?? ""} // ۵. فرستادن رشته خالی به جای undefined جهت همگام‌سازی المان ظاهری
									>
										<InputOTPGroup>
											<InputOTPSlot className="text-xl size-10" id="first-input" index={0} />
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
						<Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
							{isSubmitting ? "در حال بررسی..." : "ادامه"}
						</Button>
					</Field>

					<Field className="flex flex-col gap-3">
						<p className="text-sm space-x-2 mt-2">
							<span>شماره همراه صحیح نیست؟</span>
							<Link className="w-full" to="/auth/request">
								<span className="hover:underline underline-offset-4 text-primary">تغییر شماره</span>
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
