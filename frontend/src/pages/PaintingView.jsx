import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import paintingApi from '../api/paintingApi'
import userApi from '../api/userApi'
import '../themes/PaintingView.css'

export default function PaintingView() {
    const BASE_URL = 'http://localhost:5000'
    const navigate = useNavigate()
    const { painting_id } = useParams();
    const [activeHexPills, setActiveHexPills] = useState({});
    const [viewPainting, setViewPainting] = useState({});
    const [uploader, setUploader] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);

    async function fetchPainting(paintingId) {
        const fetchedPainting = await paintingApi.getPainting(paintingId);
        setViewPainting(fetchedPainting.painting)
        setUploader(fetchedPainting.uploader)
    }

    async function handleFavorite() {
        console.log("Saved to user's favorite")
    }

    async function handleSaveToCollection() {
        console.log("Saved to collection")
    }

    useEffect(() => {
        fetchPainting(painting_id)
    }, [painting_id])

    return (
        <div>
            <div className="painting-info-container">
                <div className='painting-info-side-bar'>
                    <div className="painting-info-back-btn">
                        <button onClick={() => navigate(-1)}>
                            <img src="/back-arrow.svg" alt="" />
                        </button>
                    </div>
                    <div className='painting-info-buttons'>
                        <div className="painting-info-favorite-btn">
                            <button onClick={() => handleFavorite()}>
                                <img src="/favorite.svg" alt="" />
                            </button>
                        </div>
                        <div className="painting-info-collection-save-btn">
                            <button onClick={() => handleSaveToCollection()}>
                                <img src="/collection.svg" alt="" />
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className="painting-img-wrapper"
                    onClick={() => setIsFullscreen(true)}
                    style={{ cursor: 'pointer' }}
                    title="Click to view full screen"
                >
                    <img
                        className="painting-img"
                        src={`${BASE_URL}${viewPainting?.image_url}`}
                        alt={viewPainting?.title}
                    />
                </div>

                <div className="painting-details-sidebar">
                    <p>Uploaded by {uploader?.username}</p>
                    <h1 className="painting-title">{viewPainting?.title || "Untitled Artwork"}</h1>
                    <p className="painting-artist">{viewPainting?.artist || "Unknown Artist"}</p>
                    <p className="painting-description">{viewPainting?.description || "No description provided yet."}</p>

                    <div className="colors-section">
                        <span className="colors-heading">Included Colors:</span>
                        <div className="colors-grid">
                            {viewPainting?.colors?.map((color, index) => {
                                const isHexActive = !!activeHexPills[index];

                                const handlePillClick = (e) => {
                                    e.stopPropagation(); // Stops color pill clicks from triggering the image modal!
                                    setActiveHexPills(prev => ({
                                        ...prev,
                                        [index]: !prev[index]
                                    }));
                                };

                                return (
                                    <div
                                        key={index}
                                        className={`color-pill-wrapper ${isHexActive ? 'active-hex' : ''}`}
                                        onClick={handlePillClick}
                                        style={{
                                            cursor: 'pointer',
                                            borderColor: isHexActive ? color.hex : 'transparent',
                                            boxShadow: isHexActive ? `0 0 0 2px ${color.hex}` : '0 2px 6px rgba(0,0,0,0.03)'
                                        }}
                                        title="Click to switch format"
                                    >
                                        <div
                                            className="color-swatch-box"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span className="color-name-label">
                                            {isHexActive ? color.hex.toUpperCase() : color.name}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {isFullscreen && (
                <div className="lightbox-overlay" onClick={() => setIsFullscreen(false)}>
                    <button className="lightbox-close" onClick={() => setIsFullscreen(false)}>✕</button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img src={`${BASE_URL}${viewPainting?.image_url}`} alt={viewPainting?.title} />
                        <p className="lightbox-caption">{viewPainting?.title || "Untitled Masterpiece"}</p>
                    </div>
                </div>
            )}
        </div>
    )
}