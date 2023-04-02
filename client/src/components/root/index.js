import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "../../index.css";
import { AppContextProvider } from "../../contexts/AppContext/AppContext";

import App from "./App";

ReactDOM.render(
	<StrictMode>
		<AppContextProvider>
			<App />
		</AppContextProvider>
	</StrictMode>,
	document.getElementById("root")
);
