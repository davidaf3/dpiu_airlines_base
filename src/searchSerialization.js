import { createSearchParams } from "react-router-dom";
import moment from "moment";

export function serializeSearch(search) {
  const params = createSearchParams();
  params.append("roundTrip", search.roundTrip.toString());
  params.append("origin", search.origin);
  params.append("destination", search.destination);
  params.append("passengers", search.passengers.toString());
  if (!search.roundTrip)
    params.append("date", search.date.format("YYYY-MM-DD"));
  else
    search.dates.forEach((date) =>
      params.append("dates", date.format("YYYY-MM-DD"))
    );
  return params;
}

export function deserializeSearch(params) {
  const search = {
    roundTrip: params.get("roundTrip") === "true",
    origin: params.get("origin"),
    destination: params.get("destination"),
    passengers: Number.parseInt(params.get("passengers")),
  };
  if (!search.roundTrip) search.date = moment(params.get("date"));
  else search.dates = params.getAll("dates").map((date) => moment(date));
  return search;
}
