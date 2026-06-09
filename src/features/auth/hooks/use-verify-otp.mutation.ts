import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { verifyOtpApi } from "../api/verify-otp.api";
import type { TVerifyOtpResponse } from "../validations/verify-otp.validation";

export const useVerifyOtp = (onSuccess?: (data: TVerifyOtpResponse) => void) => {
	return useMutation({
		mutationFn: verifyOtpApi,
		onSuccess: (data) => {
			toast.success("خوش آمدید");
			onSuccess?.(data);
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				toast.error(error.response?.data?.message);
				return;
			}

			toast.error(error instanceof Error ? error.message : "خطایی رخ داد");
		},
	});
};
