import './App.css';
import { getMembers, getBeerStyles, getConsumptions } from "./api/api";
import logo from './tavour_logo_1.png';
import {
  Badge,
  Container,
  Row,
  Col,
  Navbar,
  Table
} from 'react-bootstrap';
import PieChart from './components/PieChart';
import React from 'react';
import { makeCancelable } from "./helpers/useCancelablePromise";

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
    /**
     * Get all beer club members
     * Use makeCancelable code so that promises are cancelable in case user were to navigate away from the page 
     * (this is more to reduce warnings in tests and follow best practices since this is a single page app)
     * */ 
    makeCancelable(this.getMembers());
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

    if (members.length > 0) {
      //get an array of just the member property
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
    }

    if(consumers.length > 0) {
      //on initial load of page, the first name in the list is selected
      this.selectConsumer(consumers[0]);
    }

    this.setState({
      isLoaded: true,
      consumers: consumers
    });
  }

  /**
   * On selectConsumer update the state variables to change the pie chart statistics
   * @param {*} consumer 
   */
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
      let data = [];
      if(values.length > 0) {
        data = values.map(x => [x[0]['beer-style'], x.length]);
      }
      data.unshift(['Beer Style', 'Number Consumed']);
      this.setState({
        consumer: consumer,
        pieChartData: data
      });
    }).catch((e) => {
      console.error(e);
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
              <h3 className="float-left">Consumption per Member:</h3>
            </Col>
            <Col>
              <h4 className="float-left">Beer Consumed by {consumer.name ? consumer.name : 'ERROR GETTING CONSUMER'}</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <Badge variant="info" className="float-left">Select a row from the table to view a different member</Badge>
            </Col>
          </Row>
          <br />
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
                  {consumers.map((consumer, index) => (
                    <tr key={index} onClick={() => this.selectConsumer(consumer)}>
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
