import React from 'react';
import withRouter from './withRouter';
import { Dropdown, Menu, Space, Card, Row, Col, Button, Typography, Divider } from 'antd';
import { DownOutlined } from '@ant-design/icons';
const { Text, Title } = Typography;




class GetCheapestFlights extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      flights: {},
      airports: {},
      chosen: undefined,
      name: "Todos los aeropuertos"
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
        }, () => {
          for (let i = 0; i < this.state.flights.length; i++) {
            this.getAirportDestinationDetails(this.state.flights[i].destination, this.state.flights[i])
            this.getAirportDestinationDetails(this.state.flights[i].destination, this.state.flights[i])
          }
        })
      }
    } else {
      const { data, error } = await this.props.supabase
        .from('getcheapestflight')
        .select('*').eq('origin', this.state.chosen)

      if (error == null) {
        this.setState({
          flights: data
        }, () => {
          for (let i = 0; i < this.state.flights.length; i++) {
            this.getAirportDestinationDetails(this.state.flights[i].destination, this.state.flights[i])
          }
        })
      }
    }
  }

  getAirportDestinationDetails = async (destination, object) => {
    const { data, error } = await this.props.supabase
      .from('airport')
      .select('city')
      .eq('code', destination)

    if (error == null && data.length > 0) {
      // Data is a list
      object.city = data[0].city
      this.forceUpdate();
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

  generateColumns() {
    let array = []
    if (this.state.chosen == undefined) {
      for (let i = 0; i < this.state.flights.length; i++) {
        array.push(<Col span={4}>
          <Card title={"Vuelo desde " + this.state.flights[i].origin + " a " + this.state.flights[i].city} hoverable style={{ width: 350, }} cover={<img alt="example" src={"https://gfhyobdofzshidbbnaxf.supabase.co/storage/v1/object/public/cities/" + this.state.flights[i].destination + ".png"} />}>
            <Button type="primary" onClick={() => { }} >{"Billetes desde " + this.state.flights[i].base_price + " €"}</Button>
          </Card>
        </Col>)
      }
    } else {
      for (let i = 0; i < this.state.flights.length; i++) {
        array.push(<Col span={4}>
          <Card title={"Vuelo a " + this.state.flights[i].city} hoverable style={{ width: 350, }} cover={<img alt="example" src={"https://gfhyobdofzshidbbnaxf.supabase.co/storage/v1/object/public/cities/" + this.state.flights[i].destination + ".png"} />}>
            <Button type="primary" onClick={() => { }} >{"Billetes desde " + this.state.flights[i].base_price + " €"}</Button>
          </Card>
        </Col>)
      }

    }

    return array;

  }

  updateChosen = ({ key }) => {
    let airport = this.state.airports[key]
    this.setState({
      chosen: airport.code,
      name: airport.city
    }, () => {
      this.getCheapestFlights()
      this.forceUpdate();
    }
    )


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
    const menu = (
      <Menu onClick={this.updateChosen} items={items}
      />
    );
    return <Title level={3}>Viajes destacados desde
      <Dropdown overlay={menu}><a onClick={(e) => e.preventDefault()}>
        <Space> {this.state.name}<DownOutlined /></Space>
      </a>
      </Dropdown>
    </Title>

  }
  render() {
    let array = []
    array.push(<Divider></Divider>)
    array.push(<Row>{this.generateDropDown()}</Row>)
    array.push(<Divider></Divider>)
    array.push(<Row>{this.generateColumns()}</Row>)
    return array
  }
}



export default withRouter(GetCheapestFlights);


