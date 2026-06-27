import { create } from "zustand";

type TNewExamWizardStore = {
	currentStep: number;
	setCurrentStep: (step: number) => void;
};

export const useNewExamWizardStore = create<TNewExamWizardStore>()((set) => ({
	currentStep: 1,
	setCurrentStep: (step: number) => set({ currentStep: step }),
}));
