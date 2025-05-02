import {Routes, Route} from "react-router-dom";
import Concurrency from "./pages/Concurrency";
import "./App.css";
import NplusOne from "./pages/NplusOne";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Concurrency />} />
			<Route path="/nplus" element={<NplusOne />} />
		</Routes>
	);
}

export default App;
