import { useState, useEffect } from "react";
import {createPortal} from 'react-dom';
import userApi from "../api/userApi";
import Swal from 'sweetalert2';
import { createPortal } from 'react-dom'

export default function InteractionBar({ painting_id, initialLikeCount, initialIsLiked, token, userCollections }) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [showSaveModal, setShowSaveModal] = useState(false);

    useEffect(() => {
        setIsLiked(initialIsLiked);
        setLikeCount(initialLikeCount);
    }, [initialIsLiked, initialLikeCount]);

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
        <div className="interaction-bar">
            <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                {isLiked ? <i className="bi bi-heart-fill"></i> : <i className="bi bi-heart"></i>}
                <span>{likeCount}</span>
            </button>

            <button className="share-btn" onClick={handleShare} title="Share Link">
                <i className="bi bi-share"></i>
            </button>

            <button className="save-btn" onClick={() => setShowSaveModal(true)} title="Save to Collection">
                <i className="bi bi-folder-plus"></i> Save
            </button>

            {showSaveModal && createPortal(
                <div className="save-modal-overlay">
                    <div className="save-modal-content">
                        <h4>Save to collection</h4>
                        <div className="collection-list">
                            {userCollections?.map((collection) => (
                                <div key={collection._id} className="collection-item">
                                    <span>{collection.name}</span>
                                    <button className="modal-save-btn" onClick={() => handleSave(collection.name)}>
                                        <i className="bi bi-bookmark-plus"></i> Save
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="modal-close-btn" onClick={() => setShowSaveModal(false)}>
                            Close
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}