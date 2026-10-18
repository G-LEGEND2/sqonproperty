import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem.jsx";

export default function Search() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    type: "all",
    status: "",
    sort: "listedAt",
    order: "desc",
  });

  const fetchListings = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    params.set("sort", filters.sort);
    params.set("order", filters.order);
    params.set("limit", 50);

    try {
      const res = await fetch(`/api/listing/get?${params.toString()}`);
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Listings</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchListings();
        }}
        className="bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-3 mb-8"
      >
        <input
          type="text"
          name="searchTerm"
          placeholder="Search by title or location"
          value={filters.searchTerm}
          onChange={onChange}
          className="border rounded px-3 py-2 md:col-span-2"
        />
        <select
          name="type"
          value={filters.type}
          onChange={onChange}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Types</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={onChange}
          className="border rounded px-3 py-2"
        >
          <option value="">Any Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={onChange}
          className="border rounded px-3 py-2"
        >
          <option value="listedAt">Date Listed</option>
          <option value="price">Price</option>
          <option value="title">Title</option>
        </select>
        <select
          name="order"
          value={filters.order}
          onChange={onChange}
          className="border rounded px-3 py-2"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <button
          type="submit"
          className="bg-blue-700 text-white rounded px-4 py-2 hover:bg-blue-800 md:col-span-2"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-500">No listings match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <ListingItem key={l._id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
