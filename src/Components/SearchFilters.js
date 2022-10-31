import {
  Collapse,
  Divider,
  Form,
  Button,
  Checkbox,
  Row,
  Col,
  Typography,
} from "antd";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { sortAlphabetically } from "../util";
import HourRangeSlider from "./HourRangeSlider";

function getDefaultValues(minMaxHours, availableAirlines) {
  const values = minMaxHours.departure
    ? {
        departure_hour: Object.values(minMaxHours.departure),
        return_hour: Object.values(minMaxHours.return),
      }
    : {
        hour: Object.values(minMaxHours),
      };
  values.airlines = availableAirlines;
  return values;
}

export default forwardRef(function SearchFilters(
  { minMaxHours, availableAirlines, allAirlines, setFilters },
  ref
) {
  const form = useRef();

  useImperativeHandle(ref, () => ({
    resetFields: (newRoundTrip, newMinMaxHours, newAirlines) => {
      const values = getDefaultValues(
        newRoundTrip,
        newMinMaxHours,
        newAirlines
      );
      form.current.setFieldsValue(values);
    },
  }));

  const { Link } = Typography;

  return (
    <Form
      ref={form}
      layout="vertical"
      onFinish={setFilters}
      initialValues={getDefaultValues(minMaxHours, availableAirlines)}
    >
      <Collapse defaultActiveKey={["1", "2"]}>
        <Collapse.Panel header="Hora de salida" key="1">
          {minMaxHours.departure ? (
            <div>
              <Form.Item name="departure_hour" label="Ida">
                <HourRangeSlider minMaxHours={minMaxHours.departure} />
              </Form.Item>
              <Divider dashed />
              <Form.Item name="return_hour" label="Vuelta">
                <HourRangeSlider minMaxHours={minMaxHours.return} />
              </Form.Item>
            </div>
          ) : (
            <Form.Item name="hour">
              <HourRangeSlider minMaxHours={minMaxHours} />
            </Form.Item>
          )}
        </Collapse.Panel>
        <Collapse.Panel header="Aerolíneas" key="2">
          <Row style={{ justifyContent: "space-around", marginBottom: ".6em" }}>
            <Col>
              <Button
                type="link"
                onClick={() => form.current.setFieldValue("airlines", [])}
              >
                <Link type="Link" underline>
                  Desmarcar todas
                </Link>
              </Button>
            </Col>
            <Col>
              <Button
                type="link"
                onClick={() =>
                  form.current.setFieldValue("airlines", availableAirlines)
                }
              >
                <Link type="Link" underline>
                  Marcar todas
                </Link>
              </Button>
            </Col>
          </Row>
          <Form.Item name="airlines">
            <Checkbox.Group
              options={availableAirlines
                .map((id) => {
                  const airline = allAirlines.get(id);
                  return {
                    label: airline?.name ?? id,
                    value: id,
                  };
                })
                .sort(sortAlphabetically((opt) => opt.label))}
            />
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
      <Form.Item style={{ marginTop: "1em" }}>
        <Button type="primary" htmlType="submit" block>
          Aplicar
        </Button>
      </Form.Item>
    </Form>
  );
});
