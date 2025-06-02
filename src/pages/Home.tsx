// import "./Home.css";
import About from "./About";

const Home = () => {
	return (
		<div>
			<About/>
			<div className="content">
				<h2>동시성 제어</h2>
				<p>동시성 제어 시각화를 위한 페이지입니다.</p>
				<p>Synchronized, Redis 분산 락을 사용한 동시성 제어 시각화를 확인할 수 있습니다.</p>
			</div>
			<div className="content">
				<h2>ElasticSearch</h2>
				<p>ElasticSearch를 위한 시각화를 위한 페이지입니다.</p>
			</div> 
		</div>
	);
};

export default Home;
