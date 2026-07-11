import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../themes/GalleryView.css'
import paintingApi from '../api/paintingApi';

export default function GalleryView() {
    const navigate = useNavigate();
    const BASE_URL = "http://localhost:5000";
    const [searchParams] = useSearchParams();
    const [paintings, setPaintings] = useState([]);

    const searchKeyword = searchParams.get('search') || '';

    function handleViewPainting(painting_id) {
        // console.log(`Navigating to ${painting_id}`)
        navigate(`/gallery/${painting_id}`)
    }

    // Search function
    useEffect(() => {
        async function loadGalleryData() {
            console.log(searchKeyword)
            try {
                const data = await paintingApi.getAllPaintings(searchKeyword)
                setPaintings(data.paintings)
                console.log(data.paintings)
            } catch (error) {
                console.error(error.message)
            }
        }

        loadGalleryData()
    }, [searchKeyword])

    if (!Array.isArray(paintings)) {
        // console.log(paintings)
        // console.log(typeof (paintings))
        return <p>Loading gallery items or data format is invalid...</p>;
    }

    if (paintings.length === 0) {
        return <p>No pictures found in the gallery yet.</p>;
    }

    return (
        <div className="gallery-grid">
            {paintings.map((painting) => (
                <div key={painting._id} className="gallery-card">
                    {/* Image Frame Wrapper */}
                    <div className="gallery-image-frame">
                        <img
                            src={`${BASE_URL}${painting.image_url}`}
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
    );
}