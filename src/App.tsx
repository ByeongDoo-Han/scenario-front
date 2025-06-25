import {Routes, Route} from "react-router-dom";
import Concurrency from "./pages/Concurrency";
import "./App.css";
import NplusOne from "./pages/NplusOne";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Human from "./pages/Human";
import Concurrency2 from "./pages/Concurrency2";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/concurrency" element={<Concurrency />} />
			<Route path="/concurrency2" element={<Concurrency2 />} />
			<Route path="/search" element={<Search />} />
			<Route path="/human" element={<Human />} />
			<Route path="/nplus" element={<NplusOne />} />
		</Routes>
	);
}

export default App;
