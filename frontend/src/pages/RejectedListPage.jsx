import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";
import adminApi from "../api/adminApi";
import '../themes/PendingList.css';
import Swal from 'sweetalert2';

export default function RejectedListPage() {
    const [rejectList, setRejectedList] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token')

        if (!token) { return navigate('/') }

        async function fetchRejectedPainting() {
            const response = await adminApi.getRejectPaintings(token);
            setRejectedList(response)
        }

        fetchRejectedPainting()
    }, [])

    async function handleDeletePainting(painting_id) {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently remove the painting from Database and Cloudinary!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete'
        });

        if (!result.isConfirmed) return;

        try {

            const token = Cookies.get('token')
            const response = await adminApi.deletePaintings(painting_id, token);

            await Swal.fire({
                title: 'Deleted!',
                text: response.message || 'Painting has been deleted.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            navigate(0);

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

    function handleViewPainting(painting_id) {
        console.log(`Navigating to ${painting_id}`)
        navigate(`/gallery/${painting_id}`)
    }

    return (
        <div className="pending-list-container">
            <h2>
                <i className="bi bi-images"></i>
                Image Has Been Rejected ({rejectList.length})
            </h2>
            {rejectList.length === 0 ? (
                <div className="empty-message"><i className="bi bi-balloon"></i> There are no images awaiting approval!</div>
            ) : (
                <div className="painting-grid">
                    {rejectList.map(painting => (
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
                                    className="btn-open"
                                    onClick={() => handleViewPainting(painting._id)}>
                                    <i className="bi bi-folder2-open"></i> View
                                </button>
                                <button
                                    className="btn-reject"
                                    onClick={() => handleDeletePainting(painting._id)}>
                                    <i className="bi bi-x-circle"></i> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}