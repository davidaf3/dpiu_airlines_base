import SearchFlightInput from "./SearchFlightInput";
import GetCheapestFlights from "./GetCheapestFlights";
import { useNavigate } from "react-router-dom";
import { serializeSearch } from "../searchSerialization";
import { useEffect, useState } from "react";
import { getAirports } from "../api";

export default function Home({ supabase }) {
  const navigate = useNavigate();

  const [airports, setAirports] = useState(new Map());

  useEffect(() => {
    getAirports(supabase).then(setAirports);
  }, [supabase]);

  const searchFlights = (search) => {
    navigate({
      pathname: "/flights/search",
      search: "?" + serializeSearch(search).toString(),
    });
  };

  return (
    <div>
      <SearchFlightInput
        airports={airports}
        onSearch={searchFlights}
      ></SearchFlightInput>
      <GetCheapestFlights supabase={supabase}/>
    </div>
  );
}
