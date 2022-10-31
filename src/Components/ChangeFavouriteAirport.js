import { Form, Row, Button, InputNumber, DatePicker, Col, Radio, notification } from "antd";
import AirportSelect from "./AirportSelect";
import { useEffect, useRef, useState } from "react";

export default function ChangeFavouriteAirport({ airports, values }) {
  const [fav, setFav] = useState(values?.fav);

  const formRef = useRef(null);

  const user = "1dc61347-640b-465c-aa28-23868f0b8733";

  const airportWrite = undefined
  const base_airport = undefined


  const updateFavouriteAirport = async () => {
    if (airportWrite != base_airport) {
      const { data, error } = await this.props.supabase
        .from('user')
        .update({ airport: airportWrite })
        .eq('id', user)

      if (error == null) {
        notification.open({
          message: 'Se ha actualizado el aeropuerto favorito',
          description:
            'Ahora este aeropuerto será el que te aparezca por defecto como aeropuerto de origen',
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      }
    } else {
      notification.open({
        message: 'No se ha actualizado el aeropuerto favorito',
        description:
          'Se ha escogido el mismo aeropuerto que ya estaba escogido como aeropuerto favorito',
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
  };

  const getFavouriteAirport = async () => {
    const { data, error } = await this.props.supabase
      .from('user')
      .select('airport')
      .eq('id', user)

    if (error == null && data.length > 0) {
      // Data is a list
      base_airport = data[0]
    }
  };



  useEffect(() => {
    console.log(airports)
    formRef.current.setFieldValue("fav", fav);
    airportWrite = formRef.current.values.fav
    console.log(airportWrite)
  }, [fav]);

  return (
    <Form
      ref={formRef}
      onFinish={updateFavouriteAirport}
      name="searchFlight"
      layout="vertical"
    >
      <Row align="bottom">
        <Col span={5}>
          <Form.Item
            name="fav"
            label="Aeropuerto favorito"
          >
            <AirportSelect
              key="fav"
              airports={airports}
              onChange={setFav}
            />
          </Form.Item>
        </Col>
        <Col span={1}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              title="Seleccionar"
              block
            >Seleccionar</Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
