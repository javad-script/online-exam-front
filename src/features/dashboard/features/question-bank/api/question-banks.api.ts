import { api } from "@/lib/axios";
import type { TApiResponse } from "@/validations/api-response.validation";
import type { TQuestionBank } from "../types/question-bank.types";

export const getQuestionBanks = async () => {
	const { data } = await api.get<TApiResponse<TQuestionBank[]>>("/api/dashboard/banks");
	return data;
};
