import z from "zod";

export function getApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
	return z.object({
		success: z.boolean(),
		message: z.string().optional(),
		data: dataSchema,
	});
}

export type TApiResponse<T> = {
	success: boolean;
	message?: string;
	data: T;
};
