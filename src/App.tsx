import {Routes, Route} from "react-router-dom";
import Concurrency from "./pages/Concurrency";
import "./App.css";
import NplusOne from "./pages/NplusOne";
import Search from "./pages/Search";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Concurrency />} />
			<Route path="/search" element={<Search />} />
			<Route path="/nplus" element={<NplusOne />} />
		</Routes>
	);
}

export default App;
