import axios from "axios";
import { useAuth } from "@/features/auth/stores/auth.store";
import env from "./env";

export const api = axios.create({
	baseURL: env.VITE_API_URL,
	timeout: 1000 * 5,
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${useAuth.getState().token}`,
	},
});
