import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import paintingApi from '../api/paintingApi'

export default function PaintingView() {
    const BASE_URL = 'http://localhost:5000'
    const { painting_id } = useParams();
    const [viewPainting, setViewPainting] = useState({});
    const [activeHexPills, setActiveHexPills] = useState({});

    async function fetchPainting(paintingId) {
        const fetchedPainting = await paintingApi.getPainting(paintingId);
        setViewPainting(fetchedPainting.painting)
        console.log(fetchedPainting);
        console.log(fetchedPainting.painting.image_url);
        console.log(viewPainting)
    }

    useEffect(() => {
        fetchPainting(painting_id)
    }, [painting_id])

    return (
        <div>
            <div className="painting-info-container">
                <div className="painting-img-wrapper">
                    <img className="painting-img" src={`${BASE_URL}${viewPainting?.image_url}`} alt={viewPainting?.title} />
                </div>

                <div className="painting-details-sidebar">
                    <h1 className="painting-title">{viewPainting?.title || "Untitled Masterpiece"}</h1>
                    <p className="painting-description">{viewPainting?.description || "No description provided yet."}</p>

                    <div className="colors-section">
                        <span className="colors-heading">Included Colors:</span>
                        <div className="colors-grid">
                            {viewPainting?.colors?.map((color, index) => {
                                const isHexActive = !!activeHexPills[index];

                                const handlePillClick = () => {
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
        </div>
    )
}