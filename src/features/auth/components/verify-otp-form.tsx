import { zodResolver } from "@hookform/resolvers/zod";
import { useCountDown } from "@reactuses/core";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/stores/auth.store";
import { useOtpMutation } from "../hooks/use-otp.mutation";
// import { useOtpMutation } from "../hooks/use-otp.mutation";
import { useVerifyOtp } from "../hooks/use-verify-otp.mutation";
import {
	type TVerifyOtpRequest,
	verifyOtpRequestSchema,
} from "../validations/verify-otp.validation";

export function VerifyOtpForm() {
	const expiresAt = useAuth((s) => s.expiresAt);
	const startTimer = useAuth((s) => s.startTimer);
	const navigate = useNavigate();
	const setToken = useAuth((s) => s.setToken);
	const otpMutation = useOtpMutation(({ data }) => {
		startTimer(data.remaining_seconds);
	});

	const target = Date.now() + expiresAt;
	const diffInSec = Math.ceil((target - Date.now()) / 1000);
	const [second] = useCountDown(diffInSec);
	const mutation = useVerifyOtp(({ data }) => {
		reset();
		setAuthStep("otp");
		closeAuthModal();
		navigate("/dashboard");
		setToken(data.token);
	});

	const setAuthStep = useAuth((s) => s.setStep);
	const storedMobile = useAuth((s) => s.mobile);
	const closeAuthModal = useAuth((s) => s.closeAuthModal);

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
			mobile: storedMobile,
		},
	});
	useEffect(() => setFocus("code"), [setFocus]);

	const onSubmit = async (data: TVerifyOtpRequest) => {
		await mutation.mutateAsync(data);
	};

	const handleChangeNumber = () => {
		setAuthStep("otp");
	};

	const handleResend = () => {
		otpMutation.mutateAsync({ mobile: storedMobile });
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="text-lg">ورود و ثبت نام</DialogTitle>
				<DialogDescription>لطفا کد ارسال شده به {storedMobile} را وارد کنید</DialogDescription>
			</DialogHeader>
			<div className="flex w-full flex-col items-center justify-center gap-4" dir="ltr">
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
				{errors.code && <p className="text-sm text-red-700 opacity-65">{errors.code.message}</p>}
			</div>
			<DialogFooter className="sm:justify-start" dir="ltr">
				<Button
					className="h-10 flex-1 rounded px-8 py-2 text-lg font-bold text-white"
					disabled={isSubmitting}
					onClick={handleSubmit(onSubmit)}
					size={"lg"}
					type="button"
				>
					{isSubmitting ? "صبر کنید ..." : "ادامه"}
				</Button>
				<Button
					className="h-10 flex-1 rounded px-4 py-2 text-sm transition"
					disabled={Number(second) > 0}
					onClick={handleResend}
					type="button"
					variant="secondary"
				>
					ارسال مجدد کد {Number(second) >= 1 && `تا ${Number(second)}`}
				</Button>
			</DialogFooter>
			<p>
				<span>شماره همراه صحیح نیست؟</span>
				<Button
					className="text-r rounded px-4 py-2 text-sm text-emerald-900"
					onClick={handleChangeNumber}
					type="button"
					variant={"link"}
				>
					<span>تغییر شماره</span>
				</Button>
			</p>
		</DialogContent>
	);
}
