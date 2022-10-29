import React from 'react';
import withRouter from './withRouter';
import { Card, Row, Col, Descriptions, Button, Steps, PageHeader, AutoComplete, Form, Input, Collapse, Typography, Tooltip, Avatar } from 'antd';
import { getTransitionName } from 'antd/lib/_util/motion';
const { Step } = Steps;
const { Meta } = Card;
const { Panel } = Collapse;
const { Text, Link } = Typography;



class TicketBuyPassengers extends React.Component {

  constructor(props) {
    super(props)
    this.code = this.props.params.code;
    this.code_vuelta = undefined;
    this.numberOfPassengers = 1;
    this.state = {
      flight: {},
      origin: {},
      destination: {},
      plane: {},
      airline: {},
      tickets: {},
      progress: 1,
      passengerProgress: 0,
      flight2: {},
      origin2: {},
      destination2: {},
      plane2: {},
      airline2: {},
      tickets2: {},
    }
    this.passengers = []
    this.tickets = []
    this.hayquehacervuelta = false;
    this.appliedDiscount = false;
    this.getFlightDetails();
    if (this.code_vuelta != undefined) {
      this.getFlightDetails2();
    }

  }

  getFlightDetails = async () => {
    console.log(this.code);
    const { data, error } = await this.props.supabase
      .from('flight')
      .select()
      .eq('code', this.code)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        flight: data[0]
      }, () => {
        this.getAirportOriginDetails();
        this.getAirportDestinationDetails();
        this.getPlaneDetails();
        this.getFlightTickets();
        this.getAirlineDetails();
      })
    }
  }

  getAirportOriginDetails = async () => {
    const { data, error } = await this.props.supabase
      .from('airport')
      .select()
      .eq('code', this.state.flight.origin)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        origin: data[0]
      })
    }
  }

  getAirportDestinationDetails = async () => {
    const { data, error } = await this.props.supabase
      .from('airport')
      .select()
      .eq('code', this.state.flight.destination)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        destination: data[0]
      })
    }
  }

  getPlaneDetails = async () => {
    const { data, error } = await this.props.supabase
      .from('plane')
      .select()
      .eq('id', this.state.flight.plane)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        plane: data[0]
      })
    }
  }

  getAirlineDetails = async () => {
    const { data, error } = await this.props.supabase
      .from('airline')
      .select()
      .eq('id', this.state.flight.airline)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        airline: data[0]
      })
    }
  }

  getFlightTickets = async () => {
    const { data, error } = await this.props.supabase
      .from('ticket')
      .select()
      .eq('flight_code', this.state.flight.code)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        tickets: data
      })
    }
  }


  getFlightDetails2 = async () => {
    const { data, error } = await this.props.supabase
      .from('flight')
      .select()
      .eq('code', this.code_vuelta)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        flight2: data[0]
      }, () => {
        this.getAirportOriginDetails2();
        this.getAirportDestinationDetails2();
        this.getPlaneDetails2();
        this.getFlightTickets2();
        this.getAirlineDetails2();
      })
    }
  }

  getAirportOriginDetails2 = async () => {
    const { data, error } = await this.props.supabase
      .from('airport')
      .select()
      .eq('code', this.state.flight2.origin)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        origin2: data[0]
      })
    }
  }

  getAirportDestinationDetails2 = async () => {
    const { data, error } = await this.props.supabase
      .from('airport')
      .select()
      .eq('code', this.state.flight2.destination)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        destination2: data[0]
      })
    }
  }

  getPlaneDetails2 = async () => {
    const { data, error } = await this.props.supabase
      .from('plane')
      .select()
      .eq('id', this.state.flight2.plane)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        plane2: data[0]
      })
    }
  }

  getAirlineDetails2 = async () => {
    const { data, error } = await this.props.supabase
      .from('airline')
      .select()
      .eq('id', this.state.flight2.airline)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        airline2: data[0]
      })
    }
  }

  getFlightTickets2 = async () => {
    const { data, error } = await this.props.supabase
      .from('ticket')
      .select()
      .eq('flight_code', this.state.flight2.code)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        tickets2: data
      })
    }
  }

  placeSeat(row, column, numberOfSeat) {
    let price = this.state.flight.base_price;
    if (column == 1 || column == this.state.plane.columns) {
      price += 20;
    }
    if (row == 1) {
      price += 30;
    }
    return <Tooltip placement="top" title={"Asiento " + numberOfSeat}><Col span={1}><Button onClick={() => { this.addTicket(row, column, price) }} style={{ width: "100%" }}>{price + "€"}</Button></Col></Tooltip>
  }

  createRowSeat = (j, numberOfSeat) => {
    const row = j
    const array = []
    var reserved = 0;

    if (!this.hayquehacervuelta) {
      var half_length = this.state.plane.columns / 2;
      var plane_columns = this.state.plane.columns
      var tickets_already_bought = this.state.tickets
      var flight_code = this.state.flight.code;
    } else {
      var half_length = this.state.plane2.columns / 2;
      var plane_columns = this.state.plane2.columns
      var tickets_already_bought = this.state.tickets2
      var flight_code = this.state.flight2.code;
    }

    for (var i = 1; i <= plane_columns; i++) {
      for (var z = 0; z < tickets_already_bought.length; z++) {
        if (tickets_already_bought[z].column == i) {
          if (tickets_already_bought[z].row == j) {
            reserved = 1;
          }
        }
      }

      for (var k = 0; k < this.tickets.length; k++) {
        if (this.tickets[k].flight_code == flight_code) {
          if (this.tickets[k].column == i) {
            if (this.tickets[k].row == j) {
              reserved = 2;
            }
          }
        }
      }

      if (reserved == 0) {
        array.push(this.placeSeat(row, i, numberOfSeat))
      } else if (reserved == 1) {
        array.push(<Tooltip placement="top" title="Ya reservada"><Col span={1}><Button style={{ width: "100%" }} disabled>X</Button></Col></Tooltip>)
      } else if (reserved == 2) {
        array.push(<Tooltip placement="top" title="Ya has reservado este asiento"><Col span={1}><Button style={{ width: "100%" }} disabled>X</Button></Col></Tooltip>)
      }

      if (i == half_length) {
        array.push(<Col span={1}><Button style={{ width: "100%" }}></Button></Col>)
      }
      numberOfSeat += 1;
      reserved = 0;
    }
    return array
  }

  createSeats = () => {
    const array = []
    var numberOfSeat = 1
    array.push(<Row style={{ width: "80%", marginBottom: "1em" }}>
      <Col align="middle" span={1}><Typography.Text>Asientos</Typography.Text></Col>
      <Col align="middle" span={1}><Typography.Text>A</Typography.Text></Col>
      <Col align="middle" span={1}><Typography.Text>B</Typography.Text></Col>
      <Col align="middle" span={1}><Typography.Text>C</Typography.Text></Col>
      <Col align="middle" span={1}></Col>
      <Col align="middle" span={1}><Typography.Text>D</Typography.Text></Col>
      <Col align="middle" span={1}><Typography.Text>E</Typography.Text></Col>
      <Col align="middle" span={1}><Typography.Text>F</Typography.Text></Col>
    </Row>);


    for (var i = 1; i <= this.state.plane.rows; i++) {
      array.push(<Row style={{ width: "80%", marginBottom: "1em" }}><Col align="middle" span={1}><Typography.Text>{i}</Typography.Text></Col>{this.createRowSeat(i, numberOfSeat)}</Row>);
      if (!this.hayquehacervuelta) {
        numberOfSeat += this.state.plane.columns
      }
      else {
        numberOfSeat += this.state.plane2.columns
      }
    }

    return array
  }

  createPassengerForms = () => {
    const array = []

    for (var i = 1; i <= this.numberOfPassengers; i++) {
      array.push(this.createPassengerForm(i));
    }

    return array
  }

  createPassengerForm(i) {
    const array = []
    const value = i
    const optionsTratamiento = [
      {
        value: 'Sr.',
      },
      {
        value: 'Sra.',
      },
      {
        value: 'Srta.',
      }
    ];
    array.push(<AutoComplete
      style={{
        width: 200,
      }}
      options={optionsTratamiento}
      placeholder="Tratamiento"
      filterOption={(inputValue, option) =>
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
    />)



    return <Panel header={"Pasajero " + i} key={value}>
      <Form.Item label="Nombre" name={"nombre_" + i} rules={[
        {
          required: true,
          message: 'Por favor, introduce el nombre del pasajero',
        },]}>
        <Input defaultValue="aaa" />
      </Form.Item>

      <Form.Item label="Apellido" name={"apellido_" + i} rules={[
        {
          required: true,
          message: 'Por favor, introduce el apellido del pasajero',
        },]}>
        <Input defaultValue="aaa" />
      </Form.Item>


      <Form.Item label="Tratamiento" name={"tratamiento_" + i} rules={[
        {
          required: false
        },]}>
        <AutoComplete
          style={{
            width: 200,
          }}
          options={optionsTratamiento}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          } />
      </Form.Item>
    </Panel>
  }

  getPassengers(values) {

    for (var i = 1; i <= this.numberOfPassengers; i++) {
      this.passengers.push({ nombre: values["nombre_" + i], apellido: values["apellido_" + i], tratamiento: values["tratamiento_" + i] })
    }

    { this.modifyProgress(1) }

  }

  addTicket(row, column, price) {
    if (this.hayquehacervuelta) {
      var fl_code = this.state.flight2.code
    } else {
      var fl_code = this.state.flight.code
    }
    this.tickets.push(
      {
        first_name: this.passengers[this.state.passengerProgress].nombre,
        last_name: this.passengers[this.state.passengerProgress].apellido,
        row: row,
        column: column,
        flight_code: fl_code,
        price: price
      }
    )
    console.log(this.tickets)
    if (this.state.passengerProgress == this.numberOfPassengers - 1) {
      if (this.code_vuelta == undefined) {
        { this.modifyProgress(1) }
      } else {
        if (!this.hayquehacervuelta) {
          this.hayquehacervuelta = true;
          this.state.passengerProgress = 0;
          this.forceUpdate();
        } else {
          { this.modifyProgress(1) }
        }
      }
    } else {
      this.state.passengerProgress += 1
      this.forceUpdate()
    }
  }

