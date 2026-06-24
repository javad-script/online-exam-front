import axios from "axios";
import { useAuth } from "@/features/auth/stores/auth.store";
import env from "./env";

export const api = axios.create({
	baseURL: env.VITE_API_URL,
	timeout: 1000 * 5,
	headers: {
		"Content-Type": "application/json",
	},
	validateStatus: (s) => s < 500,
});

api.interceptors.request.use((config) => {
	const token = useAuth.getState().token;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use((response) => {
	if (response.status === 401) {
		useAuth.getState().logout();
		window.location.href = "/auth/request";
	}

	return response;
});
