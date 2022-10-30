import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchFlight from "./SearchFlight";
import { deserializeSearch, serializeSearch } from "../searchSerialization";
import {
  searchSingleFlight,
  searchRoundTrip,
  getAirports,
  getAirlines,
} from "../api";
import FlightCard from "./FlightCard";
import { List } from "antd";
import RoundTripCard from "./RoundTripCard";

export default function FlightSearchResults({ supabase }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [airports, setAirports] = useState(new Map());
  const [airlines, setAirlines] = useState(new Map());
  const [search, setSearch] = useState(deserializeSearch(searchParams));
  const [filters, setFilter] = useState({});
  const [order, setOrder] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    getAirports(supabase).then(setAirports);
    getAirlines(supabase).then(setAirlines);
  }, [supabase]);

  useEffect(() => {
    setSearch(deserializeSearch(searchParams));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const searchFn = search.roundTrip ? searchRoundTrip : searchSingleFlight;
    searchFn(supabase, search, order, filters).then((newResults) => {
      setResults(newResults);
      setLoading(false);
    });
  }, [supabase, search, order, filters]);

  const onSearch = (values) => setSearchParams(serializeSearch(values));

  return (
    <div>
      <SearchFlight airports={airports} onSearch={onSearch} values={search} />
      <List
        loading={loading}
        bordered={true}
        dataSource={results}
        pagination={{
          pageSize: 10,
        }}
        renderItem={(result) =>
          result.return ? (
            <List.Item>
              <RoundTripCard
                trip={result}
                airports={airports}
                airlines={airlines}
              ></RoundTripCard>
            </List.Item>
          ) : (
            <List.Item key={result.code}>
              <FlightCard
                flight={result}
                airports={airports}
                airlines={airlines}
                showSelect={true}
              ></FlightCard>
            </List.Item>
          )
        }
      ></List>
    </div>
  );
}
