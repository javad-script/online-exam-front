import { api } from "@/lib/axios";
import {
	type TVerifyOtpRequest,
	verifyOtpResponseSchema,
} from "../validations/verify-otp.validation";

export const verifyOtpApi = async (payload: TVerifyOtpRequest) => {
	const { data } = await api.post<TVerifyOtpRequest>("/api/auth/verify", JSON.stringify(payload));

	return await verifyOtpResponseSchema.parseAsync(data);
};
