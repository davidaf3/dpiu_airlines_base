import React from 'react';
import withRouter from './withRouter';
import { Badge, Descriptions, Button } from 'antd';

class TicketBuy extends React.Component {

    constructor(props) {
        super(props)
        this.code = this.props.params.code;
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
          <Steps progressDot current={2}>
            <Step title="Vuelos" description="Selección del vuelo del que se quiere comprar el ticket" />
            <Step title="Pasajeros" description="Pasajeros que querrán viajar" />
            <Step title="Asientos" description="Asientos que se escogeran a la hora de viajar" />
            <Step title="Compra" description="Compra de los billetes" />
          </Steps>
            <Descriptions title = "Detalles del vuelo" bordered>
              <Descriptions.Item label ="Asientos" span = {2}>{this.createSeats()}</Descriptions.Item>
            </Descriptions>
            
        </div>
      )
    }
  }

  export default withRouter(FlightDetails);
