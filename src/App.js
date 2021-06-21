import './App.css';
import {getMembers} from "./api/api";
import logo from './tavour_logo_1.png';
import {
  Container,
  Row,
  Col,
  Navbar,
  Table
} from 'react-bootstrap';
import MemberTable from './components/MemberTable';
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
      consumer: {}
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
    //on initial load of page, the first name in the list is selected
    consumers[0].selected = true;
    this.setState({
      isLoaded: true,
      consumers: consumers,
      consumer: consumers[0]
    });
  }

  selectConsumer(consumer) {
    console.log("CONSUMER SELECTED");
    this.setState({
      consumer: consumer
    });
  }

  render() {
    const { error, isLoaded, consumers, consumer } = this.state;
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
                    <tr onClick={() => this.selectConsumer(consumer)} className={consumer.selected ? 'MemberTable-row-selected' : ''}>
                      <td>{consumer.name}</td>
                      <td>{consumer.count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col>
              <PieChart consumer={consumer} isLoaded={isLoaded} error={error}/>
            </Col>
          </Row>

        </Container>
      </div>
    );
  }

}
export default App;
