import React from 'react';
import withRouter from './withRouter';
import { Dropdown, Menu, Space, Card, Row, Col, Button, Typography, Divider, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import LoginForm from "./LoginForm";
import ModalLogin from "./LoginForm";
const { Text, Title } = Typography;

class GetCheapestFlights extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      flights: {},
      airports: {},
      chosen: undefined,
      name: "Todos los aeropuertos",
      isModalOpen: false
    }
    this.getAirports();
  }


  getCheapestFlights = async () => {
    if (this.state.chosen == undefined) {
      const { data, error } = await this.props.supabase
        .from('getcheapestflight')
        .select('*')

      if (error == null) {
        this.setState({
          flights: data
        })
      }
    } else {
      const { data, error } = await this.props.supabase
        .from('getcheapestflight')
        .select('*').eq('origin', this.state.chosen)

      if (error == null) {
        this.setState({
          flights: data
        })
      }
    }
  }

  getAirports = async () => {
    const { data, error } = await this.props.supabase
      .from('airport')
      .select('*')

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        airports: data
      }, () => {
        this.getCheapestFlights();
      }
      )
    }
  }

  getNameCity(code) {
    for (let i = 0; i < this.state.airports.length; i++) {
      if (this.state.airports[i].code == code) {
        return this.state.airports[i].city
      }
    }
  }

  clickFlight(flight) {
    this.props.navigate(`/flights/buy_ticket?departure=${flight.code}&passengers=1`)
    console.log(this.props.user)
    if (this.user != null) {
      this.props.navigate(`/flights/buy_ticket?departure=${flight.code}&passengers=1`)
    } else {
      console.log(this.state.user)
      this.setState({
        isModalOpen: true
      })
    }
  }

  generateColumns() {
    let array = []
    if (this.state.chosen == undefined) {
      for (let i = 0; i < this.state.flights.length; i++) {
        array.push(<Col gutter={16} span={6}>
          <Card title={"Vuelo desde " + this.getNameCity(this.state.flights[i].origin) + " a " + this.getNameCity(this.state.flights[i].destination)} hoverable style={{ width: 350, }} cover={<img alt="example" src={"https://gfhyobdofzshidbbnaxf.supabase.co/storage/v1/object/public/cities/" + this.state.flights[i].destination + ".png"} />}>
            <Button type="primary" onClick={() => this.clickFlight(this.state.flights[i])} >{"Billetes desde " + this.state.flights[i].base_price + " €"}</Button>
          </Card>
        </Col>)
      }
    } else {
      for (let i = 0; i < this.state.flights.length; i++) {
        array.push(<Col gutter={16} span={6}>
          <Card title={"Vuelo a " + this.getNameCity(this.state.flights[i].destination)} hoverable style={{ width: 350, }} cover={<img alt="example" src={"https://gfhyobdofzshidbbnaxf.supabase.co/storage/v1/object/public/cities/" + this.state.flights[i].destination + ".png"} />}>
            <Button type="primary" onClick={() => this.clickFlight(this.state.flights[i])} >{"Billetes desde " + this.state.flights[i].base_price + " €"}</Button>
          </Card>
        </Col>)
      }

    }
    return array;
  }

  updateChosen = ({ key }) => {
    if (key < this.state.airports.length) {
      let airport = this.state.airports[key]
      this.setState({
        chosen: airport.code,
        name: airport.city
      }, () => {
        this.getCheapestFlights()
        this.forceUpdate();
      }
      )
    } else {
      this.setState({
        chosen: undefined,
        name: "Todos los aeropuertos"
      }, () => {
        this.getCheapestFlights()
        this.forceUpdate();
      }
      )
    }

  }

  generateDropDown() {
    var items = []
    var item = {}
    for (let i = 0; i < this.state.airports.length; i++) {
      item = {}
      item.key = i
      item.label = (<Text>{this.state.airports[i].city}</Text>)
      items.push(item);
    }
    items.push({ key: this.state.airports.length, label: <Text>Todos los aeropuertos</Text> })
    const menu = (
      <Menu onClick={this.updateChosen} items={items}
      />
    );
    return <Title level={3}>
      <Dropdown overlay={menu}><a onClick={(e) => e.preventDefault()}>
        <Space> {this.state.name}<DownOutlined /></Space>
      </a>
      </Dropdown>
    </Title>

  }

  callBackOnFinishLoginForm = async (loginUser) => {
    this.closeModal();
    const { data, error } = await this.props.supabase.auth.signInWithPassword({
      email: loginUser.email,
      password: loginUser.password,
    });

    if (error == null && data.user != null) {
      this.onNewUser(data.user);
    }
    this.forceUpdate();
  };

  closeModal() {
    this.setState({ isModalOpen: false })
  }

  render() {
    let array = []

    array.push(<Modal title="Inicia sesión para continuar" open={this.state.isModalOpen} onOk={() => this.closeModal()} onCancel={() => this.closeModal()} footer={null}>
      <LoginForm
        callBackOnFinishLoginForm={this.callBackOnFinishLoginForm}
      />
    </Modal>)

    //array.push(<ModalLogin open={this.state.isModalOpen}></ModalLogin>)
    array.push(<Divider><Row span={5}><Title level={3}>Destinos más baratos desde {this.generateDropDown()}</Title></Row></Divider>)
    array.push(<Row justify="center" gutter={2}>{this.generateColumns()}</Row>)
    return array
  }
}

export default withRouter(GetCheapestFlights);


