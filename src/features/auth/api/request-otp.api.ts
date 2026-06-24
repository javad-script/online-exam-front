import { api } from "@/lib/axios";
import {
	otpResponseSchema,
	type TOtpRequest,
	type TOtpResponse,
} from "../validations/request-otp.validation";

const otpApi = async (payload: TOtpRequest): Promise<TOtpResponse> => {
	const response = await api.post("/api/auth/otp", payload);

	const data = await otpResponseSchema.parseAsync(response.data);

	if (!data.success) {
		throw new Error(data.message);
	}

	// TODO : remove this alert
	if (data.data.debug_otp) {
		alert(data.data.debug_otp);
	}

	return data;
};

export default otpApi;
