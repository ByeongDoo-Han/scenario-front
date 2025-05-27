import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="home-container">
			<h1>시나리오 데모 페이지</h1>
			<div className="button-container">
				<Link to="/concurrency" className="nav-button">
					동시성 제어
				</Link>
				<Link to="/nplus" className="nav-button">
					N+1 문제
				</Link>
				<Link to="/search" className="nav-button">
					ElasticSearch 검색
				</Link>
			</div>
		</div>
	);
};

export default Home;
