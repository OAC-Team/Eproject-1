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
    let isOwner

    const { painting_id } = useParams();
    const [activeHexPills, setActiveHexPills] = useState({});
    const [viewPainting, setViewPainting] = useState({});
    const [uploader, setUploader] = useState({});
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [userData, setUserData] = useState(passedUserData);
    const [isLiked, setIsLiked] = useState(null);
    const [likeCount, setLikeCount] = useState(null);

    async function fetchPainting(paintingId) {
        const fetchedPainting = await paintingApi.getPainting(paintingId);
        setViewPainting(fetchedPainting.painting)
        setUploader(fetchedPainting.uploader)
        // console.log(fetchedPainting)
    }

    async function handleLike() {
        try {
            const response = await userApi.likePicture(painting_id, token)
            if (response) {
                setIsLiked(response.like)
                setLikeCount(response.favorites_count)
            }
        } catch (error) {
            console.error('Error to like!', error)
            const errorMessage = error.response ? error.response.data : 'Something went wrong';
            Swal.fire({
                title: 'Failed to like',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Done'
            })
        }
    }

    const token = Cookies.get('token');
    async function handleSave(collectionName) {
        try {
            const response = await userApi.saveToCollection(collectionName, painting_id, token)

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

    async function handleShare() {
        try {
            const link = navigator.clipboard.writeText(window.location.origin + '/gallery/' + painting_id)

            if (link) {
                Swal.fire({
                    title: 'Copy successfully',
                    text: 'Copy link done',
                    icon: 'success',
                    confirmButtonText: 'Done'
                })
            }
        } catch (error) {
            console.error('Error to share!', error)
            const errorMessage = error.response ? error.response.data : 'Something went wrong';
            Swal.fire({
                title: 'Failed to share',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Done'
            })
        }
    }

    async function handleDeletePainting() {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently remove the painting from your uploads, favorites, and collections!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await paintingApi.deletePainting(painting_id, token);

            await Swal.fire({
                title: 'Deleted',
                text: response.message || 'Painting has been deleted.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            navigate(-1);

        } catch (error) {
            console.error('Failed to delete painting:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to delete painting.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    useEffect(() => {
        setIsLiked(userData?.favorites?.includes(painting_id));
        setLikeCount(viewPainting?.favorites_count);
    }, [userData?.favorites, viewPainting?.favorites_count, painting_id]);

    useEffect(() => {
        fetchPainting(painting_id);

        async function loadUserProfile() {
            const token = Cookies.get('token');
            if (!token || userData) return;
            try {
                const response = await userApi.fetchUser(token);
                if (response) {
                    setUserData(response);
                    // console.log(isOwner)
                }
            } catch (err) {
                console.error("Failed to load initial user profile:", err.message);
            }
        }
        loadUserProfile();
    }, [painting_id]);

    useEffect(() => {
        async function syncCollections() {
            const token = Cookies.get('token');
            if (!token) return;

            try {
                const response = await userApi.fetchUser(token);

                if (response && Array.isArray(response.collections)) {
                    setUserData(prev => ({
                        ...prev,
                        ...response,
                        collections: response.collections
                    }));
                }
            } catch (error) {
                console.error("Failed to sync collections:", error.message);
            }
        }

        if (isCollectionModalOpen) {
            syncCollections();
        }

    }, [isCollectionModalOpen]);

    isOwner = Boolean(
        (userData?.userData?._id && uploader?._id && String(userData?.userData?._id) === String(uploader?._id)) ||
        userData?.userData?.role === "admin"
    );

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
                        <div className={`painting-info-favorite-btn ${isLiked ? 'liked' : ''}`} style={{ display: "block" }}>
                            <button onClick={() => handleLike()}>
                                {isLiked ? <i className="bi bi-heart-fill"></i> : <i className="bi bi-heart"></i>}
                                <p>{likeCount}</p>
                            </button>
                        </div>

                        <div className="painting-info-collection-save-btn">
                            <button onClick={() => setIsCollectionModalOpen(true)}>
                                <i className="bi bi-collection"></i>
                            </button>
                        </div>

                        <div className="painting-info-share-btn">
                            <button onClick={handleShare} title="Share Link">
                                <i className="bi bi-share"></i>
                            </button>
                        </div>

                        {isOwner ? (
                            <div className="painting-info-delete-btn">
                                <button onClick={() => handleDeletePainting()}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        ) : null}
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
                        src={`${viewPainting?.image_url}`}
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
                    {viewPainting?.tags?.length > 0 && <div className="painting-tags-container">
                        <p>Tags</p>

                        <div className="painting-tags-scrollbox">
                            {viewPainting?.tags?.map((tag, index) => (
                                <span key={index} className="painting-tag">{tag}</span>
                            ))}
                        </div>
                    </div>}
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
                        <img src={`${viewPainting?.image_url}`} alt={viewPainting?.title} />
                        <p className="lightbox-caption">{viewPainting?.title || "Untitled Masterpiece"}</p>
                    </div>
                </div>
            )}
        </div>
    )
}