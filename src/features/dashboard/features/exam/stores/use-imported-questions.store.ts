import { create } from "zustand";
import type { TQuestion } from "../../question-bank/types/question.types";

type ImportedQuestionsStore = {
	questions: TQuestion[];

	add: (questions: TQuestion) => void;
	addMany: (questions: TQuestion[]) => void;
	setQuestions: (questions: TQuestion[]) => void;
	remove: (id: number) => void;
	get: (id: number) => TQuestion | undefined;
	getAll: () => TQuestion[];
	clear: () => void;
};

export const useImportedQuestionsStore = create<ImportedQuestionsStore>()((set, get) => ({
	questions: [],

	add: (questions) =>
		set((state) => {
			const unique = state.questions.filter((question) => question.id !== questions.id);
			if (unique) return { questions: [...state.questions] };
			return { questions: [...state.questions, questions] };
		}),
	addMany: (questions) =>
		set((state) => {
			const unique = new Set([...state.questions, ...questions]);

			return { questions: [...unique] };
		}),

	setQuestions: (questions) =>
		set({
			questions,
		}),

	remove: (id) =>
		set((state) => ({
			questions: state.questions.filter((question) => question.id !== id),
		})),

	get: (id) => get().questions.find((question) => question.id === id),
	getAll: () => get().questions,

	clear: () =>
		set({
			questions: [],
		}),
}));