seatPassenger() {
  return <PageHeader title="Pasajeros">
    <Descriptions size="medium" column={1}>
      <Descriptions.Item label="Pasajero"><Text strong>{this.passengers[this.state.passengerProgress].nombre + " " + this.passengers[this.state.passengerProgress].apellido}</Text></Descriptions.Item>
      <Descriptions.Item><Text italic>Selecciona tu asiento</Text></Descriptions.Item>
    </Descriptions>
  </PageHeader>
}


getSeatPassengerProgress() {
  let array = []
  for (var i = 1; i <= this.numberOfPassengers; i++) {
    array.push(<Step title={"Asiento para " + this.passengers[i - 1].nombre + " " + this.passengers[i - 1].apellido} ></Step>);
  }
  return array
}

addPrice(number) {

  for (var i = 0; i < this.tickets.length; i++) {
    this.tickets[i].price += number;
  }

  this.modifyProgress(1) 
}

getContentAccordingToProgress() {
  const array = []
  if (this.state.progress == 1) {

    array.push(<Form onFinish={values => this.getPassengers(values)}><Collapse defaultActiveKey={['1']}>{this.createPassengerForms()}</Collapse>
      <Button>Cambiar búsqueda</Button>
      <Button htmlType="submit" type="primary">Siguiente</Button></Form>)

  } else if (this.state.progress == 2) {

    if (this.numberOfPassengers > 1) {
      array.push(<Steps direction="vertical" size="small" current={this.state.passengerProgress}>{this.getSeatPassengerProgress()}</Steps>)
    }
    array.push(<Row justify="center"> <Col span={4}>{this.seatPassenger()}</Col><Col span={19}>{this.createSeats()}</Col></Row>);
    array.push(<Button onClick={() => { this.modifyProgress(-1) }}>Atrás</Button>)

  } else if (this.state.progress == 3) {

    array.push(<Row gutter={16}>
      <Col span={8}>
        <Card title="Value" hoverable style={{ width: 240, }} cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Viaje ligero" description="Para solo viajar" />
          <Button onClick={() => { this.addPrice(0) }} >Continuar con precio</Button>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Regular" hoverable style={{ width: 240, }} cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Para vuelos cortos" description="Excelente para vuelos cortos" />
          <Button onClick={() => { this.addPrice(20) }} type="primary">20 € más por billete</Button>
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Premium" hoverable style={{ width: 240, }} cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}>
          <Meta title="Para viajar con comodidad" description="La mejor manera de viajar" />
          <Button onClick={() => { this.addPrice(100) }} type="primary">100 € más por billete</Button>
        </Card>
      </Col>
    </Row>)

  } else if (this.state.progress == 4) {

    array.push(
      <Form layout="inline"name="basic" labelCol={{ span: 8, }} wrapperCol={{ span: 5, }} initialValues={{ remember: true, }}>
        <Form.Item label="Código de descuento" name="descuento">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button onClick={() => { this.applyDiscount() }} type="primary">Aplicar descuento</Button>
        </Form.Item>
  
      </Form>)
    array.push(<Button onClick={() => { this.modifyProgress(1) }} type="primary">Comprar tickets</Button>)

  }
  return array
}

