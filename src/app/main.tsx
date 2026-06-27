import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/globals.css";
import { RouterProvider } from "react-router/dom";
import router from "@/app/router";

const root = document.getElementById("root");
if (!root) throw new Error("root element not found");

createRoot(root).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
