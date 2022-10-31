import { useState, useEffect, useRef } from "react";
import { getTicketHistory, returnTickets } from "../api";
import { Button, Table, Typography, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./TicketHistory.css";

const dateTimeFormat = "DD/MM/YY HH:mm";
const dateFormat = "DD/MM/YY";
const timeFormat = "HH:mm";

function updateFilter(filterRef, history, getter, mapper) {
  filterRef.current = [];
  const visitedElementds = new Set();
  history.forEach((flight) => {
    const element = getter(flight);
    if (visitedElementds.has(element)) return;

    visitedElementds.add(element);
    filterRef.current.push(mapper(element));
  });
}

export default function TicketHistory({ supabase, airports, airlines }) {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedRows, setExpandedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedButton, setClickedButton] = useState("");

  const flightFilter = useRef([]);
  const originAirportFilter = useRef([]);
  const destinationAirportFilter = useRef([]);
  const airlinesFilter = useRef([]);

  const onReturnTickets = async (ids) => {
    const error = await returnTickets(supabase, ids);
    if (error) {
      message.error(
        "Se ha producido un error al procesar la devolución. " +
          "Seguirá disponiendo " +
          (ids.length > 1 ? "de los billetes" : "del billete") +
          " en su cuenta."
      );
      return;
    }

    const idsSet = new Set(ids);
    const historyCopy = [...history];
    const flightsToDelete = [];

    historyCopy.forEach((flight, flightIdx) => {
      const ticketsToDelete = [];

      flight.tickets.forEach((ticket, ticketIdx) => {
        if (idsSet.has(ticket.id)) {
          ticketsToDelete.unshift(ticketIdx);
        }
      });

      ticketsToDelete.forEach((ticket) => flight.tickets.splice(ticket, 1));
      if (flight.tickets.length === 0) {
        flightsToDelete.unshift(flightIdx);
      }
    });

    flightsToDelete.forEach((flightIdx) => historyCopy.splice(flightIdx, 1));
    setHistory(historyCopy);

    message.success("Se ha procesado la devolución con éxito.");
  };

  useEffect(() => {
    getTicketHistory(supabase, "1dc61347-640b-465c-aa28-23868f0b8733").then(
      (newHistory) => {
        setHistory(newHistory);
        setExpandedRows([newHistory[0].key]);
        setLoading(false);
        updateFilter(
          flightFilter,
          newHistory,
          (flight) => flight.code,
          (code) => ({ text: code, value: code })
        );
      }
    );
  }, [supabase]);

  useEffect(() => {
    const mapper = (airport) => ({
      text: airports.has(airport) ? airports.get(airport).name : airport,
      value: airport,
    });

    updateFilter(
      originAirportFilter,
      history,
      (flight) => flight.origin,
      mapper
    );

    updateFilter(
      destinationAirportFilter,
      history,
      (flight) => flight.destination,
      mapper
    );
  }, [history, airports]);

  useEffect(() => {
    updateFilter(
      airlinesFilter,
      history,
      (flight) => flight.airline,
      (airline) => ({
        text: airlines.has(airline) ? airlines.get(airline).name : airline,
        value: airline,
      })
    );
  }, [history, airlines]);

  const { Title, Link } = Typography;

  const flightColumns = [
    {
      title: "Fecha de compra",
      dataIndex: "buyDate",
      key: "buyDate",
      render: (date) => date.format(dateTimeFormat),
      sorter: (f1, f2) => f1.buyDate.diff(f2.buyDate),
      defaultSortOrder: "descend",
    },
    {
      title: "Vuelo",
      dataIndex: "code",
      key: "code",
      render: (code) => (
        <Button type="link" onClick={() => navigate(`/flights/${code}`)}>
          <Link type="link" underline>
            {code}
          </Link>
        </Button>
      ),
      filters: flightFilter.current,
      onFilter: (value, record) => record.code === value,
    },
    {
      title: "Origen",
      dataIndex: "origin",
      key: "origin",
      render: (origin) =>
        airports.has(origin) ? airports.get(origin).name : origin,
      filters: originAirportFilter.current,
      onFilter: (value, record) => record.origin === value,
    },
    {
      title: "Destino",
      dataIndex: "destination",
      key: "destination",
      render: (destination) =>
        airports.has(destination)
          ? airports.get(destination).name
          : destination,
      filters: destinationAirportFilter.current,
      onFilter: (value, record) => record.destination === value,
    },

    {
      title: "Fecha",
      dataIndex: "departure",
      key: "date",
      render: (date) => date.format(dateFormat),
      sorter: (f1, f2) => f1.departure.diff(f2.departure),
    },
    {
      title: "Salida",
      dataIndex: "departure",
      key: "departure",
      render: (date) => date.format(timeFormat),
    },
    {
      title: "Llegada",
      dataIndex: "arrival",
      key: "arrival",
      render: (date) => date.format(timeFormat),
    },
    {
      title: "Aerolínea",
      dataIndex: "airline",
      key: "airline",
      render: (airline) =>
        airlines.has(airline) ? airlines.get(airline).name : airline,
      filters: airlinesFilter.current,
      onFilter: (value, record) => record.airline === value,
    },
    {
      title: "Precio total",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toFixed(2).replace(".", ",")} €`,
      sorter: (f1, f2) => f1.price - f2.price,
      align: "right",
    },
    {
      title: "",
      dataIndex: "tickets",
      key: "actions",
      render: (tickets, record) => (
        <Popconfirm
          placement="topRight"
          title={
            "¿Seguro que desea devolver todos los billetes de esta compra?"
          }
          onConfirm={() => onReturnTickets(tickets.map((ticket) => ticket.id))}
          onOpenChange={(open) => {
            if (!open) setClickedButton("");
          }}
          okText="Sí"
          cancelText="No"
        >
          <Button
            className={clickedButton !== record.key ? "action" : undefined}
            type="link"
            danger
            onClick={() => setClickedButton(record.key)}
          >
            <Link type="danger" underline>
              Devolver todos
            </Link>
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const ticketRowRender = (flight) => {
    const ticketColumns = [
      { title: "Nombre", dataIndex: "firstName", key: "firstName" },
      { title: "Apellidos", dataIndex: "lastName", key: "lastName" },
      { title: "Fila", dataIndex: "row", key: "row", align: "right" },
      { title: "Columna", dataIndex: "column", key: "column", align: "right" },
      {
        title: "Precio",
        dataIndex: "price",
        key: "price",
        render: (price) => `${price.toFixed(2).replace(".", ",")} €`,
        sorter: (t1, t2) => t1.price - t2.price,
        align: "right",
      },
      {
        title: "",
        dataIndex: "id",
        key: "actions",
        render: (id) => (
          <Popconfirm
            placement="topRight"
            title={"¿Seguro que desea devolver este billete?"}
            onConfirm={() => onReturnTickets([id])}
            onOpenChange={(open) => {
              if (!open) setClickedButton("");
            }}
            okText="Sí"
            cancelText="No"
          >
            <Button
              className={clickedButton !== id ? "action" : undefined}
              type="link"
              danger
              onClick={() => setClickedButton(id)}
            >
              <Link type="danger" underline>
                Devolver
              </Link>
            </Button>
          </Popconfirm>
        ),
      },
    ];

    return (
      <Table
        columns={ticketColumns}
        dataSource={[...flight.tickets]}
        pagination={false}
      />
    );
  };

  const onExpand = (expanded, record) => {
    if (expanded) setExpandedRows([...expandedRows, record.key]);
    else {
      const idx = expandedRows.indexOf(record.key);
      expandedRows.splice(idx, 1);
    }
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
    setExpandedRows([]);
  };

  return (
    <div>
      <Title level={2}>Historial de compras</Title>
      <Table
        loading={loading}
        columns={flightColumns}
        dataSource={history}
        expandable={{
          indentSize: 300,
          expandRowByClick: true,
          expandedRowRender: ticketRowRender,
          expandedRowKeys: expandedRows,
          onExpand,
        }}
        pagination={{
          current: currentPage,
          onChange: onPaginationChange,
          pageSize: 10,
        }}
      />
    </div>
  );
}
