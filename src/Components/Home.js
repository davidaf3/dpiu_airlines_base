import SearchFlight from "./SearchFlight";

export default function Home({ supabase }) {
  const searchFlights = (filters) => {
    console.log(filters);
  };

  return (
    <div>
      <SearchFlight supabase={supabase} onSearch={searchFlights}></SearchFlight>
    </div>
  );
}
