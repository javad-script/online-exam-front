import { api } from "@/lib/axios";
import { otpResponseSchema, type TOtpRequest } from "../validations/otp.validation";

const otpApi = async (payload: TOtpRequest) => {
	const { data } = await api.post("/api/auth/otp", payload);

	// TODO : remove this
	await new Promise((resolve) => setTimeout(resolve, 1000));
	alert(data.data.debug_otp);
	return await otpResponseSchema.parseAsync(data);
};

export default otpApi;
