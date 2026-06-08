import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import otpApi from "../api/otp.api";

export function useOtpMutation(onSuccess?: () => void) {
	return useMutation({
		mutationFn: otpApi,

		onSuccess: () => {
			toast.success("کد تایید برای شما ارسال شد");
			onSuccess?.();
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
