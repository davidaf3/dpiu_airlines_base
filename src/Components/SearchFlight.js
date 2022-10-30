import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchFlightInput from "./SearchFlightInput";
import { deserializeSearch, serializeSearch } from "../searchSerialization";
import { getAirports, getAirlines } from "../api";
import SearchResults from "./SearchResults";

export default function SearchFlight({ supabase }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [airports, setAirports] = useState(new Map());
  const [airlines, setAirlines] = useState(new Map());
  const [search, setSearch] = useState(deserializeSearch(searchParams));

  useEffect(() => {
    getAirports(supabase).then(setAirports);
    getAirlines(supabase).then(setAirlines);
  }, [supabase]);

  useEffect(() => {
    setSearch(deserializeSearch(searchParams));
  }, [searchParams]);

  const onSearch = (values) => setSearchParams(serializeSearch(values));

  return (
    <div>
      <SearchFlightInput
        airports={airports}
        onSearch={onSearch}
        values={search}
      />
      <SearchResults
        supabase={supabase}
        search={search}
        airports={airports}
        airlines={airlines}
      ></SearchResults>
    </div>
  );
}
