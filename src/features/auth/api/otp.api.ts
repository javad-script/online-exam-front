import { api } from "@/lib/axios";
import { otpResponseSchema, type TOtpRequest } from "../validations/otp.validation";

const otpApi = async (payload: TOtpRequest) => {
	console.log(payload);
	const { data } = await api.post("/api/auth/otp", JSON.stringify(payload));

	await new Promise((resolve) => setTimeout(resolve, 1000));
	return await otpResponseSchema.parseAsync(data);
};

export default otpApi;
