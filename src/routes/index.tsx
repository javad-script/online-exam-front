import { createBrowserRouter } from "react-router";
import Providers from "@/components/common/providers";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/stores/auth.store";

const router = createBrowserRouter([
	{
		element: <Providers />,
		children: [
			{
				index: true,
				element: <Button onClick={() => useAuth.getState().openAuthModal()}>login</Button>,
			},
		],
	},
]);

export default router;
