import { Select, Row, Typography, Space } from "antd";

export default function AirportSelect({ key, value, airports, onChange }) {
  const { Text } = Typography;

  const filterAirportOptions = (input, option) =>
    option.filter.includes(input.toLowerCase());

  return (
    <Select
      showSearch
      filterOption={filterAirportOptions}
      onChange={onChange}
      optionLabelProp="label"
      value={value}
    >
      {airports.map((airport) => (
        <Select.Option
          key={key + airport.code}
          value={airport.code}
          label={`${airport.name} (${airport.code})`}
          filter={`${airport.name} ${airport.code} ${airport.country}`.toLowerCase()}
        >
          <Row>
            <Space>
              <Text strong>{airport.name}</Text>
              <Text type="secondary">{airport.code}</Text>
            </Space>
          </Row>
          <Row>
            <Text style={{ fontSize: "0.8em" }}>{airport.country}</Text>
          </Row>
        </Select.Option>
      ))}
    </Select>
  );
}
