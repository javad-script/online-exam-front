export type TExam = {
	id: number;
	creator_id: number;
	title: string;
	description: string;
	duration_minutes: number;
	show_result: boolean;
	show_correct_answers: boolean;
	random_questions: boolean;
	random_options: boolean;
	status: string;
};
