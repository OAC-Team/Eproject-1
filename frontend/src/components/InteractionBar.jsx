import { useState, useEffect } from "react";
import userApi from "../api/userApi";
import Swal from 'sweetalert2'

export default function InteractionBar({ painting_id, initialLikeCount, initialIsLiked, token, userCollections }) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [showSaveModal, setShowSaveModal] = useState(false);

    async function handleLike() {
        try {
            const response = await userApi.likePicture(painting_id, token)
            if (response) {
                setIsLiked(response.liked)
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

                setShowSaveModal(false)
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

    return (
        <div>
            <button onClick={handleLike}>
                {isLiked ? '❤️' : '🤍'} <span>{likeCount}</span>
            </button>
            <button onClick={handleShare}>
                🔗
            </button>
            <button onClick={() => setShowSaveModal(true)}>
                Save
            </button>
            {showSaveModal &&
                <div>
                    <div>
                        <h4>Save to collection</h4>
                        {userCollections?.map((collection) => (
                            <div key={collection._id}>
                                {collection.name}
                                <button onClick={() => handleSave(collection.name)}>Save</button>
                            </div>
                        ))}
                        <button onClick={() => setShowSaveModal(false)}>Close</button>
                    </div>
                </div>}
        </div>
    )
}