import {Routes, Route} from "react-router-dom";
import Concurrency from "./pages/Concurrency";
import "./App.css";
import NplusOne from "./pages/NplusOne";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Human from "./pages/Human";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/concurrency" element={<Concurrency />} />
			<Route path="/search" element={<Search />} />
			<Route path="/human" element={<Human />} />
			<Route path="/nplus" element={<NplusOne />} />
		</Routes>
	);
}

export default App;