modifyProgress(number) {
  this.state.progress += number;
  this.forceUpdate();
}

getSteps() {
  if (this.code_vuelta == undefined) {
    return <Steps progressDot current={this.state.progress}>
      <Step title="Vuelos" description="Selección del vuelo" />
      <Step title="Pasajeros" description="Pasajeros que querrán viajar" />
      <Step title="Asientos" description="Asientos para el vuelo de ida" />
      <Step title="Tarifa" description="Plan de vuelo" />
      <Step title="Compra" description="Compra de los billetes" />
    </Steps>

  }
  return <Steps progressDot current={this.state.progress}>
    <Step title="Vuelos" description="Selección del vuelo" />
    <Step title="Pasajeros" description="Pasajeros que querrán viajar" />
    <Step title="Asientos de ida" description="Asientos para el vuelo de ida" />
    <Step title="Asientos de vuelta" description="Asientos para el vuelo de vuelta" />
    <Step title="Tarifa" description="Plan de vuelo" />
    <Step title="Compra" description="Compra de los billetes" />
  </Steps>


}

getFlightInformation() {
  if (this.code_vuelta == undefined) {
    return <PageHeader title="Información del vuelo" extra={[
      <Button>Cambiar búsqueda</Button>]}>
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="Origen"><Text strong>{this.state.origin.city}</Text></Descriptions.Item>
        <Descriptions.Item label="Destino"><Text strong>{this.state.destination.city}</Text></Descriptions.Item>
        <Descriptions.Item label="Número de pasajeros"><Text italic>{this.numberOfPassengers}</Text></Descriptions.Item>
      </Descriptions>
    </PageHeader>
  } else {
    return <PageHeader title="Información de los vuelos" extra={[
      <Button>Cambiar búsqueda</Button>]}>

      <Descriptions title="Vuelo de ida" size="small" column={2}>
        <Descriptions.Item label="Origen"><Text strong>{this.state.origin.city}</Text></Descriptions.Item>
        <Descriptions.Item label="Destino"><Text strong>{this.state.destination.city}</Text></Descriptions.Item>
      </Descriptions>

      <Descriptions title="Vuelo de vuelta" size="small" column={2}>
        <Descriptions.Item label="Origen"><Text strong>{this.state.origin2.city}</Text></Descriptions.Item>
        <Descriptions.Item label="Destino"><Text strong>{this.state.destination2.city}</Text></Descriptions.Item>
        <Descriptions.Item label="Número de pasajeros"><Text italic>{this.numberOfPassengers}</Text></Descriptions.Item>
      </Descriptions>

    </PageHeader>
  }

}

render() {
  return (
    <div>

      {this.getFlightInformation()}


      {this.getSteps()}


      {this.getContentAccordingToProgress()}

    </div>
  )
}
}



export default withRouter(TicketBuyPassengers);


