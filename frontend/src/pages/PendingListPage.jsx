import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";
import adminApi from "../api/adminApi";
export default function AdminDashboard() {
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
        const response = await adminApi.handleStatusPainting(painting_id, 'approve', token)

        setPendingList(prev => prev.filter(p => p._id !== painting_id))

    }

    async function handleReject(painting_id) {
        const token = Cookies.get('token')
        const response = await adminApi.handleStatusPainting(painting_id, 'reject', token)

        setPendingList(prev => prev.filter(p => p._id !== painting_id))

    }

    return (
        <div>
            {pendingList.map(painting => (
                <div key={painting._id}>
                    <img src={painting.image_url} />
                    <p>{painting.title}</p>
                    <button
                        onClick={() => handleApprove(painting._id)}>
                        Approve</button>
                    <button
                        onClick={() => handleReject(painting._id)}>
                        Reject</button>
                </div>
            ))}
        </div>
    )
}