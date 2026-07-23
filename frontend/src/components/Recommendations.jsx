
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import paintingApi from '../api/paintingApi';
export default function Recommendations({ refreshTrigger }) {
    const [recommended, setRecommended] = useState([]);
    const [basis, setBasis] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            const data = await paintingApi.getRecommendedPaintings(token);
            if (data) {
                setRecommended(data.paintings || []);
                setBasis(data.basis || 'recent');
            }
        } catch (error) {
            console.error("Error loading recommendations:", error);
        } finally {
            setLoading(false);
        }
    };

    function handleViewPainting(painting_id) {
        navigate(`/gallery/${painting_id}`)
    }

    useEffect(() => {
        fetchRecommendations();
    }, []);

    return (
        <div>
            {recommended && recommended.length > 0 && (
                <div className="recommended-section-wrapper">
                    <div className="recommended-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>
                            {basis === 'favorites' ? 'Recommended For You' : 'Recently Added'}
                        </h2>
                        <button onClick={fetchRecommendations} className='btn-add-collection-styled' disabled={loading}>
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                    <div className="recommended-gallery-grid">
                        {recommended.map((painting) => (
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
            )}
        </div>
    );
}