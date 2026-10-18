import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statusColors = {
  available: "bg-green-100 text-green-800",
  sold: "bg-red-100 text-red-800",
  rented: "bg-orange-100 text-orange-800",
  unavailable: "bg-gray-200 text-gray-700",
};

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingViews, setEditingViews] = useState({});
  const token = localStorage.getItem("adminToken");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/listing/get?limit=200");
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    if (!confirm(`Change status to "${status}"?`)) return;
    try {
      const res = await fetch(`/api/listing/status/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      load();
    } catch (e) {
      alert("Could not update status");
    }
  };

  const remove = async (id) => {
    if (!confirm("Permanently delete this listing? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      load();
    } catch (e) {
      alert("Could not delete");
    }
  };

  const adjustViews = async (id, value, mode) => {
    try {
      const res = await fetch(`/api/listing/views/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ views: Number(value), mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, views: data.views } : l))
      );
      setEditingViews((prev) => ({ ...prev, [id]: "" }));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/admin/new"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          + New Listing
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : listings.length === 0 ? (
        <p className="text-gray-500">No listings yet. Create your first one.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Views</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <tr key={l._id} className="border-t align-top">
                  <td className="p-3">
                    {l.images?.[0] ? (
                      <img
                        src={l.images[0]}
                        alt={l.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">
                    {l.title}
                    <div className="text-xs text-gray-500">
                      {new Date(l.listedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-3 capitalize">{l.type}</td>
                  <td className="p-3">${Number(l.price).toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded capitalize ${statusColors[l.status]}`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">👁 {l.views ?? 0}</span>
                      <div className="flex gap-1 items-center">
                        <input
                          type="number"
                          min="0"
                          placeholder="new"
                          value={editingViews[l._id] ?? ""}
                          onChange={(e) =>
                            setEditingViews({
                              ...editingViews,
                              [l._id]: e.target.value,
                            })
                          }
                          className="w-16 border rounded px-1 text-xs"
                        />
                        <button
                          onClick={() => {
                            const v = editingViews[l._id];
                            if (v === "" || v === undefined) return;
                            adjustViews(l._id, v, "set");
                          }}
                          className="text-xs bg-blue-700 text-white px-2 py-1 rounded"
                          title="Set views to this number"
                        >
                          Set
                        </button>
                        <button
                          onClick={() => adjustViews(l._id, 10, "add")}
                          className="text-xs bg-gray-200 px-2 py-1 rounded"
                          title="Add 10 views"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => adjustViews(l._id, 100, "add")}
                          className="text-xs bg-gray-200 px-2 py-1 rounded"
                          title="Add 100 views"
                        >
                          +100
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <Link
                        to={`/admin/edit/${l._id}`}
                        className="text-blue-700 hover:underline text-xs"
                      >
                        Edit
                      </Link>
                      <select
                        onChange={(e) => changeStatus(l._id, e.target.value)}
                        value={l.status}
                        className="text-xs border rounded px-1"
                      >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                      <button
                        onClick={() => remove(l._id)}
                        className="text-red-600 hover:underline text-xs text-left"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
