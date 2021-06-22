import './App.css';
import { getMembers, getBeerStyles, getConsumptions } from "./api/api";
import logo from './tavour_logo_1.png';
import {
  Container,
  Row,
  Col,
  Navbar,
  Table
} from 'react-bootstrap';
import PieChart from './components/PieChart';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.selectConsumer = this.selectConsumer.bind(this);
    this.state = {
      error: null,
      isLoaded: false,
      consumers: [],
      consumer: {},
      pieChartData: []
    };
  }

  componentDidMount() {
    // Get all beer club members
    this.getMembers();
  }

  /**
       * Get Members function gets all the data of all the members from the back end then constructs a new
       * array that represents total consumption for each member
       * 
       * Alternatively considered handling the same manipulation on the backend so that the json 
       * coming to the client was already correctly providing these numbers to mimic a DB that runs sql to give the
       * correct JSON
       */
  async getMembers() {
    //call API
    const members = await getMembers();
    const consumers = [];
    //get an array of just hte member property
    const names = members.map(({ member }) => member);
    //get a distinct list of names
    const distinctNames = [...new Set(names)];
    distinctNames.forEach(name => {
      const totalConsumption = members.filter((obj) => obj.member === name).length;
      consumers.push({
        name: name,
        count: totalConsumption,
        selected: false
      });
    });
    this.setState({
      isLoaded: true,
      consumer: consumers[0],
      consumers: consumers
    });
    //on initial load of page, the first name in the list is selected
    this.selectConsumer(consumers[0]);
  }

  async selectConsumer(consumer) {
    const memberBeers = await getBeerStyles(consumer.name);
    const beers = memberBeers.map(obj => obj['beer-style']);
    const distinctBeers = [...new Set(beers)];
    const promises = [];
    distinctBeers.forEach(beer => {
      //returns number of consumptions for that particular beer style and member
      promises.push(getConsumptions(consumer.name, beer));
    });
    Promise.all(promises).then((values) => {
      console.log(values);
      const result = values.map(x => [x[0]['beer-style'], x.length]);
      result.unshift(['Beer Style', 'Number Consumed']);
      this.setState({
        consumer: consumer,
        pieChartData: result
      });
    });
  }

  render() {
    const { error, isLoaded, consumers, consumer, pieChartData } = this.state;
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
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Person</th>
                    <th>Consumption</th>
                  </tr>
                </thead>
                <tbody>
                  {consumers.map(consumer => (
                    <tr onClick={() => this.selectConsumer(consumer)}>
                      <td>{consumer.name}</td>
                      <td>{consumer.count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col>
              <PieChart consumer={consumer} pieChartData={pieChartData} isLoaded={isLoaded} error={error} />
            </Col>
          </Row>

        </Container>
      </div>
    );
  }

}
export default App;
