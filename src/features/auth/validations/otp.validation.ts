import z from "zod";
import { getApiResponseSchema } from "@/validations/api-response.validation";

export const otpRequestSchema = z.object({
	mobile: z
		.string()
		.min(1, "لطفا شماره موبایل خود را وارد کنید")
		.min(11, "شماره موبایل باید ۱۱ رقم باشد")
		.max(11, "شماره موبایل باید ۱۱ رقم باشد")
		.regex(/^09\d{9}$/i, "فرمت شماره موبایل صحیح نمی باشد"),
});

export type TOtpRequest = z.infer<typeof otpRequestSchema>;

export const otpResponseSchema = getApiResponseSchema(
	z.object({ remaining_seconds: z.number(), debug_otp: z.string() }),
);

export type TOtpResponse = z.infer<typeof otpResponseSchema>;
