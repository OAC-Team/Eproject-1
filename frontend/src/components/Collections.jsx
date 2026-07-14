import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import userApi from "../api/userApi"

export default function Collections({ collectionData }) {
    const BASE_URL = 'http://localhost:5000'
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const [collections, setCollections] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState('');

    useEffect(() => {
        if (collectionData) {
            (() => {
                setCollections(collectionData);
            })()
        }
    }, [collectionData])

    async function handleSaveCollection() {
        if (!newCollectionName.trim()) return;

        // console.log("Saving new collection: " + newCollectionName);

        const newCollectionPayload = { name: newCollectionName.trim(), paintings: [] };

        const updatedCollectionsList = [...collections, newCollectionPayload];
        setCollections(updatedCollectionsList);

        const token = Cookies.get('token');

        try {
            const result = await userApi.updateUser(token, { name: newCollectionName.trim() });

            if (result && result.collections) {
                setCollections(result.collections);
                console.log("Successfully saved new collections to database.");
            }
        } catch (error) {
            console.error("Database save failed: ", error.message);
        }

        console.log(collections)
        setNewCollectionName('');
        setIsAdding(false);
    }

    return (
        <div className="user-uploads-wrapper">
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

            <div className="user-uploads-img-bar">
                {collections.length === 0 ? (
                    <p>No collections created yet.</p>
                ) : (
                    <div className="collections-horizontal-scroll">
                        {collections.map((collection, index) => (
                            <div className="collection-display-card" onClick={() => navigate(`/collections/${collection._id}`)} key={collection._id}>
                                <div className="collection-folder-preview">
                                    {collection?.paintings && collection.paintings.length > 0 ? (
                                        <div className="collection-preview-grid">
                                            {collection.paintings.slice(0, 4).map((painting, idx) => (
                                                <img
                                                    key={painting._id || idx}
                                                    src={BASE_URL + painting.image_url}
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