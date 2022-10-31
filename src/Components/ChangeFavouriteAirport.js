import { Form, Row, Button, Col, notification } from "antd";
import AirportSelect from "./AirportSelect";
import { useEffect, useRef } from "react";

export default function ChangeFavouriteAirport({ supabase, airports, user }) {
  const formRef = useRef(null);

  const updateFavouriteAirport = async (values) => {
    const { data, error } = await supabase
      .from("user")
      .update({ airport: values.fav })
      .eq("id", user.id);

    if (error === null) {
      notification.open({
        message: "Se ha actualizado el aeropuerto favorito",
        description:
          "Ahora este aeropuerto será el que te aparezca por defecto como aeropuerto de origen",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    }
  };

  useEffect(() => {
    if (user) formRef.current.setFieldValue("fav", user.airport);
  }, [user]);

  return (
    <Form
      ref={formRef}
      onFinish={updateFavouriteAirport}
      name="searchFlight"
      layout="vertical"
    >
      <Row align="bottom">
        <Col span={5}>
          <Form.Item name="fav" label="Aeropuerto favorito">
            <AirportSelect key="fav" airports={airports} />
          </Form.Item>
        </Col>
        <Col span={1}>
          <Form.Item>
            <Button type="primary" htmlType="submit" title="Seleccionar" block>
              Seleccionar
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
