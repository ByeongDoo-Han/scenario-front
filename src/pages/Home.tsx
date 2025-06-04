// import "./Home.css";
import About from "./About";
import { Card, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
	return (
		<div>
			<About/>
			<div className="content">
				<Card style={{ width: '40rem' }}>
					<Card.Body>
						<Card.Title>동시성 제어</Card.Title>
						<Card.Text>
						동시성 제어 시각화를 위한 페이지입니다.
						<br/>
						Synchronized, Redis 분산 락을 사용한 동시성 제어 시각화를 확인할 수 있습니다.
						</Card.Text>
						<Button variant="primary">Go somewhere</Button>
					</Card.Body>
				</Card>
			</div>
			<div className="content">
			<Card style={{ width: '40rem' }}>
					<Card.Body>
						<Card.Title>ElasticSearch</Card.Title>
						<Card.Text>
						ElasticSearch를 위한 시각화를 위한 페이지입니다.
						<br/>
						
						</Card.Text>
						<Button variant="primary">Go somewhere</Button>
					</Card.Body>
				</Card>
			</div> 
		</div>
	);
};

export default Home;
