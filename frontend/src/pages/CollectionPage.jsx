import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import userApi from "../api/userApi";
import paintingApi from "../api/paintingApi";
import Swal from 'sweetalert2';

export default function CollectionPage() {
    const BASE_URL = 'http://localhost:5000';
    const navigate = useNavigate();
    const location = useLocation();
    const { collection_id } = useParams();

    const [collection, setCollection] = useState(null);
    const [displayedPaintings, setDisplayedPaintings] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const token = Cookies.get('token');

    function handleViewPainting(painting_id) {
        navigate(`/gallery/${painting_id}`);
    }

    const queryParams = new URLSearchParams(location.search);
    const searchKeyword = queryParams.get('search') || "";

    async function handleSaveCollection(e) {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            await userApi.updateUserCollection(token, collection_id, {
                name: editName,
                description: editDescription
            });

            setCollection(prev => ({
                ...prev,
                name: editName,
                description: editDescription
            }));

            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update collection:", error);
            alert("Failed to save changes. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCollection = async () => {
        const result = await Swal.fire({
            title: 'Delete Collection',
            text: "Do you want to delete this collection? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        });

        if (!result) {
            return;
        }

        try {
            await userApi.deleteUserCollection(token, collection_id);
            Swal.fire({
                title: 'Success',
                text: "Collection deleted",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'rgb(51, 221, 150)',
                confirmButtonText: 'Delete'
            })
            
            navigate('/profile');
        } catch (error) {
            console.error("Failed to delete collection:", error);
            alert("Failed to delete collection. Try again!");
        }
    };

    useEffect(() => {
        const fetchAndFilterCollection = async () => {
            try {
                const data = await userApi.fetchUserCollection(token, collection_id);

                if (data && data.userCollection) {
                    setCollection(data.userCollection);
                    setEditName(data.userCollection.name || "");
                    setEditDescription(data.userCollection.description || "");

                    const fullPaintings = await Promise.all(
                        data.userCollection.paintings.map(async (p) => {
                            const res = await paintingApi.getPainting(p._id);
                            return res.painting || res;
                        })
                    );

                    const masterList = fullPaintings.filter(p => p !== null);

                    if (!searchKeyword.trim()) {
                        setDisplayedPaintings(masterList);
                    } else {
                        const lowerKeyword = searchKeyword.toLowerCase();
                        const filtered = masterList.filter(painting => {
                            const matchesTitle = painting.title?.toLowerCase().includes(lowerKeyword);
                            const matchesArtist = painting.artist?.toLowerCase().includes(lowerKeyword);
                            const matchesStyle = painting.artistic_style?.toLowerCase().includes(lowerKeyword);
                            const matchesTags = painting.tags?.some(tag =>
                                tag?.toLowerCase().includes(lowerKeyword)
                            ) || false;

                            return matchesTitle || matchesArtist || matchesStyle || matchesTags;
                        });

                        setDisplayedPaintings(filtered);
                    }
                }
            } catch (error) {
                console.error("Error during data retrieval:", error);
            }
        };

        if (token && collection_id) {
            fetchAndFilterCollection();
        }
    }, [collection_id, token, location.search]);

    return (
        <div className='collection-wrapper'>
            {collection ? (
                <div className="collection-info">
                    {isEditing ? (
                        <form className="collection-edit-form" onSubmit={handleSaveCollection}>
                            <div className="form-group">
                                <label>Collection Name:</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                    className="edit-collection-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="edit-collection-textarea"
                                    placeholder="Add a cool description for this collection..."
                                />
                            </div>
                            <div className="edit-actions">
                                <button type="submit" className="save-btn" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="collection-header">
                            <div className="collection-header-text">
                                <h3 className="collection-info-name">{collection.name}</h3>
                                {collection.description && (
                                    <p className="collection-info-desc">{collection.description}</p>
                                )}
                                <p className="collection-info-counts">
                                    {collection?.paintings?.length || 0} saved paintings
                                </p>
                            </div>

                            <div className="collection-header-actions">
                                <button className="edit-collection-btn" onClick={() => setIsEditing(true)}>
                                    Edit
                                </button>
                                <button className="delete-collection-btn" onClick={handleDeleteCollection}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}

                    <hr />

                    {/* GALLERY GRID */}
                    <div className="gallery-grid">
                        {displayedPaintings.map((painting) => (
                            <div key={painting._id} className="gallery-card">
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
                                                <img className="open-url-icon" src="/open_url.png" alt="Open" />
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
            ) : (
                <div className="collection-fail">
                    <h3 className="collection-fail-message">The collection is no longer available or failed to load.</h3>
                </div>
            )}
        </div>
    );
}