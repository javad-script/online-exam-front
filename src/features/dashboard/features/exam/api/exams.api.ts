import { api } from "@/lib/axios";
import type { TApiResponse } from "@/validations/api-response.validation";
import type { TExam } from "../types/exam.types";
import type { FormOutput } from "../validations/new-exam.validation";

export const getExams = async () => {
	const { data } = await api.get<TApiResponse<TExam[]>>(`api/dashboard/exams`);

	return data;
};
export const deleteExam = async (id: number) => {
	const { data } = await api.delete<TApiResponse<TExam[]>>(`api/dashboard/exams/${id}`);

	return data;
};

export const createExam = async (exam: FormOutput) => {
	const { data } = await api.post<TApiResponse<TExam[]>>(`api/dashboard/exams`, exam);

	return data;
};
