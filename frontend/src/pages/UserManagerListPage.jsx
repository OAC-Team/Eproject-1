import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";
import adminApi from "../api/adminApi";
import '../themes/UserManagerListPage.css';
import Swal from 'sweetalert2';

export default function UserManagerListPage() {
    const [userManagerList, setUserManagerList] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token')

        if (!token) { return navigate('/') }

        async function fetchUser() {
            const response = await adminApi.getAllUser(token);
            if (response && Array.isArray(response)) {
                setUserManagerList(response)
            } else if (response && response.users && Array.isArray(response.users)) {
                setUserManagerList(response.users)
            } else {
                setUserManagerList([])
            }
        }

        fetchUser()
    }, [])

    function handleViewUser(user_id) {
        // console.log(`Navigating to ${user_id}`)
        navigate(`/viewUserProfile/${user_id}`)
    }

    const formatDate = (dateString) => {
        if (!dateString) return "---";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // return type DD/MM/YYYY
    }

    return (
        <div className="user-manager-container">
            <h2 className="user-manager-title">
                <i className="bi bi-people"></i>
                User Manager ({userManagerList.length})
            </h2>

            {userManagerList.length === 0 ? (
                <div className="empty-message">
                    <i className="bi bi-exclamation-circle"></i> There are no users here!
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="user-manager-table">
                        <thead>
                            <tr>
                                <th align="left">USER</th>
                                <th align="left">EMAIL</th>
                                <th align="left">ROLE</th>
                                <th style={{ textAlign: 'center' }}>CREATE TIME</th>
                                <th style={{ textAlign: 'center' }}>STATUS</th>
                                <th style={{ textAlign: 'center' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userManagerList.map(user => (
                                <tr key={user._id}>
                                    {/* Cột 1: Avatar + Username */}
                                    <td className="col-user">
                                        <div className="user-info-flex">
                                            <img
                                                src={user.profile_picture || 'https://via.placeholder.com/150'}
                                                alt={user.username}
                                                className="user-avatar-circle"
                                            />
                                            <span className="user-name-text">{user.username}</span>
                                        </div>
                                    </td>

                                    {/* Cột 2: Email */}
                                    <td className="col-email">{user.email || 'none@gmail.com'}</td>

                                    {/* Cột 3: Role Badge */}
                                    <td className="col-role">
                                        <span className={`role-badge ${user.role?.toLowerCase() || 'user'}`}>
                                            {user.role || 'User'}
                                        </span>
                                    </td>

                                    {/* Cột 4: Time Create */}
                                    <td className="col-date" style={{ textAlign: 'center' }}>
                                        {formatDate(user.createdAt || user.created_at)}
                                    </td>

                                    {/* Col 5: Status */}
                                    <td className="col-status" style={{ textAlign: 'center' }}>
                                        <span className={`status ${user.active?.toLowerCase() || 'active'}`}>
                                            {user.active || 'Unknown'}
                                        </span>
                                    </td>

                                    {/* Cột 6: Action */}
                                    <td className="col-actions" style={{ textAlign: 'center' }}>
                                        <button
                                            className="action-btn btn-view-icon"
                                            onClick={() => handleViewUser(user._id)}
                                            title="View Profile"
                                        >
                                            <i className="bi bi-person-rolodex"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div >
            )
            }
        </div >
    );
}