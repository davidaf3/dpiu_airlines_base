import React from 'react';
import withRouter from './withRouter';
import { Card, Row, Col, Descriptions, Button, Steps, PageHeader, AutoComplete, Form, Input, Collapse, Typography, Tooltip, Result, notification, Checkbox, Table, Divider } from 'antd';
const { Step } = Steps;
const { Meta } = Card;
const { Panel } = Collapse;
const { Text, Title } = Typography;



class GetCheapestFlights extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      flights: {},
      cities : {}
    }
    this.cities = []
    this.getCheapestFlights();
  }
   

  getCheapestFlights = async () => {
    const { data, error } = await this.props.supabase
      .from('getcheapestflight')
      .select('*')

    if ( error == null){
      this.setState({
        flights : data
      }, () => {
        for (let i = 0; i < this.state.flights.length; i++) {
          this.getAirportDestinationDetails(this.state.flights[i].destination)
        }
      })
    }
  }

  getAirportDestinationDetails = async (destination) => {
    const { data, error } = await this.props.supabase
      .from('airport')
      .select('city')
      .eq('code', destination)

    if (error == null && data.length > 0) {
      // Data is a list
      this.cities.push(data[0].city)
      this.forceUpdate();
  }
}

generateColumns() {
  let array = []
  let j = this.state.flights.length-1;
  for (let i = 0; i < this.state.flights.length; i++) {
    array.push(<Col span={4}>
      <Card title={"Vuelo a " + this.cities[j] } hoverable style={{ width: 350, }} cover={<img alt="example" src= {"https://gfhyobdofzshidbbnaxf.supabase.co/storage/v1/object/public/cities/" + this.state.flights[i].destination + ".png" }/>}>
        <Button type= "primary" onClick={() => { }} >{"Billetes desde " + this.state.flights[i].base_price + " €"}</Button>
      </Card>
    </Col>)
    j = j-1
  }

  return array;

}
render() {
  console.log(this.cities)
  return <Row>{this.generateColumns()}</Row>
}
}



export default withRouter(GetCheapestFlights);


