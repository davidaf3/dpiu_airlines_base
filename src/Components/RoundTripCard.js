import { Row, Col, Button, Typography, Divider } from "antd";
import FlightCard from "./FlightCard";
import { useNavigate } from "react-router-dom";

export default function RoundTripCard({
  trip,
  airports,
  airlines,
  passengers,
}) {
  const navigate = useNavigate();

  const { Title, Text } = Typography;

  return (
    <Row style={{ width: "100%", padding: "1em 0" }}>
      <Col flex="auto">
        <Row>
          <FlightCard
            flight={trip.departure}
            airports={airports}
            airlines={airlines}
            showSelect={false}
          ></FlightCard>
        </Row>
        <Divider dashed style={{ margin: "12px 0" }} />
        <Row>
          <FlightCard
            flight={trip.return}
            airports={airports}
            airlines={airlines}
            showSelect={false}
          ></FlightCard>
        </Row>
      </Col>
      <Divider type="vertical" style={{ height: "auto" }} />
      <Col
        style={{
          marginLeft: "16px",
          display: "flex",
          flexFlow: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Row>
          <Col
            style={{
              width: "100%",
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
            }}
          >
            <Row>
              <Title level={3} style={{ marginBottom: ".2em" }}>
                {trip.base_price} €
              </Title>
            </Row>
            <Row>
              <Text type="secondary" style={{ marginBottom: "0" }}>
                por pasajero
              </Text>
            </Row>
          </Col>
        </Row>
        <Row>
          <Button
            type="primary"
            onClick={() =>
              navigate(
                `/flights/buy_ticket?departure=${trip.departure.code}&return=${trip.return.code}&passengers=${passengers}`
              )
            }
          >
            Seleccionar
          </Button>
        </Row>
      </Col>
    </Row>
  );
}
