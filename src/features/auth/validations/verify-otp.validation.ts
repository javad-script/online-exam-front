import z from "zod";
import { getApiResponseSchema } from "@/validations/api-response.validation";

export const verifyOtpRequestSchema = z.object({
	mobile: z.string(),
	code: z.string().regex(/^\d{4}$/, "لطفا کد را وارد کنید"),
});

export type TVerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;

export const verifyOtpResponseSchema = getApiResponseSchema(
	z.object({
		mobile: z.string(),
		token: z.string(),
	}),
);

export type TVerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
