import { Row, Col, Typography, Avatar, Skeleton, Button, Divider } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function FlightCard({
  flight,
  airports,
  airlines,
  passengers,
  showSelect = true,
}) {
  const navigate = useNavigate();

  const origin = airports.get(flight.origin);
  const destination = airports.get(flight.destination);

  const departure = moment(flight.departure);
  const arrival = moment(flight.arrival);

  const [hh, mm] = flight.duration.split(":");

  const airline = airlines.get(flight.airline);

  const { Title, Text, Link } = Typography;

  return (
    <Row style={{ width: "100%" }}>
      <Col>
        <Row gutter={16}>
          {airline ? (
            <Col style={{ display: "flex", flexFlow: "column" }}>
              <Row>
                <Text type="secondary" style={{ fontSize: ".9em" }}>
                  {airline.name}
                </Text>
              </Row>
              <Row style={{ margin: "auto" }}>
                <Avatar
                  src={`https://gfhyobdofzshidbbnaxf.supabase.co/storage/v1/object/public/airlines/${airline.image}`}
                />
              </Row>
            </Col>
          ) : (
            <Col style={{ display: "flex", alignItems: "center" }}>
              <Skeleton.Avatar active />
            </Col>
          )}
          <Col style={{ marginLeft: "1em", paddingRight: "0" }}>
            <Row>
              <Col>
                <Row style={{ marginBottom: ".3em" }}>&nbsp;</Row>
                <Row>
                  <Title level={4}>{departure.format("HH:mm")}</Title>
                </Row>
              </Col>
              <Col
                style={{
                  margin: "auto",
                  display: "flex",
                  flexFlow: "column",
                  alignItems: "center",
                }}
              >
                <Row style={{ marginBottom: ".3em" }}>
                  {hh !== "00" && hh.replace(/^0+/, "") + " h"}{" "}
                  {mm !== "00" && mm.replace(/^0+/, "") + " min"}
                </Row>
                <Row>
                  <ArrowRightOutlined
                    style={{ fontSize: "1.2em", marginBottom: "0.5em" }}
                  />
                </Row>
              </Col>
            </Row>
            <Row style={{ paddingRight: "2em" }}>
              {origin ? `${origin.name} (${origin.code})` : flight.origin}
            </Row>
          </Col>
          <Col style={{ paddingLeft: "0" }}>
            <Row style={{ marginBottom: ".3em" }}>&nbsp;</Row>
            <Row>
              <Title level={4}>{arrival.format("HH:mm")}</Title>
            </Row>
            <Row>
              {destination
                ? `${destination.name} (${destination.code})`
                : flight.origin}
            </Row>
          </Col>
        </Row>
      </Col>
      <Col
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button type="link" onClick={() => navigate(`/flights/${flight.code}`)}>
          <Link type="Link" underline>
            Detalles
          </Link>
        </Button>
      </Col>
      {showSelect && <Divider type="vertical" style={{ height: "auto" }} />}
      {showSelect && (
        <Col
          style={{
            marginLeft: "16px",
            display: "flex",
            flexFlow: "column",
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
                  {flight.base_price} €
                </Title>
              </Row>
              <Row>
                <Text type="secondary" style={{ marginBottom: "1em" }}>
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
                  `/flights/buy_ticket?departure=${flight.code}&passengers=${passengers}`
                )
              }
            >
              Seleccionar
            </Button>
          </Row>
        </Col>
      )}
    </Row>
  );
}
