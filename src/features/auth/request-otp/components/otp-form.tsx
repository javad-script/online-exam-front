"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useAuth } from "@/stores/auth.store";
import { useOtpMutation } from "../hooks/use-otp.mutation";
import { otpRequestSchema, type TOtpRequest } from "../validations/otp.validation";

export default function RequestOtpForm() {
	const setAuthStep = useAuth((s) => s.setStep);
	const setMobile = useAuth((s) => s.setMobile);
	const mutation = useOtpMutation(() => {
		reset();
		setAuthStep("verify");
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
		setMobile(data.mobile);
		await mutation.mutateAsync(data);
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="text-lg">ورود و ثبت نام</DialogTitle>
				<DialogDescription>لطفا شماره موبایل خود را وارد کنید</DialogDescription>
			</DialogHeader>
			<InputGroup className="px-4 text-5xl" dir="ltr">
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
			{errors.mobile && <p className="text-sm text-red-700 opacity-65">{errors.mobile.message}</p>}
			<DialogFooter className="sm:justify-start" dir="ltr">
				<Button
					className="h-10 w-full rounded px-8 py-2 text-lg font-bold text-white"
					disabled={isSubmitting}
					onClick={handleSubmit(onSubmit)}
					size={"lg"}
					type="submit"
				>
					{isSubmitting ? "در حال ارسال..." : "ادامه"}
				</Button>
			</DialogFooter>
			<p className="opacity-65">ورود یا ثبت‌نام به معنای پذیرش قوانین سایت می باشد.</p>
		</DialogContent>
	);
}
