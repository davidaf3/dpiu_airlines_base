import SearchFlightInput from "./SearchFlightInput";
import GetCheapestFlights from "./GetCheapestFlights";
import { useNavigate } from "react-router-dom";
import { serializeSearch } from "../searchSerialization";

import ChangeFavouriteAirport from "./ChangeFavouriteAirport";
import { Divider, Typography, Row } from "antd";

export default function Home({ supabase, airports, user }) {
  const navigate = useNavigate();

  const searchFlights = (search) => {
    navigate({
      pathname: "/flights/search",
      search: "?" + serializeSearch(search).toString(),
    });
  };

  const showFavouriteAirport = () => {
    let array = []
    console.log({user})
    if ({user} != null) {
      array.push(<Divider><Typography.Text>Selecciona tu aeropuerto favorito y te quedará guardado</Typography.Text></Divider>)
      array.push(<Row justify="center"><ChangeFavouriteAirport supabase={supabase} airports={airports} user={user} /></Row>)
    }
    return array
  };

  return ( 
    <div>
      <SearchFlightInput
        airports={airports}
        onSearch={searchFlights}
        user={user}
      ></SearchFlightInput>
      {showFavouriteAirport()}
      <GetCheapestFlights supabase={supabase} user ={user}/>


    </div>
  );
}
