import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminApi from '../api/adminApi';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import '../themes/ViewUser.css';

export default function ViewUser() {
    const navigate = useNavigate();
    const { user_id } = useParams();
    const [userData, setUserData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState({ allCollectionCount: 0, allPaintingCount: 0, allUploadedPainting: 0 });
    const [reason, setReason] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('deactive');
    const [log, setLog] = useState([]);
    const [userLogs, setUserLogs] = useState([]);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [adminVerifyPassword, setAdminVerifyPassword] = useState('');
    const [adminName, setAdminName] = useState('');
    const [resetReason, setResetReason] = useState('')

    async function fetchUserProfile(id) {
        try {
            const token = Cookies.get('token');
            const user = await adminApi.getUser(id, token);
            setUserData(user);

            const allCollectionData = user.collections || [];
            const allUploadedData = user.uploaded_paintings || [];
            const allPaintingData = allCollectionData.reduce(
                (sum, col) => sum + (col.paintings ? col.paintings.length : 0), 0
            );

            setStats({
                allCollectionCount: allCollectionData.length,
                allPaintingCount: allPaintingData,
                allUploadedPainting: allUploadedData.length
            });
        } catch (error) {
            console.error('Failed to fetch user:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to fetch user.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    const fetchAdminLog = useCallback(async () => {
        if (!user_id) return;
        const token = Cookies.get('token');
        if (!token) { return navigate('/'); }

        try {
            const response = await adminApi.getAdminLog(user_id, token);
            setLog(response.log || []);
        } catch (error) {
            console.error('Failed to fetch admin log:', error);
        }
    }, [user_id, navigate]);

    const fetchUserLog = useCallback(async () => {
        if (!user_id) return;
        const token = Cookies.get('token');
        if (!token) { return navigate('/'); }

        try {
            const response = await adminApi.getUserLog(user_id, token);
            setUserLogs(response.logs || []);
        } catch (error) {
            console.error('Failed to fetch user log:', error);
        }
    }, [user_id, navigate])

    async function handleSubmitStatus() {
        if (!reason) {
            Swal.fire({
                title: 'Required!',
                text: 'Please select a reason!',
                icon: 'warning',
                confirmButtonColor: '#38bdf8'
            });
            return;
        }

        if (!name.trim() || !password) {
            Swal.fire({
                title: 'Required!',
                text: 'Please enter both admin name and password.',
                icon: 'warning',
                confirmButtonColor: '#38bdf8'
            });
            return;
        }

        try {
            const token = Cookies.get('token');
            await adminApi.verifyAdminPassword(password, token);

            const nextStatus = userData.active === 'active' ? 'deactive' : 'active';
            const response = await adminApi.updateUserStatus(user_id, nextStatus, reason, name, token);

            setUserData(prev => ({ ...prev, active: nextStatus }));
            handleCancelStatus();

            await fetchAdminLog();

            Swal.fire({
                title: 'Success!',
                text: response.message || `User status updated to ${nextStatus}.`,
                icon: 'success',
                confirmButtonColor: '#38bdf8'
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Authentication Failed!',
                text: error.response?.data?.message || 'Incorrect password or authentication error.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    }

    function handleCancelStatus() {
        setIsOpen(false);
        setPassword('');
        setName('');
        setReason('');
    }

    useEffect(() => {
        if (user_id) {
            fetchUserProfile(user_id);
            fetchAdminLog();
            fetchUserLog()
        }
    }, [user_id, fetchAdminLog, fetchUserLog]);

    if (!userData) {
        return (
            <div className="view-user-wrapper">
                <p style={{ color: '#94a3b8', padding: '20px' }}>Loading user profile...</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "---";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "---";

        return date
            .toLocaleString('en-GB-u-hc-h23', {
                timeZone: 'Asia/Ho_Chi_Minh',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
            .replace(',', '');
    };

    const isCurrentActive = userData.active === 'active';

    async function handleSubmitReset() {
        if (!resetReason) {
            Swal.fire({
                title: 'Required!',
                text: 'Please select a reason!',
                icon: 'warning',
                confirmButtonColor: '#38bdf8'
            });
            return;
        }

        if (!adminName.trim() || !adminVerifyPassword) {
            Swal.fire({
                title: 'Required!',
                text: 'Please enter both admin name and password.',
                icon: 'warning',
                confirmButtonColor: '#38bdf8'
            });
            return;
        }

        if (newPassword.length < 8) {
            Swal.fire({
                title: 'Required!',
                text: 'Password must be at least 8 characters',
                icon: 'warning',
                confirmButtonColor: '#38bdf8'
            });
            return;
        }

        try {
            const token = Cookies.get('token');
            await adminApi.verifyAdminPassword(adminVerifyPassword, token);

            const response = await adminApi.resetUserPassword(user_id, newPassword, resetReason, adminName, token)
            handleCancelReset();

            await fetchAdminLog();

            Swal.fire({
                title: 'Success!',
                text: response.message || `Reset ${userData.username}'s password successfully!`,
                icon: 'success',
                confirmButtonColor: '#38bdf8'
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Authentication Failed!',
                text: error.response?.data?.message || 'Incorrect password or authentication error.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }
    }

    async function handleCancelReset() {
        setIsResetOpen(false);
        setAdminVerifyPassword('');
        setAdminName('');
        setResetReason('');
        setNewPassword('');
    }

    return (
        <div className="view-user-wrapper">
            {/* Breadcrumb */}
            <div className="breadcrumb-nav">
                <button onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
            </div>

            <div className="profile-layout-grid">
                {/* CỘT TRÁI */}
                <div className="layout-left-column">
                    <div className="profile-card-main">
                        <div className="avatar-container-relative">
                            <img
                                className="profile-avatar-large"
                                src={userData.profile_picture}
                                alt={userData.username}
                            />
                            <span className={`status-dot-${isCurrentActive ? 'active' : 'deactive'}`}></span>
                        </div>
                        <h2 className="profile-display-name">{userData.username}</h2>

                        <div className="profile-details-list">
                            <div className="detail-item">
                                <span className="item-label"><i className="bi bi-person"></i> Username:</span>
                                <span className="item-value">{userData.username}</span>
                            </div>
                            <div className="detail-item">
                                <span className="item-label"><i className="bi bi-envelope"></i> Email:</span>
                                <span className="item-value email-text">{userData.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="item-label"><i className="bi bi-shield-lock"></i> Role:</span>
                                <span className="item-value">{userData.role}</span>
                            </div>
                            <div className="detail-item">
                                <span className="item-label"><i className="bi bi-calendar-event"></i> Date Joined:</span>
                                <span className="item-value">{formatDate(userData.created_at)}</span>
                            </div>
                        </div>

                        {/* Nút Toggle Status */}
                        <div className="status-badge-wrapper" onClick={() => setIsOpen(true)}>
                            {isCurrentActive ? (
                                <span className="status-badge active">
                                    STATUS: ACTIVE <i className="bi bi-check-circle-fill"></i>
                                </span>
                            ) : (
                                <span className="status-badge deactive">
                                    STATUS: DEACTIVE <i className="bi bi-ban"></i>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="admin-actions-card">
                        <h3>Admin Actions</h3>
                        <div className="actions-button-group">
                            <button className="btn-action btn-outline-blue">Edit Profile</button>
                            <button
                                onClick={() => setIsResetOpen(true)}
                                className="btn-action btn-outline-yellow">
                                Reset Password
                            </button>
                            {/* <button className="btn-action btn-outline-orange">Comming soon</button> */}
                            <button className="btn-action btn-outline-red">Ban Account</button>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI */}
                <div className="layout-right-column">
                    <div className="sub-stats-grid">
                        <div className="mini-stat-card">
                            <div className="mini-card-text">
                                <span className="mini-title"><i className="bi bi-folder"></i> Total Collections</span>
                                <h2 className="mini-number">{stats.allCollectionCount}</h2>
                            </div>
                            <i className="bi bi-folder mini-watermark"></i>
                        </div>
                        <div className="mini-stat-card">
                            <div className="mini-card-text">
                                <span className="mini-title"><i className="bi bi-brush"></i> Total Artworks Uploaded</span>
                                <h2 className="mini-number">{stats.allUploadedPainting}</h2>
                            </div>
                            <i className="bi bi-brush mini-watermark"></i>
                        </div>
                        <div className="mini-stat-card">
                            <div className="mini-card-text">
                                <span className="mini-title"><i className="bi bi-image"></i> Total Paintings</span>
                                <h2 className="mini-number">{stats.allPaintingCount}</h2>
                            </div>
                            <i className="bi bi-image mini-watermark"></i>
                        </div>
                    </div>

                    <div className="table-tabs-container">
                        <div className="tabs-header-row">
                            <button
                                className={`tab-nav-item ${activeTab === 'deactive' ? 'active' : ''}`}
                                onClick={() => setActiveTab('deactive')}
                            >
                                DEACTIVE LOG <i className="bi bi-info-circle"></i>
                            </button>

                            <button
                                className={`tab-nav-item ${activeTab === 'violent' ? 'active' : ''}`}
                                onClick={() => setActiveTab('violent')}
                            >
                                VIOLENT
                            </button>

                            <button
                                className={`tab-nav-item ${activeTab === 'account' ? 'active' : ''}`}
                                onClick={() => setActiveTab('account')}
                            >
                                ACCOUNT LOGS
                            </button>
                        </div>

                        <div className="tab-content-placeholder">
                            {activeTab === 'deactive' && (
                                <div className="log-table-wrapper">
                                    <table className="log-table">
                                        <thead>
                                            <tr>
                                                <th>Admin Name</th>
                                                <th>Action</th>
                                                <th>Reason</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {log.length > 0 ? (
                                                log.map((l) => (
                                                    <tr key={l._id}>
                                                        <td>{l.adminName}</td>
                                                        <td>
                                                            <span className={`log-action-badge ${l.action}`}>
                                                                {l.action}
                                                            </span>
                                                        </td>
                                                        <td>{l.reason}</td>
                                                        <td className="log-time">{formatDate(l.createdAt || l.created_at)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="log-empty">
                                                        No logs found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'violent' && (
                                <div className="placeholder-text">No violent.</div>
                            )}

                            {activeTab === 'account' && (
                                <div className="log-table-wrapper">
                                    <table className="log-table">
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Action</th>
                                                <th>Description</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userLogs.length > 0 ? (
                                                userLogs.map((l) => (
                                                    <tr key={l._id}>
                                                        <td>
                                                            <span className={`log-category-badge ${(l.category || '').toLowerCase()}`}>
                                                                {l.category}
                                                            </span>
                                                        </td>
                                                        <td>{l.action}</td>
                                                        <td>{l.description}</td>
                                                        <td className="log-time">{formatDate(l.createdAt || l.created_at)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="log-empty">
                                                        No logs found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL POPUP */}
            {isResetOpen && (
                <div className="modal-overlay" onClick={handleCancelReset}>
                    <div className="status-upadate" onClick={(e) => e.stopPropagation()}>
                        <h3>Reset User Password</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>New Password</th>
                                    <td>
                                        <input
                                            type="password"
                                            placeholder="Enter new password (min 8 characters)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Reason for Reset</th>
                                    <td>
                                        <select value={resetReason} onChange={(e) => setResetReason(e.target.value)}>
                                            <option value="">-- Select a Reason --</option>
                                            <option value="User requested reset">User requested reset</option>
                                            <option value="Security compromise suspected">Security compromise suspected</option>
                                            <option value="Policy violation recovery">Policy violation recovery</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Admin Name</th>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter your admin name"
                                            value={adminName}
                                            onChange={(e) => setAdminName(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Verify Admin Password</th>
                                    <td>
                                        <input
                                            type="password"
                                            placeholder="Enter admin password to confirm"
                                            value={adminVerifyPassword}
                                            onChange={(e) => setAdminVerifyPassword(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="status-buttons">
                            <button className="btn-reset" onClick={handleSubmitReset}>
                                Reset Password
                            </button>
                            <button className="btn-cancel-status" onClick={handleCancelReset}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="modal-overlay" onClick={handleCancelStatus}>
                    <div className="status-upadate" onClick={(e) => e.stopPropagation()}>
                        <h3>{isCurrentActive ? 'Deactivate User Account' : 'Activate User Account'}</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Reason:</th>
                                    <td>
                                        <select
                                            className="reason-deactive"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        >
                                            <option value="" disabled>Choose the reason</option>
                                            {isCurrentActive ? (
                                                <>
                                                    <option value="policy-violation">Violation of OAC policies and terms</option>
                                                    <option value="security-fraud">Security and fraud issues</option>
                                                    <option value="community-report">Community reports</option>
                                                    <option value="law-enforcement">Requests from law enforcement agencies</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="system-error">System error / System confusion</option>
                                                    <option value="Verification">Verification successful</option>
                                                    <option value="regain-control">Regain control after it has been seized</option>
                                                    <option value="rectify-violation">Rectify the violation</option>
                                                    <option value="update-info">Update information</option>
                                                </>
                                            )}
                                        </select>
                                    </td>
                                </tr>

                                <tr>
                                    <th>Admin name:</th>
                                    <td>
                                        <input
                                            type="text"
                                            className="adminName"
                                            placeholder="Enter name of admin"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <th>Password:</th>
                                    <td>
                                        <input
                                            type="password"
                                            className="adminPw"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan="2" style={{ textAlign: 'center', paddingTop: '14px' }}>
                                        <button
                                            type="button"
                                            className={isCurrentActive ? "btn-confirm-deactive" : "btn-confirm-active"}
                                            onClick={handleSubmitStatus}
                                        >
                                            {isCurrentActive ? 'Deactive' : 'Active'}
                                        </button>
                                        <button type="button" className="btn-cancel-status" onClick={handleCancelStatus}>
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}