import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const statusColors = {
  available: "bg-green-100 text-green-800",
  sold: "bg-red-100 text-red-800",
  rented: "bg-orange-100 text-orange-800",
  unavailable: "bg-gray-200 text-gray-700",
};

export default function Listing() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${id}`);
        const data = await res.json();
        setListing(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);

      // Increment view after load — don't block UI on failure
      try {
        const r = await fetch(`/api/listing/increment-view/${id}`, {
          method: "POST",
        });
        if (r.ok) {
          const { views } = await r.json();
          setListing((prev) => (prev ? { ...prev, views } : prev));
        }
      } catch (err) {
        /* silent */
      }
    };
    fetchListing();
  }, [id]);

  if (loading) return <p className="p-8 text-gray-500">Loading…</p>;
  if (!listing || listing.message)
    return <p className="p-8 text-red-600">Listing not found.</p>;

  const images = listing.images || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="relative bg-black">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImg]}
                alt={listing.title}
                className="w-full max-h-[550px] object-contain mx-auto"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImg((p) => (p - 1 + images.length) % images.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentImg((p) => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10"
                  >
                    ›
                  </button>
                </>
              )}
            </>
          ) : (
            <p className="text-white text-center py-20">No image</p>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setCurrentImg(i)}
                alt={`thumb-${i}`}
                className={`w-20 h-16 object-cover rounded cursor-pointer border-2 ${
                  i === currentImg ? "border-blue-700" : "border-transparent"
                }`}
              />
            ))}
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`text-xs font-bold px-3 py-1 rounded ${
                listing.type === "rent"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-600 text-white"
              }`}
            >
              {listing.type === "rent" ? "FOR RENT" : "FOR SALE"}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded capitalize ${
                statusColors[listing.status] || ""
              }`}
            >
              {listing.status}
            </span>
            <span className="ml-auto text-sm text-gray-500">
              👁 {listing.views ?? 0} views
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <p className="text-gray-600 mb-4">📍 {listing.location}</p>

          <p className="text-2xl font-bold text-blue-700 mb-6">
            ${Number(listing.price).toLocaleString()}
            {listing.type === "rent" && (
              <span className="text-sm text-gray-500 font-normal"> /month</span>
            )}
          </p>

          <h2 className="font-semibold text-lg mb-2">Description</h2>
          <p className="whitespace-pre-wrap text-gray-700 mb-6">
            {listing.description}
          </p>

          <p className="text-sm text-gray-500">
            Listed on {new Date(listing.listedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
