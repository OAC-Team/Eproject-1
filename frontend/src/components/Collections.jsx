import { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import userApi from "../api/userApi"

export default function Collections({ collectionData }) {
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

        console.log("Saving new collection: " + newCollectionName);

        const newCollectionPayload = {name: newCollectionName.trim(), paintings: []};

        const updatedCollectionsList = [...collections, newCollectionPayload];
        setCollections(updatedCollectionsList);

        const token = Cookies.get('token');

        try {
            const result = await userApi.updateUser(token, {name: newCollectionName.trim()});

            if (result && result.collections) {
                setCollections(result.collections);
            }
            
            console.log("Successfully saved new collections to database.");
        } catch (error) {
            console.error("Database save failed: ", error.message);
        }

        console.log(collections)
        setNewCollectionName('');
        setIsAdding(false);
    }

    return (
        <div>
            <h3>Collections</h3>
            {!isAdding ? (<button onClick={() => setIsAdding(true)}>Add New Collection</button>) : (
                <div>
                    <input
                        type="text"
                        placeholder="Enter collection name..."
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                    />
                    <button onClick={handleSaveCollection}>Save</button>
                    <button onClick={() => setIsAdding(false)}>
                        Cancel
                    </button>
                </div>
            )}
            {
                collections.map((collection, index) => (
                    <div
                        key={index}>
                        <h3>{collection?.name}</h3>
                        <p>{collection?.paintings?.length}</p>
                    </div>
                ))
            }
        </div>
    )
}