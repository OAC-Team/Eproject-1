import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import userApi from '../api/userApi'
import PendingListPage from './PendingListPage'
import '../themes/AdminDashboard.css'
import adminApi from '../api/adminApi'
import LogOut from '../components/LogOut'
import RejectedListPage from './RejectedListPage'
import ApproveListPage from './ApproveListPage'
import UserManagerListPage from './UserManagerListPage'

export default function AdminDashboardPage({ setUser }) {
    const [adminData, setAdminData] = useState({});
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [stats, setStats] = useState({ pendingCount: 0, approveCount: 0, rejectCount:0, allCount: 0, userCount: 0 })
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const hoverDown = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const token = Cookies.get('token');

        (async () => {
            const responseData = await userApi.fetchUser(token);
            if (responseData && responseData.userData) {
                setAdminData(responseData.userData)
            } else {
                return;
            }
        })();

        // update overview data
        (async () => {
            try {
                const pendingData = await adminApi.getPendingPaintings(token);
                const approveData = await adminApi.getApprovePaintings(token);
                const rejectData = await adminApi.getRejectPaintings(token);
                const allData = await adminApi.getAllPaintings(token);

                const userData = await adminApi.getAllUser(token)
                setStats({
                    pendingCount: pendingData ? pendingData.length : 0,
                    approveCount: approveData ? approveData.length : 0,
                    rejectCount: rejectData ? rejectData.length : 0,
                    allCount: allData && allData.paintings ? allData.paintings.length : 0,

                    userCount:  userData && userData.users ? userData.users.length : 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        })();
    }, [activeTab])

    return (
        <div className="admin-dashboard-container">
            {/* sidebar */}
            <aside className={`admin-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
                <div className="sidebar-logo">
                    <img src="/Logo(black).png" alt="OAC Logo" className="logo-icon" style={{ padding: '0', background: 'transparent' }} />
                    {isSidebarOpen && (
                        <div className="logo-text">
                            <h2>Only Art Collection</h2>
                            <span>Admin Dashboard</span>
                        </div>
                    )}
                </div>
                <hr className="sidebar-divider" />
                <nav className="sidebar-nav">
                    <button
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                        title="Overview">
                        <span className="nav-icon"><i className="bi bi-house-door"></i></span> {isSidebarOpen && "Overview"}
                    </button>
                    <button
                        className={activeTab === 'pending' ? 'active' : ''}
                        onClick={() => setActiveTab('pending')}
                        title="Painting Manager">
                        <span className="nav-icon"><i className="bi bi-images"></i></span> {isSidebarOpen && "Painting Manager"}
                    </button>
                    <button
                        className={activeTab === 'approve' ? 'active' : ''}
                        onClick={() => setActiveTab('approve')}
                        title="Approved Painting Manager">
                        <span className="nav-icon"><i className="bi bi-check-circle"></i></span> {isSidebarOpen && "Approve Painting Manager"}
                    </button>
                    <button
                        className={activeTab === 'reject' ? 'active' : ''}
                        onClick={() => setActiveTab('reject')}
                        title="Rejected Painting Manager">
                        <span className="nav-icon"><i className="bi bi-x-circle"></i></span> {isSidebarOpen && "Rejected Painting Manager"}
                    </button>
                    <button
                        className={activeTab === 'userManager' ? 'active' : ''}
                        onClick={() => setActiveTab('userManager')}
                        title="User Manager">
                        <span className="nav-icon"><i className="bi bi-people"></i></span> {isSidebarOpen && "User Manager"}
                    </button>
                </nav>
            </aside>
            {/* main */}
            <div className="admin-main-wrapper">
                <header className="admin-top-header">
                    <div className="header-left">
                        <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <i className="bi bi-list"></i>
                        </button>
                    </div>
                    <div className="admin-profile-widget">
                        <div className="profile-info">
                            <span className="admin-name">{adminData?.username || 'Admin Name'}</span>
                            <span className="admin-greeting">Hi Admin</span>
                        </div>
                        <div className="admin-avatar-dropdown-root">
                            <div className="admin-avatar-wrapper">
                                <img src={adminData?.profile_picture} alt="avatar" />
                                <span className="online-dot"></span>
                            </div>
                            <div className="admin-avatar-dropdown">
                                <button className="dropdown-item-btn">
                                    <i className="bi bi-gear"></i> Settings
                                </button>
                                <hr className="dropdown-divider" />
                                <div className="dropdown-item-btn logout">
                                    <i className="bi bi-box-arrow-right"></i>
                                    <LogOut setUser={setUser} />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="admin-main-content">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <h1 className="tab-title">OVERVIEW</h1>
                            <div className="stats-grid">
                                {/* Card 1: Pending List */}
                                <div className="stat-card-pending">
                                    <div className="card-header">
                                        <div className="icon-box-pending"><i className="bi bi-hourglass-split"></i></div>
                                        <span>Pending List</span>
                                    </div>
                                    <div className="card-body">
                                        <h2>{stats.pendingCount}</h2>
                                        <p>Paintings pending processing</p>
                                    </div>
                                    <div className="card-watermark-pending"><i className="bi bi-hourglass-split"></i></div>
                                </div>
                                {/* Card 2: Approve List */}
                                <div className="stat-card-approve">
                                    <div className="card-header">
                                        <div className="icon-box-approve"><i className="bi bi-check-circle"></i></div>
                                        <span>Approved List</span>
                                    </div>
                                    <div className="card-body">
                                        <h2>{stats.approveCount}</h2>
                                        <p>Paintings was approved</p>
                                    </div>
                                    <div className="card-watermark-approve"><i className="bi bi-check-circle"></i></div>
                                </div>
                                {/* Card 3: Reject List */}
                                <div className="stat-card-reject">
                                    <div className="card-header">
                                        <div className="icon-box-reject"><i className="bi bi-x-circle"></i></div>
                                        <span>Rejected List</span>
                                    </div>
                                    <div className="card-body">
                                        <h2>{stats.rejectCount}</h2>
                                        <p>Paintings was rejected</p>
                                    </div>
                                    <div className="card-watermark-reject"><i className="bi bi-x-circle"></i></div>
                                </div>
                                {/* Card 4: All Painting */}
                                <div className="stat-card-all">
                                    <div className="card-header">
                                        <div className="icon-box-all"><i className="bi bi-images"></i></div>
                                        <span>All Painting</span>
                                    </div>
                                    <div className="card-body">
                                        <h2>{stats.allCount}</h2>
                                        <p>Total Painting</p>
                                    </div>
                                    <div className="card-watermark-all"><i className="bi bi-images"></i></div>
                                </div>
                                {/* Card 5: User Manager */}
                                <div className="stat-card-usermanager">
                                    <div className="card-header">
                                        <div className="icon-box-usermanager"><i className="bi bi-person-lines-fill"></i></div>
                                        <span>Number of users</span>
                                    </div>
                                    <div className="card-body">
                                        <h2>{stats.userCount}</h2>
                                        <p>Total registered users</p>
                                    </div>
                                    <div className="card-watermark-usermanager"><i className="bi bi-person-lines-fill"></i></div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'pending' && <PendingListPage />}
                    {activeTab === 'reject' && <RejectedListPage />}
                    {activeTab === 'approve' && <ApproveListPage />}
                    {activeTab === 'userManager' && <UserManagerListPage/>}

                </main>
            </div>
        </div>
    )
}