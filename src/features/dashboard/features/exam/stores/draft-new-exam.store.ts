import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FormValues } from "../validations/new-exam.validation";

type ExamFormStore = {
	draft: FormValues | null;

	setDraft: (draft: FormValues) => void;

	clearDraft: () => void;
};
export const useExamFormStore = create<ExamFormStore>()(
	persist(
		(set) => ({
			draft: null,

			setDraft: (draft) =>
				set({
					draft,
				}),

			clearDraft: () =>
				set({
					draft: null,
				}),
		}),
		{
			name: "exam-form",
		},
	),
);
