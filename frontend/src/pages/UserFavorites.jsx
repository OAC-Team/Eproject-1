import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import paintingApi from "../api/paintingApi"
import Cookies from 'js-cookie'

export default function UserFavorites() {
    const [paintings, setPaintings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function fetchUserFavoritePaintings() {
            try {
                const token = Cookies.get('token');
                const response = await paintingApi.getUserFavoritePaintings(token);
                console.log("Favorites response:", response);

                const data = response?.favorites || response?.data?.favorites || [];
                setPaintings(data);
            } catch (error) {
                console.error("Failed to load favorites:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserFavoritePaintings();
    }, []);

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search')?.toLowerCase().trim() || '';
    const surfaceFilter = queryParams.get('surface') || '';
    const mediumFilter = queryParams.get('medium') || '';
    const styleFilter = queryParams.get('style') || '';

    const filteredPaintings = paintings.filter((painting) => {
        const matchesSearch = !searchQuery || 
            painting.title?.toLowerCase().includes(searchQuery) ||
            painting.artist?.toLowerCase().includes(searchQuery) ||
            painting.artistic_style?.toLowerCase().includes(searchQuery);

        const matchesSurface = !surfaceFilter || painting.surface_type === surfaceFilter;
        const matchesMedium = !mediumFilter || painting.color_medium === mediumFilter;
        const matchesStyle = !styleFilter || painting.artistic_style === styleFilter;

        return matchesSearch && matchesSurface && matchesMedium && matchesStyle;
    });

    const handleViewPainting = (paintingId) => {
        navigate(`/paintings/${paintingId}`);
    };

    if (loading) {
        return <div className="loading-spinner">Loading your favorites...</div>;
    }

    return (
        <div>
            <h1>Your Favorite Paintings</h1>

            {filteredPaintings.length === 0 ? (
                <p>
                    {searchQuery || surfaceFilter || mediumFilter || styleFilter
                        ? "No favorited paintings match your current search or filters."
                        : "No favorite paintings yet."}
                </p>
            ) : (
                <div className="recommended-gallery-grid">
                    {filteredPaintings.map((painting) => (
                        <div key={painting._id} className="gallery-card">
                            <div className="gallery-image-frame">
                                <img
                                    src={painting.image_url}
                                    alt={painting.title}
                                    className="gallery-display-img"
                                />

                                <div className="gallery-card-overlay">
                                    <span className="gallery-artist-tag">{painting.artist}</span>
                                    <div className="gallery-view-action">
                                        <button onClick={() => handleViewPainting(painting._id)}>
                                            <img className="open-url-icon" src="/open_url.png" alt="View" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="gallery-card-details">
                                <h4 className="gallery-card-title">{painting.title}</h4>
                                {painting.artistic_style && (
                                    <span className="gallery-style-badge">{painting.artistic_style}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}