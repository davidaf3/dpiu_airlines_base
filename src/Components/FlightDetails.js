import React from 'react';
import withRouter from './withRouter';
import { Badge, Descriptions, Button } from 'antd';

class FlightDetails extends React.Component {

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

      createRowSeat = (j) => {
        console.log(this.state.plane.columns)
        const row = j
        const array = []
        const half_length = this.state.plane.columns/2;
    
        for(var i = 1; i <= this.state.plane.columns; i++){
          for (var z = 0; z < this.state.tickets.length; z++) {
            if (this.state.tickets[z].column == j) {
              if (this.state.tickets[z].row == i) {
                array.push(<Button disabled>X</Button>)
              } else {
                array.push(<Button>{i}</Button>)
              }
            } else {
              array.push(<Button>{i}</Button>)
            }
          }

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
          array.push(this.createRowSeat(i));
        }

        return array
      }
  

    render() { 
      return (
        <div>
            <Descriptions title = "Detalles del vuelo" bordered>
              <Descriptions.Item label ="Código del vuelo" span = {3}>{ this.state.flight.code }</Descriptions.Item>
              <Descriptions.Item label ="Aeropuerto de origen">{ this.state.origin.name }</Descriptions.Item>
              <Descriptions.Item label ="Ciudad">{ this.state.origin.city }</Descriptions.Item>
              <Descriptions.Item label ="Hora de salida">{ this.state.flight.departure }</Descriptions.Item>
              <Descriptions.Item label ="Aeropuerto de destino">{ this.state.destination.name }</Descriptions.Item>
              <Descriptions.Item label ="Ciudad">{ this.state.destination.city }</Descriptions.Item>
              <Descriptions.Item label ="Hora de llegada">{ this.state.flight.arrival }</Descriptions.Item>
              <Descriptions.Item label ="Aerolínea" span = {2}>{ this.state.airline.name }</Descriptions.Item>
              <Descriptions.Item label ="Modelo del avión">{ this.state.plane.name }</Descriptions.Item>
              <Descriptions.Item label ="Asientos" span = {2}>{this.createSeats()}</Descriptions.Item>
            </Descriptions>
            
        </div>
      )
    }
  }

  export default withRouter(FlightDetails);
