import moment from "moment";

export async function getAirports(supabase) {
  const { data } = await supabase.from("airport").select("code, name, country");
  return new Map(data.map((airport) => [airport.code, airport]));
}

export async function getAirlines(supabase) {
  const { data } = await supabase.from("airline").select("id, name, image");
  return new Map(data.map((airline) => [airline.id, airline]));
}

export async function searchSingleFlight(supabase, search, order, filters) {
  const { data } = await supabase
    .from("flight_with_seats")
    .select("*")
    .eq("origin", search.origin)
    .eq("destination", search.destination)
    .gte("available_seats", search.passengers)
    .gte("departure", search.date.format("YYYY-MM-DD"))
    .lt("departure", moment(search.date).add(1, "day").format("YYYY-MM-DD"));
  return data;
}

export async function searchRoundTrip(supabase, search, order, filters) {
  const { data } = await supabase
    .from("round_trip")
    .select("*")
    .eq("departure_origin", search.origin)
    .eq("departure_destination", search.destination)
    .gte("departure_available_seats", search.passengers)
    .gte("departure_departure", search.dates[0].format("YYYY-MM-DD"))
    .lt(
      "departure_departure",
      moment(search.dates[0]).add(1, "day").format("YYYY-MM-DD")
    )
    .gte("return_available_seats", search.passengers)
    .gte("return_departure", search.dates[1].format("YYYY-MM-DD"))
    .lt(
      "return_departure",
      moment(search.dates[1]).add(1, "day").format("YYYY-MM-DD")
    );

  return data.map((result) => {
    const trip = {
      departure: {},
      return: {},
    };

    Object.keys(result).forEach((key) => {
      if (key.startsWith("departure"))
        trip.departure[key.replace("departure_", "")] = result[key];
      else trip.return[key.replace("return_", "")] = result[key];
    });

    return trip;
  });
}
