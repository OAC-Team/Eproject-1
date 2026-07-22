import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import userApi from "../api/userApi"

export default function Collections({ collectionData, onCollectionAdded }) {
    const BASE_URL = 'http://localhost:5000'
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [collections, setCollections] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleWheelScroll = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                container.scrollLeft += e.deltaY * 1.2;
            }
        };

        container.addEventListener('wheel', handleWheelScroll, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheelScroll);
        };
    }, [collections]);

    useEffect(() => {
        if (collectionData) {
            (() => {
                setCollections(collectionData);
            })()
        }
    }, [collectionData])

    async function handleSaveCollection() {
        const trimmedName = newCollectionName.trim();
        if (!trimmedName) return;

        const newCollectionPayload = { name: trimmedName, paintings: [] };
        const token = Cookies.get('token');

        try {
            const result = await userApi.addUserCollection(token, newCollectionPayload);

            if (result) {
                const addedCollection = result.userCollection ||
                    (Array.isArray(result.collections) ? result.collections[result.collections.length - 1] : null);

                if (addedCollection) {
                    setCollections(prev => [...prev, addedCollection]);
                } else {
                    setCollections(prev => [...prev, { ...newCollectionPayload, _id: Date.now().toString() }]);
                }

                if (typeof onCollectionAdded === 'function') {
                    onCollectionAdded();
                }

                // console.log("Successfully saved new collection.");
            }
        } catch (error) {
            console.error("Database save failed: ", error.message);
        }

        setNewCollectionName('');
        setIsAdding(false);
    }

    return (
        <div className="collections-wrapper">
            <div className="collections-header-row">
                <h2>Collections</h2>
                {!isAdding && (
                    <button className="btn-add-collection-styled" onClick={() => setIsAdding(true)}>
                        + Add New Collection
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="add-collection-inline-form">
                    <input
                        type="text"
                        placeholder="Enter collection name..."
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                    />
                    <div className="form-action-buttons">
                        <button className="btn-save-action" onClick={handleSaveCollection}>Save</button>
                        <button className="btn-cancel-action" onClick={() => setIsAdding(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="collections-bar">
                {collections.length === 0 ? (
                    <p>No collections created yet.</p>
                ) : (
                    <div ref={scrollContainerRef} className="collections-horizontal-scroll">
                        {collections.map((collection, index) => (
                            <div className="collection-display-card" onClick={() => navigate(`/collections/${collection._id}`)} key={collection._id}>
                                <div className="collection-folder-preview">
                                    {collection?.paintings && collection.paintings.length > 0 ? (
                                        <div className="collection-preview-grid">
                                            {collection.paintings.slice(0, 4).map((painting, idx) => (
                                                <img
                                                    key={painting._id || idx}
                                                    src={painting.image_url}
                                                    alt="Preview"
                                                    className="grid-preview-thumb"
                                                />
                                            ))}
                                            {collection.paintings.length < 4 &&
                                                Array.from({ length: 4 - collection.paintings.length }).map((_, idx) => (
                                                    <div key={`empty-${idx}`} className="grid-preview-thumb-empty" />
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <div className="collection-empty-grid-fallback">
                                            <span className="folder-icon">No images</span>
                                        </div>
                                    )}
                                </div>

                                <div className="collection-card-meta">
                                    <h4>{collection?.name || "Untitled"}</h4>
                                    <span>{collection?.paintings?.length || 0} items</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}