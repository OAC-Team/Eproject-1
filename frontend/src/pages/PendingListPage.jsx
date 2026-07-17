import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";
import adminApi from "../api/adminApi";
import '../themes/PendingList.css';

export default function PendingListPage() {
    const [pendingList, setPendingList] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token')

        if (!token) { return navigate('/') }

        async function fetchPendingPainting() {
            const response = await adminApi.getPendingPaintings(token);
            setPendingList(response)
        }

        fetchPendingPainting()
    }, [])

    async function handleApprove(painting_id) {
        const token = Cookies.get('token')
        const response = await adminApi.handleStatusPainting(painting_id, 'approved', token)
        setPendingList(prev => prev.filter(p => p._id !== painting_id))
    }

    async function handleReject(painting_id) {
        const token = Cookies.get('token')
        const response = await adminApi.handleStatusPainting(painting_id, 'rejected', token)
        setPendingList(prev => prev.filter(p => p._id !== painting_id))
    }

    return (
        <div className="pending-list-container">
            <h2>
                <i className="bi bi-images"></i>
                Image Pending Approval ({pendingList.length})
            </h2>
            {pendingList.length === 0 ? (
                <div className="empty-message"><i className="bi bi-balloon"></i> There are no images awaiting approval!</div>
            ) : (
                <div className="painting-grid">
                    {pendingList.map(painting => (
                        <div key={painting._id} className="painting-card">
                            <div className="painting-image-wrapper">
                                <img src={painting.image_url} alt={painting.title} className="painting-image" />
                            </div>
                            <div className="painting-info">
                                <h3 className="painting-title">{painting.title}</h3>
                                <p className="painting-artist">Artist: {painting.artist}</p>
                                {painting.description && <p className="painting-desc">{painting.description}</p>}
                            </div>
                            <div className="painting-actions">
                                <button
                                    className="btn-approve"
                                    onClick={() => handleApprove(painting._id)}>
                                    <i className="bi bi-check-circle"></i> Approve
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => handleReject(painting._id)}>
                                    <i className="bi bi-x-circle"></i> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}