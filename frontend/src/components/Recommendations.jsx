
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import paintingApi from '../api/paintingApi';
export default function Recommendations({refreshTrigger}) {
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
                        {recommended.map(p => (
                            <div key={p._id} className="gallery-card"
                                onClick={() => navigate(`/gallery/${p._id}`)}>
                                <div className="gallery-image-frame">
                                    <img src={p.image_url} alt={p.title}
                                        className="gallery-display-img" />
                                </div>
                                <div className="gallery-card-details">
                                    <h4 className="gallery-card-title">{p.title}</h4>
                                    {p.artistic_style && (
                                        <span className="gallery-style-badge">
                                            {p.artistic_style}
                                        </span>
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