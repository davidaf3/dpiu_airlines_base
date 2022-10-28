import React from 'react';
import withRouter from './withRouter';
import { Badge, Descriptions, Button, Steps, PageHeader, AutoComplete, Form, Input, Collapse} from 'antd';
import { Col, Row } from 'antd';
const { Step } = Steps;
const { Panel } = Collapse;



class TicketBuyPassengers extends React.Component {

    constructor(props) {
        super(props)
        this.code = this.props.params.code;
        this.passengers = 4;
        this.state = {
            flight : {},
            origin : {},
            destination: {},
            plane: {},
            airline: {},
            tickets: {}
          }
          this.getFlightDetails();

    }

    getFlightDetails = async () => {
        console.log(this.code);
        const { data, error } = await this.props.supabase
          .from('flight')
          .select()
          .eq('code', this.code )
  
        if ( error == null && data.length > 0){
          // Data is a list
          this.setState({
            flight : data[0]
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
          .eq('code', this.state.flight.origin )
  
        if ( error == null && data.length > 0){
          // Data is a list
          this.setState({
            origin : data[0]
          }) 
        }
      }

      getAirportDestinationDetails = async () => {
        const { data, error } = await this.props.supabase
          .from('airport')
          .select()
          .eq('code', this.state.flight.destination )
  
        if ( error == null && data.length > 0){
          // Data is a list
          this.setState({
            destination : data[0]
          }) 
        }
      }

      getPlaneDetails = async () => {
        const { data, error } = await this.props.supabase
          .from('plane')
          .select()
          .eq('id', this.state.flight.plane )
  
        if ( error == null && data.length > 0){
          // Data is a list
          this.setState({
            plane : data[0]
          }) 
        }
      }

      getAirlineDetails = async () => {
        const { data, error } = await this.props.supabase
          .from('airline')
          .select()
          .eq('id', this.state.flight.airline )
  
        if ( error == null && data.length > 0){
          // Data is a list
          this.setState({
            airline : data[0]
          }) 
        }
      }

      getFlightTickets = async () => {
        const { data, error } = await this.props.supabase
          .from('ticket')
          .select()
          .eq('flight_code', this.state.flight.code )
  
        if ( error == null && data.length > 0){
          // Data is a list
          this.setState({
            tickets : data
          }) 
        }
      }

      createRowSeat = () => {
        console.log(this.state.plane.columns)
        const array = []
        const half_length = this.state.plane.columns/2;
    
        for(var i = 1; i <= this.state.plane.columns; i++){
          array.push(<Button>{i}</Button>)
          if (i == half_length) {
            array.push(<Button></Button>)
          }
        }
        array.push(<br></br>)

    
        return array
      }

      createSeats = () => {
        const array = []
        console.log(this.state.plane.rows)

        for(var i = 1; i <= this.state.plane.rows; i++){
          array.push(this.createRowSeat());
        }

        return array
      }

      createPassengerForms = () => {
        const array = []

        for(var i = 1; i <= this.passengers; i++) {
          array.push(this.createPassengerForm(i));
        }

        return array
      }

      createPassengerForm(i){
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
          },
          {
            value: 'No revelado',
          }
        ];
        array.push(  <AutoComplete
          style={{
            width: 200,
          }}
          options = {optionsTratamiento}
          placeholder="Tratamiento"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />)


        return     <Panel header="Pasajero " key={value}>
            <Form name="basic" labelCol={{span: 8,}} wrapperCol={{span: 5,}}initialValues={{remember: true,}}>
              <Form.Item label="Nombre" name="Nombre" rules={[
              {
                required: true,
                message: 'Por favor, introduce el nombre del pasajero',
              },]}>
                <Input/>
              </Form.Item>

              <Form.Item label="Apellido" name="Apellido" rules={[
              {
                required: true,
                message: 'Por favor, introduce el apellido del pasajero',
              },]}>
                <Input/>
              </Form.Item>


              <Form.Item label="Tratamiento" name="username" rules={[
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
                }/>
              </Form.Item>
            </Form>
          </Panel>
      }
  

    render() { 
      return (
        <div>
          <PageHeader title="Información del vuelo" extra={[
            <Button>Cambiar búsqueda</Button>]}>
            <Descriptions size="small" column={1}>
              <Descriptions.Item label ="Origen">{ this.state.origin.city }</Descriptions.Item>
              <Descriptions.Item label ="Destino">{ this.state.destination.city }</Descriptions.Item>
              <Descriptions.Item label ="Número de pasajeros">{ this.passengers }</Descriptions.Item>
            </Descriptions>

          </PageHeader>

          <Steps progressDot current={1}>
            <Step title="Vuelos" description="Selección del vuelo del que se quiere comprar el ticket" />
            <Step title="Pasajeros" description="Pasajeros que querrán viajar" />
            <Step title="Asientos" description="Asientos que se escogeran a la hora de viajar" />
            <Step title="Compra" description="Compra de los billetes" />
          </Steps>

          <Collapse defaultActiveKey={['1']}>
            {this.createPassengerForms()}
          </Collapse>   
          <Button>Cambiar búsqueda</Button>   
          <Button type="primary">Siguiente</Button>
        </div>
      )
    }
  }

  

  export default withRouter(TicketBuyPassengers);

  
