import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import otpApi from "../api/request-otp.api";
import type { TOtpResponse } from "../validations/otp.validation";

export function useOtpMutation(onSuccess?: (data: TOtpResponse) => void) {
	return useMutation({
		mutationFn: otpApi,

		onSuccess: (data) => {
			toast.success("کد تایید برای شما ارسال شد");
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
}
