import { useState, useEffect, useRef, useCallback } from "react";
import FlightCard from "./FlightCard";
import { List, Row, Col, Typography, Drawer, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import RoundTripCard from "./RoundTripCard";
import SortDropdown from "./SortDropdown";
import SearchFilters from "./SearchFilters";
import { searchSingleFlight, searchRoundTrip } from "../api";

export default function SearchResults({
  supabase,
  search,
  airports,
  airlines,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  const minMaxHours = useRef({});
  const availabelAirlines = useRef([]);

  const filters = useRef(null);
  const applyFilters = (newFilters) => {
    filters.current = newFilters;
    fetchResults(search);
  };

  const order = useRef({ col: "base_price", asc: true });
  const selectOrder = (newOrder) => {
    order.current = newOrder;
    fetchResults(search);
  };

  const filtersForm = useRef(null);

  const fetchResults = useCallback(
    async (search) => {
      setLoading(true);

      const searchFn = search.roundTrip ? searchRoundTrip : searchSingleFlight;
      const [newResults, newAvailableAirlines, newMinMaxHours] = await searchFn(
        supabase,
        search,
        order.current,
        filters.current
      );

      setLoading(false);
      setResults(newResults);
      minMaxHours.current = newMinMaxHours;
      availabelAirlines.current = newAvailableAirlines;
    },
    [supabase]
  );

  const resetFilters = () => {
    if (filtersForm.current)
      filtersForm.current.resetFields(
        minMaxHours.current,
        availabelAirlines.current
      );
  };

  useEffect(() => {
    if (search) {
      filters.current = null;
      fetchResults(search).then(resetFilters);
    }
  }, [search, fetchResults]);

  const { Text } = Typography;

  return (
    <div>
      <List
        loading={loading}
        bordered={true}
        dataSource={results}
        pagination={{
          pageSize: 10,
        }}
        header={
          <Row>
            <Col style={{ display: "flex", alignItems: "center" }}>
              <div>
                <Text strong>{results.length}</Text>{" "}
                <Text>{results.length === 1 ? "resultado" : "resultados"}</Text>
              </div>
            </Col>
            <Col
              flex={"auto"}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "1em",
              }}
            >
              <SortDropdown onSelect={selectOrder}></SortDropdown>
            </Col>
            <Col>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFiltersOpen(true)}
              >
                Filtrar
              </Button>
            </Col>
          </Row>
        }
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
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        extra={<Button onClick={resetFilters}>Restablecer</Button>}
      >
        {(results.length > 0 || filters.current != null) && (
          <SearchFilters
            ref={filtersForm}
            minMaxHours={minMaxHours.current}
            availableAirlines={availabelAirlines.current}
            allAirlines={airlines}
            setFilters={applyFilters}
          />
        )}
      </Drawer>
    </div>
  );
}
