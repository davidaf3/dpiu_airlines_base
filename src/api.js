import moment from "moment";

export async function getAirports(supabase) {
  const { data } = await supabase.from("airport").select("code, name, country");
  return new Map(data.map((airport) => [airport.code, airport]));
}

export async function getAirlines(supabase) {
  const { data } = await supabase.from("airline").select("id, name, image");
  return new Map(data.map((airline) => [airline.id, airline]));
}

function searchToSingleFlightQueryArgs(search) {
  return {
    origin_arg: search.origin,
    destination_arg: search.destination,
    passengers: search.passengers,
    departure_min: search.date.format("YYYY-MM-DD"),
    departure_max: moment(search.date).add(1, "day").format("YYYY-MM-DD"),
  };
}

function searchToRoundTripQueryArgs(search) {
  return {
    origin_arg: search.origin,
    destination_arg: search.destination,
    passengers: search.passengers,
    departure_departure_min: search.dates[0].format("YYYY-MM-DD"),
    departure_departure_max: moment(search.dates[0])
      .add(1, "day")
      .format("YYYY-MM-DD"),
    return_departure_min: search.dates[1].format("YYYY-MM-DD"),
    return_departure_max: moment(search.dates[1])
      .add(1, "day")
      .format("YYYY-MM-DD"),
  };
}

function singleFlightQuery(supabase, args, search, filters) {
  const query = supabase
    .from("flight_with_seats")
    .select("*")
    .eq("origin", args.origin_arg)
    .eq("destination", args.destination_arg)
    .gte("available_seats", args.passengers)
    .gte("departure", args.departure_min)
    .lt("departure", args.departure_max);

  if (filters) {
    query
      .in("airline", filters.airlines)
      .gte(
        "departure",
        moment(search.date).add(filters.hour[0], "hour").format()
      )
      .lte(
        "departure",
        moment(search.date).add(filters.hour[1], "hour").format()
      );
  }

  return query;
}

function roundTripQuery(supabase, args, search, filters) {
  const query = supabase
    .from("round_trip")
    .select("*")
    .eq("departure_origin", args.origin_arg)
    .eq("departure_destination", args.destination_arg)
    .gte("departure_available_seats", args.passengers)
    .gte("departure_departure", args.departure_departure_min)
    .lt("departure_departure", args.departure_departure_max)
    .gte("return_available_seats", args.passengers)
    .gte("return_departure", args.return_departure_min)
    .lt("return_departure", args.return_departure_max);

  if (filters) {
    query
      .in("departure_airline", filters.airlines)
      .in("return_airline", filters.airlines)
      .gte(
        "departure_departure",
        moment(search.dates[0]).add(filters.departure_hour[0], "hour").format()
      )
      .lte(
        "departure_departure",
        moment(search.dates[0]).add(filters.departure_hour[1], "hour").format()
      )
      .gte(
        "return_departure",
        moment(search.dates[1]).add(filters.return_hour[0], "hour").format()
      )
      .lte(
        "return_departure",
        moment(search.dates[1]).add(filters.return_hour[1], "hour").format()
      );
  }

  return query;
}

export async function searchSingleFlight(supabase, search, order, filters) {
  const args = searchToSingleFlightQueryArgs(search);
  const flightsQuery = singleFlightQuery(supabase, args, search, filters).order(
    order.col,
    { ascending: order.asc }
  );
  let airportsQuery = supabase.rpc("get_distinct_airline_single_flight", args);
  let hoursQuery = supabase.rpc("get_min_max_hours_single_flight", args);

  let responses = await Promise.all([flightsQuery, airportsQuery, hoursQuery]);
  responses = responses.map((response) => response.data);

  responses[1] = responses[1].map((el) => el.airline);

  const hours = responses[2];
  responses[2] = {
    min: moment(hours.min).get("hour"),
    max: moment(hours.max).get("hour") + 1,
  };

  return responses;
}

export async function searchRoundTrip(supabase, search, order, filters) {
  const args = searchToRoundTripQueryArgs(search);
  const flightsQuery = roundTripQuery(supabase, args, search, filters).order(
    order.col,
    { ascending: order.asc }
  );
  let airportsQuery = supabase.rpc("get_distinct_airline_round_trip", args);
  let hoursQuery = supabase.rpc("get_min_max_hours_round_trip", args);

  let responses = await Promise.all([flightsQuery, airportsQuery, hoursQuery]);
  responses = responses.map((response) => response.data);

  responses[0] = responses[0].map((result) => {
    const trip = {
      departure: {},
      return: {},
      base_price: result.base_price,
      duration: result.duration,
    };

    Object.keys(result).forEach((key) => {
      if (key.startsWith("departure"))
        trip.departure[key.replace("departure_", "")] = result[key];
      else if (key.startsWith("return"))
        trip.return[key.replace("return_", "")] = result[key];
    });

    return trip;
  });

  responses[1] = responses[1].map((el) => el.airline);

  const hours = responses[2];
  responses[2] = {
    departure: {
      min: moment(hours.departure_min).get("hour"),
      max: moment(hours.departure_max).get("hour") + 1,
    },
    return: {
      min: moment(hours.return_min).get("hour"),
      max: moment(hours.return_max).get("hour") + 1,
    },
  };

  return responses;
}
