import { api } from "@/lib/axios";
import type { TApiResponse } from "@/validations/api-response.validation";
import type { TQuestion } from "../types/question.types";

export const getBankQuestions = async (id: string) => {
	const { data } = await api.get<TApiResponse<TQuestion[]>>(`api/dashboard/bank/${id}/questions`);

	return data;
};
