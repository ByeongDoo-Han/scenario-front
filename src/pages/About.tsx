import { Nav } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
  return (
    
    // <ButtonGroup aria-label="Basic example">
    // <Button variant="secondary">Left</Button>
    // <Button variant="secondary">Middle</Button>
    // <Button variant="secondary">Right</Button>
    // </ButtonGroup>
    <div >
      <Nav>
        <Nav.Item>
          <Nav.Link href="/"><b>Scenario</b></Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/concurrency">동시성 제어(1개서버)</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/concurrency2">동시성 제어(2개서버)</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/search">ElasticSearch</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          {/* <Nav.Link href="/nplus">N+1</Nav.Link> */}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/human">Human</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
	

  );
}

export default About;