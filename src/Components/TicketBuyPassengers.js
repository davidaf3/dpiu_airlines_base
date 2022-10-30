import React from 'react';
import withRouter from './withRouter';
import { Card, Row, Col, Descriptions, Button, Steps, PageHeader, AutoComplete, Form, Input, Collapse, Typography, Tooltip, Result, notification, Checkbox, List } from 'antd';
const { Step } = Steps;
const { Meta } = Card;
const { Panel } = Collapse;
const { Text } = Typography;



class TicketBuyPassengers extends React.Component {

  constructor(props) {
    super(props)
    this.code = this.props.params.code;
    this.code_vuelta = undefined;
    this.user = "1dc61347-640b-465c-aa28-23868f0b8733";
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
      discount: {}
    }
    this.passengers = []
    this.tickets = []
    this.hayquehacervuelta = false;
    this.generalProgress = 1;
    this.appliedDiscount = false;
    this.discountparam = undefined;
    this.wrongdiscount = false;
    this.resaltarAsientosBaratos = false
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

  getDiscount = async () => {
    const { data, error } = await this.props.supabase
      .from('discount')
      .select()
      .eq('code', this.discountparam)

    if (error == null && data.length > 0) {
      // Data is a list
      this.setState({
        discount: data[0]
      }, () => {
        this.wrongdiscount = false;
        this.appliedDiscount = true;
        this.applyDiscount();
      })
    } else {
      this.wrongdiscount = true;
      this.applyDiscount();
    }
  }

  placeSeat(row, column, numberOfSeat) {
    var incremented = false;
    if (this.hayquehacervuelta) {
      var price = this.state.flight2.base_price
    } else {
      var price = this.state.flight.base_price;
    } 
    if (column == 1 || column == this.state.plane.columns) {
      price += 20;
      incremented = true
    }
    if (row == 1) {
      price += 30;
      incremented = true
    }
    if (this.resaltarAsientosBaratos && !incremented) {
        return <Tooltip placement="top" title={"Asiento " + numberOfSeat}><Col span={1}><Button onClick={() => { this.addTicket(row, column, price) }} style={{ width: "100%" }}><Text type = "success">{price + "€"}</Text></Button></Col></Tooltip>
    } else {
      return <Tooltip placement="top" title={"Asiento " + numberOfSeat}><Col span={1}><Button onClick={() => { this.addTicket(row, column, price) }} style={{ width: "100%" }}>{price + "€"}</Button></Col></Tooltip>

    }
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
        <Input/>
      </Form.Item>

      <Form.Item label="Apellido" name={"apellido_" + i} rules={[
        {
          required: true,
          message: 'Por favor, introduce el apellido del pasajero',
        },]}>
        <Input />
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
    if (this.state.passengerProgress == this.numberOfPassengers - 1) {
      if (this.code_vuelta == undefined) {
        { this.modifyProgress(1) }
      } else {
        if (!this.hayquehacervuelta) {
          this.hayquehacervuelta = true;
          this.state.passengerProgress = 0;
          this.generalProgress = this.generalProgress+1;
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
      <Descriptions.Item>{this.getCheapestTickets()}</Descriptions.Item>
    </Descriptions>
  </PageHeader>
}

getCheapestTickets() {
  return <Checkbox checked={!this.resaltarAsientosBaratos} onChange={this.updateSeatButtons()}>Resaltar asientos más baratos</Checkbox>
  //return <Button onClick={this.updateSeatButtons()}>Resaltar asientos más baratos</Button>
}


updateSeatButtons() {
  this.resaltarAsientosBaratos= !this.resaltarAsientosBaratos


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
    if (!this.appliedDiscount) {
      array.push(
        <Form layout="inline"name="basic" labelCol={{ span: 12, }} wrapperCol={{ span: 8, }} onFinish={values => this.calculateDiscount(values)}>
          <Form.Item label="Código de descuento" name="descuento">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Aplicar descuento</Button>
          </Form.Item>
        </Form>)
    }

    array.push( <Form>  <Form.Item label="Número de tarjeta" name={"tarjeta"} rules={[
      {
        required: true,
        message: 'Por favor, introduzca un método de pago',
      },]}>
      <Input/>
    </Form.Item></Form>   )
    /* 
    array.push(<List
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={this.tickets}
      renderItem={(ticket) => (
        <List.Item>
          <Typography.Text mark>[ITEM]</Typography.Text>  {ticket}
        </List.Item>
      )}
    />)
    */
    array.push(<Button onClick={() => { this.comprarTickets() }} type="primary">Comprar billetes</Button>)
    

  } else if (this.state.progress == 5) {
    array.push(  <Result
      status="success"
      title="¡Billetes listos!"
      subTitle="La compra de los billetes se ha realizado correctamente"
      extra={[
        <Button type="primary" key="console">
          Ver billetes comprados
        </Button>,
        <Button key="buy">Volver a ver más vuelos</Button>,
      ]}
    />)
  }

  return array
}

getListTickets() {
  return    
}

comprarTickets() {
  for (var i = 0; i < this.tickets.length; i++) {
    this.tickets[i].user = this.user;
    this.sendCreateTicket(this.tickets[i]);
  }
  this.modifyProgress(1);
}

calculateDiscount(values) {

  this.discountparam = values.descuento;
  this.getDiscount();

}

async sendCreateTicket(values){
      
 //const { data: { user } } = await this.props.supabase.auth.getUser();

//let file = values.image.file  // dont use "value.image.file" it has an error in upload



  if (this.user != null){
  const { data, error } = await this.props.supabase
    .from('ticket')
    .insert([
       { 
          user: this.user, 
          first_name: values.first_name,
          last_name: values.last_name,
          row: values.row,
          column: values.column,
          flight_code: values.flight_code
       }
    ])

    if (error != null){
      console.log(error);
    } else {
      this.setState({
        createdItem : true
      }) 
    }  

}
}

applyDiscount() {
  if (this.wrongdiscount) {
    notification.open({
      message: 'No se ha aplicado ningún descuento',
      description:
        'El código introducido es érroneo',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  } else {
    for (var i = 0; i < this.tickets.length; i++) {
      this.tickets[i].price -= ((this.tickets[i].price * this.state.discount.percentage)/100)
    }
    notification.open({
      message: 'Descuento aplicado',
      description:'Se ha aplicado correctamente un descuento a los billetes ',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  }
  this.forceUpdate();


}

modifyProgress(number) {
  this.state.progress += number;
  this.generalProgress += number;
  this.forceUpdate();
}

getSteps() {
  if (this.code_vuelta == undefined) {
    return <Steps progressDot current={this.generalProgress}>
      <Step title="Vuelos" description="Selección del vuelo" />
      <Step title="Pasajeros" description="Pasajeros que querrán viajar" />
      <Step title="Asientos" description="Asientos para el vuelo de ida" />
      <Step title="Tarifa" description="Plan de vuelo" />
      <Step title="Compra" description="Compra de los billetes" />
    </Steps>

  }
  return <Steps progressDot current={this.generalProgress}>
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


