import { api } from "@/lib/axios";
import type { TApiResponse } from "@/validations/api-response.validation";
import type { TExam } from "../types/exam.types";

export const getResults = async () => {
	const { data } = await api.get<TApiResponse<TExam[]>>(`api/dashboard/exams?status=closed`);

	return data;
};
export const deleteExam = async (id: number) => {
	const { data } = await api.delete(`api/dashboard/exams/${id}`);

	return data;
};
