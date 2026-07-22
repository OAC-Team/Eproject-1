import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import userApi from '../api/userApi'
import PendingListPage from './PendingListPage'
import '../themes/AdminDashboard.css'
import adminApi from '../api/adminApi'
import LogOut from '../components/LogOut'
import RejectedListPage from './RejectedListPage'
import ApproveListPage from './ApproveListPage'
import UserManagerListPage from './UserManagerListPage'
import Swal from 'sweetalert2'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom'

export default function AdminDashboardPage({ setUser }) {
    const [adminData, setAdminData] = useState({});
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [stats, setStats] = useState({ pendingCount: 0, approveCount: 0, rejectCount:0, allCount: 0, userCount: 0 })
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [recentActivities, setRecentActivities] = useState([]);
    const navigate = useNavigate();

    // React State for dynamic chart data with beautiful defaults
    const [chartData, setChartData] = useState([
        { name: 'January', count: 10 },
        { name: 'February', count: 5 },
        { name: 'March', count: 5 },
        { name: 'April', count: 17 },
        { name: 'May', count: 7 },
        { name: 'June', count: 15 },
        { name: 'July', count: 8 },
        { name: 'August', count: 17 }
    ]);

    const [pieData, setPieData] = useState([
        { name: 'Abstract', value: 40 },
        { name: 'Impressionism', value: 25 },
        { name: 'Modern', value: 20 },
        { name: 'Surrealism', value: 15 }
    ]);
    const COLORS = ['#38bdf8', '#a855f7', '#f97316', '#22c55e'];

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
                const userData = await adminApi.getAllUser(token);

                const usersList = userData?.users || [];
                const paintingsList = allData?.paintings || [];

                setStats({
                    pendingCount: pendingData ? pendingData.length : 0,
                    approveCount: approveData ? approveData.length : 0,
                    rejectCount: rejectData ? rejectData.length : 0,
                    allCount: paintingsList.length,
                    userCount: usersList.length,
                });

                // 1. Calculate Monthly Registrations
                const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthlyCounts = {};
                
                // Initialize default values for the last 6 months to make chart look continuous
                const currentMonth = new Date().getMonth();
                for (let i = 5; i >= 0; i--) {
                    const mIndex = (currentMonth - i + 12) % 12;
                    monthlyCounts[monthsName[mIndex]] = 0;
                }

                usersList.forEach(user => {
                    const date = user.created_at || user.createdAt;
                    if (date) {
                        const mIndex = new Date(date).getMonth();
                        const mName = monthsName[mIndex];
                        if (monthlyCounts[mName] !== undefined) {
                            monthlyCounts[mName] += 1;
                        } else {
                            monthlyCounts[mName] = 1;
                        }
                    }
                });

                const formattedChartData = Object.keys(monthlyCounts).map(month => ({
                    name: month,
                    count: monthlyCounts[month]
                }));
                setChartData(formattedChartData);

                // 2. Calculate Popular Painting Artistic Styles (Pie Chart)
                const styleCounts = {};
                paintingsList.forEach(p => {
                    const style = p.artistic_style || 'Other';
                    styleCounts[style] = (styleCounts[style] || 0) + 1;
                });

                // Map and sort categories by popular count, limit to top 4 categories
                const formattedPieData = Object.keys(styleCounts)
                    .map(style => ({ name: style, value: styleCounts[style] }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 4);

                if (formattedPieData.length > 0) {
                    setPieData(formattedPieData);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        })();

        fetchActivities();
    }, [activeTab])

    const fetchActivities = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            const data = await adminApi.getAllUserLogs(token);
            setRecentActivities(data.logs || []);
        } catch (error) {
            console.error("Error fetching user logs:", error);
        }
    }, []);

    const handleDeleteLog = async (logId) => {
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this log deletion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmResult.isConfirmed) {
            try {
                const token = Cookies.get('token');
                await adminApi.deleteUserLog(logId, token);
                Swal.fire('Deleted!', 'Log has been removed.', 'success');
                fetchActivities();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete log.', 'error');
            }
        }
    };

    const timeAgo = (dateString) => {
        if (!dateString) return '---';
        const now = new Date();
        const past = new Date(dateString);
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;

        const elapsed = now - past;

        if (elapsed < msPerMinute) {
             return 'Just now';   
        } else if (elapsed < msPerHour) {
             return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        } else if (elapsed < msPerDay) {
             return Math.round(elapsed/msPerHour ) + ' hours ago';   
        } else {
             return Math.round(elapsed/msPerDay) + ' days ago';   
        }
    };

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
                                <button className="dropdown-item-btn" onClick={() => navigate('/profile/settings')}>
                                    <i className="bi bi-gear"></i> Settings
                                </button>
                                <hr className="dropdown-divider" />
                                <button className="dropdown-item-btn" onClick={() => navigate('/')}>
                                    <i className="bi bi-house"></i> Home
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

                             {/* CHARTS CONTAINER (Glow Wave Line Chart & Popular Categories Pie Chart) */}
                             <div className="admin-charts-row">
                                 <div className="chart-glow-wrapper">
                                     <div className="chart-header-row">
                                         <h3>Monthly Registrations</h3>
                                         <div className="chart-controls">
                                             <button className="chart-control-btn active"><i className="bi bi-graph-up-arrow"></i> Monthly Registrations</button>
                                         </div>
                                     </div>
                                     <div className="glow-chart-container" style={{ width: '100%', height: 260 }}>
                                         <ResponsiveContainer width="100%" height="100%">
                                             <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                 <defs>
                                                     <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                                                         <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25}/>
                                                         <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                                     </linearGradient>
                                                     <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
                                                         <feGaussianBlur stdDeviation="6" result="blur" />
                                                         <feMerge>
                                                             <feMergeNode in="blur" />
                                                             <feMergeNode in="SourceGraphic" />
                                                         </feMerge>
                                                     </filter>
                                                 </defs>
                                                 <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                                 <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                                 <Tooltip 
                                                     contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }} 
                                                     labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                                                 />
                                                 <Area 
                                                     type="monotone" 
                                                     dataKey="count" 
                                                     stroke="#38bdf8" 
                                                     strokeWidth={3} 
                                                     fillOpacity={1} 
                                                     fill="url(#glowColor)" 
                                                     filter="url(#waveGlow)"
                                                 />
                                             </AreaChart>
                                         </ResponsiveContainer>
                                     </div>
                                 </div>

                                 <div className="chart-pie-wrapper">
                                     <div className="chart-header-row">
                                         <h3>Popular Painting Categories</h3>
                                         <i className="bi bi-info-circle info-watermark-icon"></i>
                                     </div>
                                     <div className="pie-chart-container" style={{ width: '100%', height: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                         <ResponsiveContainer width="100%" height="100%">
                                             <PieChart>
                                                 <Pie
                                                     data={pieData}
                                                     cx="50%"
                                                     cy="50%"
                                                     innerRadius={60}
                                                     outerRadius={85}
                                                     paddingAngle={4}
                                                     dataKey="value"
                                                 >
                                                     {pieData.map((entry, index) => (
                                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                     ))}
                                                 </Pie>
                                                 <Tooltip
                                                     contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                                                 />
                                             </PieChart>
                                         </ResponsiveContainer>
                                     </div>
                                 </div>
                             </div>

                             {/* RECENT USER ACTIVITY TABLE */}
                             <div className="recent-activity-container">
                                 <div className="activity-header-row">
                                     <h3>Recent User Activity</h3>
                                     <i className="bi bi-info-circle info-watermark-icon"></i>
                                 </div>
                                 <div className="activity-table-wrapper">
                                     <table className="activity-table">
                                         <thead>
                                             <tr>
                                                 <th>User</th>
                                                 <th>Description</th>
                                                 <th>Time</th>
                                                 <th style={{ textAlign: 'center' }}>Actions</th>
                                             </tr>
                                         </thead>
                                         <tbody>
                                             {recentActivities.length > 0 ? (
                                                 recentActivities.map((act) => (
                                                     <tr key={act._id}>
                                                         <td>
                                                             <div className="activity-user-cell">
                                                                 <img 
                                                                     src={act.userId?.profile_picture || 'https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png'} 
                                                                     alt="avatar" 
                                                                     className="user-avatar-mini"
                                                                 />
                                                                 <span className="user-name-cell">{act.userId?.username || 'Guest User'}</span>
                                                             </div>
                                                         </td>
                                                         <td className="activity-desc-cell">{act.description}</td>
                                                         <td className="activity-time-cell">{timeAgo(act.createdAt)}</td>
                                                         <td className="activity-actions-cell" style={{ textAlign: 'center' }}>
                                                             <div className="action-buttons-wrapper">
                                                                 <button className="btn-time-history" title="Log Created At">
                                                                     <i className="bi bi-clock"></i>
                                                                 </button>
                                                                 <button onClick={() => handleDeleteLog(act._id)} className="btn-delete-history" title="Delete Log">
                                                                     <i className="bi bi-trash"></i>
                                                                 </button>
                                                             </div>
                                                         </td>
                                                     </tr>
                                                 ))
                                             ) : (
                                                 <tr>
                                                     <td colSpan="4" className="activity-empty-cell">
                                                         No recent user activity found.
                                                     </td>
                                                 </tr>
                                             )}
                                         </tbody>
                                     </table>
                                 </div>
                             </div>
                        </div>
                    )}
                    {activeTab === 'pending' && <PendingListPage />}
                    {activeTab === 'reject' && <RejectedListPage />}
                    {activeTab === 'approve' && <ApproveListPage />}
                    {activeTab === 'userManager' && <UserManagerListPage />}

                </main>
            </div>
        </div>
    )
}