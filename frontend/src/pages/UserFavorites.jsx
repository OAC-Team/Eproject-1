import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import paintingApi from "../api/paintingApi"
import Cookies from 'js-cookie'

export default function UserFavorites() {
    const [paintings, setPaintings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserFavoritePaintings() {
            const token = Cookies.get('token');
            const fetchedPaintings = await paintingApi.getUserFavoritePaintings(token);
            console.log(fetchedPaintings.favorites);
            setPaintings(fetchedPaintings.favorites);
            setLoading(false);
        }

        fetchUserFavoritePaintings()
    }, [])

    function handleViewPainting(painting_id) {
        navigate(`/gallery/${painting_id}`)
    }

    if (loading) {
        return <div className="loading-spinner">Loading your favorites...</div>;
    }

    return (
        <div>
            <h1>Your Favorite Paintings</h1>
            <div className="recommended-gallery-grid">
                {paintings.map((painting) => (
                    <div key={painting._id} className="gallery-card">
                        {/* Image Frame Wrapper */}
                        <div className="gallery-image-frame">
                            <img
                                src={`${painting.image_url}`}
                                alt={painting.title}
                                className="gallery-display-img"
                            />

                            <div className="gallery-card-overlay">
                                <span className="gallery-artist-tag">{painting.artist}</span>
                                <div className="gallery-view-action">
                                    <button onClick={() => handleViewPainting(painting._id)}>
                                        <img className="open-url-icon" src="/open_url.png" alt=""></img>
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
        </div>
    )
}