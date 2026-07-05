import React, { useState, useEffect } from "react";
import { getFavorites, removeFavorite } from "../api/favoriteApi";

const FavoriteList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [groupBy, setGroupBy] = useState("");

  // Hàm load danh sách yêu thích
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await getFavorites({ sortBy, order, groupBy });
      setFavorites(res); // API đã trả về data trực tiếp
    } catch (error) {
      console.error("Load favorites error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [sortBy, order, groupBy]);

  const handleRemove = async (favoriteId) => {
    if (!window.confirm("Remove from favorites?")) return;
    try {
      await removeFavorite(favoriteId);
      loadFavorites();
    } catch (error) {
      alert("Error removing favorite");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        My Favorites ({favorites.length})
      </h1>

      <Controls
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
      />

      {favorites.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {favorites.map((fav) => (
            <Card key={fav._id} favorite={fav} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

// COMPONENT CONTROLS
const Controls = ({ sortBy, setSortBy, order, setOrder, groupBy, setGroupBy }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
      <option value="created_at">By Date</option>
      <option value="title">By Title</option>
      <option value="artist">By Artist</option>
    </select>
    <select value={order} onChange={(e) => setOrder(e.target.value)}>
      <option value="desc">Newest</option>
      <option value="asc">Oldest</option>
    </select>
    <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
      <option value="">No Group</option>
      <option value="category">Group by Category</option>
      <option value="artist">Group by Artist</option>
    </select>
  </div>
);

// COMPONENT CARD
const Card = ({ favorite, onRemove }) => {
  const p = favorite.paintingId;
  if (!p) return null;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
      <img
        src={p.image_url || "https://via.placeholder.com/300"}
        alt={p.title}
        style={{ width: "100%", height: 160, objectFit: "cover" }}
      />
      <div style={{ padding: 12 }}>
        <h3 style={{ fontWeight: "bold", marginBottom: 4 }}>{p.title}</h3>
        <p style={{ color: "#666", fontSize: 14 }}>{p.artist || "Unknown"}</p>
        <button
          onClick={() => onRemove(favorite._id)}
          style={{ marginTop: 8, color: "red", background: "none", border: "none", cursor: "pointer" }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default FavoriteList;
