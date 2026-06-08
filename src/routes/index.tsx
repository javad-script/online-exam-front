import { createBrowserRouter } from "react-router";
import Providers from "@/components/common/providers";

const router = createBrowserRouter([
	{
		element: <Providers />,
		children: [
			{
				index: true,
				element: <div>Home</div>,
			},
		],
	},
]);

export default router;
