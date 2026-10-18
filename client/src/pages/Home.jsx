import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const q = tab === "all" ? "" : `type=${tab}&`;
        const res = await fetch(`/api/listing/get?${q}limit=6`);
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchListings();
  }, [tab]);

  return (
    <div>
      {/* Hero with rotating background */}
      <section className="hero-bg">
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            SQON Property Management
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-95 drop-shadow">
            Professional Property Management. Trusted Service. Lasting Value.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              to="/search"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 shadow-lg"
            >
              Browse Listings
            </Link>
            <Link
              to="/search?type=rent"
              className="border-2 border-white px-6 py-3 rounded-lg hover:bg-white/20 font-semibold"
            >
              For Rent
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs + grid */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold">Featured Listings</h2>
          <div className="flex gap-2">
            {["all", "sale", "rent"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                  tab === t
                    ? "bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t === "all" ? "All" : `For ${t}`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : listings.length === 0 ? (
          <p className="text-gray-500">No listings yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <ListingItem key={l._id} listing={l} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/search" className="text-blue-700 font-semibold hover:underline">
            View all listings →
          </Link>
        </div>
      </section>
    </div>
  );
}
