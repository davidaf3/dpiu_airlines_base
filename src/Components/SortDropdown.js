import { Menu, Dropdown, Space, Button } from "antd";
import {
  FieldTimeOutlined,
  EuroOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const labels = new Map([
  ["1", "Más barato"],
  ["2", "Más corto"],
]);

const orders = new Map([
  ["1", { col: "base_price", asc: true }],
  ["2", { col: "duration", asc: true }],
]);

export default function SortDropdown({ onSelect }) {
  const [selected, setSelected] = useState({ key: "1", label: "Más barato" });

  const menu = (
    <Menu
      onClick={({ key }) => {
        setSelected({ key, label: labels.get(key) });
        onSelect(orders.get(key));
      }}
      selectable
      defaultSelectedKeys="1"
      items={[
        {
          key: "1",
          label: "Más barato",
          icon: <EuroOutlined />,
        },
        {
          key: "2",
          label: "Más corto",
          icon: <FieldTimeOutlined />,
        },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu} trigger="click">
      <Button>
        <Space>
          {selected.label}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
