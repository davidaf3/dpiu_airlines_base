import {
  Form,
  Row,
  Button,
  InputNumber,
  DatePicker,
  Col,
  Radio,
} from "antd";
import { SearchOutlined, SwapOutlined } from "@ant-design/icons";
import AirportSelect from "./AirportSelect";
import { useEffect, useRef, useState } from "react";
import moment from "moment";

const excludeAirport = (airportList, code) =>
  airportList.filter((airport) => airport.code !== code);

export default function SearchFlight({ supabase, values, onSearch }) {
  const [airports, setAirports] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [roundTrip, setRoundTrip] = useState(values?.roundTrip ?? true);

  const formRef = useRef(null);

  useEffect(() => {
    supabase
      .from("airport")
      .select("code, name, country")
      .then(({ data }) => {
        setAirports(data);
      });
  }, [supabase]);

  useEffect(() => {
    if (!values) {
      setDestinations(airports);
      setOrigins(airports);
      return;
    }

    setDestinations(excludeAirport(airports, values.origin));
    setOrigins(excludeAirport(airports, values.destination));
  }, [airports, values]);

  useEffect(() => {
    let [departureDate, returnDate] = formRef.current.getFieldValue(
      "dates"
    ) ?? [undefined, undefined];

    if (roundTrip) {
      departureDate = formRef.current.getFieldValue("date");
      returnDate =
        departureDate && departureDate.isSameOrBefore(returnDate)
          ? returnDate
          : undefined;
      formRef.current.setFieldValue("dates", [departureDate, returnDate]);
    } else {
      formRef.current.setFieldValue("date", departureDate);
    }
  }, [roundTrip]);

  const swapOriginDestination = () => {
    setDestinations(origins);
    setOrigins(destinations);
    const destination = formRef.current.getFieldValue("destination");
    const origin = formRef.current.getFieldValue("origin");
    formRef.current.setFieldValue("destination", origin);
    formRef.current.setFieldValue("origin", destination);
  };

  const onAirportChange = (setter) => (code) =>
    setter(excludeAirport(airports, code));

  const disabledDate = (current) => current < moment().subtract(1, "day");

  return (
    <Form
      ref={formRef}
      onFinish={onSearch}
      name="searchFlight"
      layout="vertical"
      initialValues={values ?? { passengers: 1, roundTrip }}
    >
      <Row align="bottom">
        <Form.Item name="roundTrip">
          <Radio.Group onChange={(e) => setRoundTrip(e.target.value)}>
            <Radio value={true}>Ida y vuelta</Radio>
            <Radio value={false}>Solo ida</Radio>
          </Radio.Group>
        </Form.Item>
      </Row>
      <Row align="bottom">
        <Col span={5}>
          <Form.Item
            name="origin"
            label="Origen"
            rules={[
              {
                required: true,
                message: "Introduce un aeropuerto de origen",
              },
            ]}
          >
            <AirportSelect
              key="origin"
              airports={origins}
              onChange={onAirportChange(setDestinations)}
            />
          </Form.Item>
        </Col>
        <Col span={1}>
          <Form.Item>
            <Button
              type="secondary"
              title="Intercambiar origen y destino"
              icon={<SwapOutlined />}
              style={{ width: "100%" }}
              onClick={swapOriginDestination}
            ></Button>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            name="destination"
            label="Destino"
            rules={[
              {
                required: true,
                message: "Introduce un aeropuerto de destino",
              },
            ]}
          >
            <AirportSelect
              key="destination"
              airports={destinations}
              onChange={onAirportChange(setOrigins)}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          {roundTrip ? (
            <Form.Item
              name="dates"
              label="Fechas"
              rules={[
                { required: true, message: "" },
                {
                  validator: async (_, value) => {
                    if (!value || value.some((date) => date === undefined))
                      throw new Error();
                  },
                  message: "Selecciona las fechas de ida y vuelta",
                },
              ]}
            >
              <DatePicker.RangePicker
                placeholder={[
                  "Selecciona la fecha de ida",
                  "Selecciona la fecha de vuelta",
                ]}
                style={{ width: "100%" }}
                disabledDate={disabledDate}
              ></DatePicker.RangePicker>
            </Form.Item>
          ) : (
            <Form.Item
              name="date"
              label="Fecha"
              rules={[
                {
                  required: true,
                  message: "Selecciona la fecha de salida",
                },
              ]}
            >
              <DatePicker
                placeholder={"Selecciona la fecha de salida"}
                style={{ width: "100%" }}
                disabledDate={disabledDate}
              ></DatePicker>
            </Form.Item>
          )}
        </Col>
        <Col span={4}>
          <Form.Item
            name="passengers"
            label="Nº de pasajeros"
            rules={[
              {
                required: true,
                message: "Introduce el número de pasajeros",
              },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }}></InputNumber>
          </Form.Item>
        </Col>
        <Col span={1}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              title="Buscar"
              icon={<SearchOutlined />}
              style={{ width: "100%" }}
            ></Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
