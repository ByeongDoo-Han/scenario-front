import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import Concurrency from "./pages/Concurrency.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Concurrency />
	</StrictMode>
);
