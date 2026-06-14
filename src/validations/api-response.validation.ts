import z from "zod";

export function getApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
	return z.object({
		success: z.boolean(),
		message: z.string().optional(),
		data: dataSchema.default(null),
	});
}

export type TApiResponse<T> = {
	success: boolean;
	message?: string;
	data: T;
};
