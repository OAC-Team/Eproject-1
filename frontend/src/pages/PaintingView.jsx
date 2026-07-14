import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import paintingApi from '../api/paintingApi'
import userApi from '../api/userApi'
import '../themes/PaintingView.css'
import AddCollectionModal from '../components/AddCollectionModal'
import Swal from 'sweetalert2'

export default function PaintingView() {
    const BASE_URL = 'http://localhost:5000'

    const navigate = useNavigate();
    const location = useLocation();

    const passedUserData = location.state?.userData || null;

    const { painting_id } = useParams();
    const [activeHexPills, setActiveHexPills] = useState({});
    const [viewPainting, setViewPainting] = useState({});
    const [uploader, setUploader] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [userData, setUserData] = useState(passedUserData);

    async function fetchPainting(paintingId) {
        const fetchedPainting = await paintingApi.getPainting(paintingId);
        setViewPainting(fetchedPainting.painting)
        setUploader(fetchedPainting.uploader)
    }

    async function handleFavorite() {
        console.log("Saved to user's favorite")
    }

    const token = Cookies.get('token');
    async function handleSave(collectionName) {
        try {
            const response = await userApi.saveToCollection(collectionName, painting_id, token)

            console.log(response)
            if (response) {
                Swal.fire({
                    title: 'Save successfully',
                    text: `Saved to collection: ${collectionName}`,
                    icon: 'success',
                    confirmButtonText: 'Done'
                })

                setUserData(prevUser => ({
                    ...prevUser,
                    collections: response.userCollections
                }));

                setIsCollectionModalOpen(false)
            }
            console.log(response)
        } catch (error) {
            console.error('Error to save!', error)
            const errorMessage = error.response ? error.response.data : 'Something went wrong';
            Swal.fire({
                title: 'Failed to save',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Done'
            })
        }
    }

    useEffect(() => {
        fetchPainting(painting_id)
    }, [painting_id])

    useEffect(() => {
        async function fallbackFetch() {
            if (!userData) {
                console.log("Data empty");
                const token = Cookies.get('token')
                if (!token) return;

                try {
                    const response = await userApi.fetchUser(token)
                    setUserData(response)
                } catch (error) {
                    console.error(error.message)
                }
            }
        }

        fallbackFetch()
    }, [])

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
                            <button onClick={() => setIsCollectionModalOpen(true)}>
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

            <AddCollectionModal
                isOpen={isCollectionModalOpen}
                onClose={() => setIsCollectionModalOpen(false)}
                collections={userData?.collections}
                onSelectCollection={handleSave}
            />

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