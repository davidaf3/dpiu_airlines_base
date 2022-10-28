import React from 'react';
import withRouter from './withRouter';

class FlightDetails extends React.Component {

    constructor(props) {
        super(props)
        this.code = this.props.params.code;
        this.state = {
            flight : {},
            origin : {},
            destination: {},
            plane: {}
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
          }, () => {this.getAirportOriginDetails();
            this.getAirportDestinationDetails();
            this.getPlaneDetails();}) 
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
  

    render() { 
      return (
        <div>
            <h2> code: { this.state.flight.code } </h2>
            <h2> departure: { this.state.flight.departure } </h2>
            <h2> modelo: { this.state.plane.name } </h2>
        </div>
      )
    }
  }

  export default withRouter(FlightDetails);
