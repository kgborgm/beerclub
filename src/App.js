import './App.css';
import logo from './tavour_logo_1.png';
import {
  Container,
  Row,
  Col,
  Table,
  Navbar
} from 'react-bootstrap';
import ExampleChart from './components/PieChart';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Beer Club Analytics by Tavour
        </Navbar.Brand>
      </Navbar>
      <Container fluid="xl">
        <Row>
          <Col>
            <h1 className="App-header">Data Analysis for Beer Club</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3 className="float-left">Consumptions per Member:</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            
          </Col>
          <Col>
            <ExampleChart />
          </Col>
        </Row>

      </Container>
    </div>
  );
}

export default App;
