import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GenomeProvider } from "./contexts/GenomeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<GenomeProvider>
		<App />
	</GenomeProvider>
);
