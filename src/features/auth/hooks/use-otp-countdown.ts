// features/auth/hooks/use-otp-countdown.ts
import { useEffect, useState } from "react";

export function useOtpCountdown(expiresAt?: number) {
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		if (!expiresAt) {
			setSeconds(0);
			return;
		}

		const tick = () => {
			const diff = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));

			setSeconds(diff);
		};

		tick();

		const id = setInterval(tick, 1000);

		return () => clearInterval(id);
	}, [expiresAt]);

	return seconds;
}
