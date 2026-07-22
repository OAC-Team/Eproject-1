import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import userApi from '../api/userApi'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import LogOut from '../components/LogOut'

export default function NavBar() {
    const [userData, setUserData] = useState({})
    const [isOpen, setIsOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Filter States
    const [surface, setSurface] = useState('')
    const [medium, setMedium] = useState('')
    const [style, setStyle] = useState('')

    const navigate = useNavigate()
    const location = useLocation()
    const [searchQuery, setSearchQuery] = useState('')

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const toggleFilterModal = () => {
        setIsFilterOpen(!isFilterOpen)
    }

    useEffect(() => {
        const token = Cookies.get('token');

        (async () => {
            const responseData = await userApi.fetchUser(token);
            if (responseData && responseData.userData) {
                setUserData(responseData.userData);
            } else {
                setUserData({ username: 'Guest User', role: 'guest' });
            }
        })()
    }, [])

    const applySearchAndFilters = () => {
        const params = new URLSearchParams()

        if (searchQuery.trim()) params.append('search', searchQuery.trim())
        if (surface) params.append('surface', surface)
        if (medium) params.append('medium', medium)
        if (style) params.append('style', style)

        const basePath = location.pathname.includes('/collections/') ? location.pathname : '/'
        const queryString = params.toString() ? `?${params.toString()}` : ''

        navigate(`${basePath}${queryString}`)
        setIsFilterOpen(false)
    }

    function handleSearchKeyDown(e) {
        if (e.key === 'Enter') {
            applySearchAndFilters()
        }
    }

    const handleResetFilters = () => {
        setSurface('')
        setMedium('')
        setStyle('')
    }

    return (
        <div className="access-bar">
            <div className="search-filter-wrapper">
                {/* Search Input */}
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                />

                <div className="filter-root" style={{ position: 'relative' }}>
                    <div style={{ display: "flex" }}>
                        <button
                            className={`filter-toggle-btn ${isFilterOpen ? 'active' : ''}`}
                            onClick={toggleFilterModal}
                            type="button"
                        >
                            <i className="bi bi-filter" />
                        </button>
                        {
                            (surface || medium || style) &&
                            <span className="filter-details">
                                {`
                                    ${surface && surface + ((medium || style) && " |")} 
                                    ${medium && medium + (style && " |")} 
                                    ${style}
                                `}
                            </span>
                        }
                    </div>

                    {isFilterOpen && (
                        <div className="filter-dropdown-menu" style={{
                            position: 'absolute',
                            top: '110%',
                            left: '0',
                            backgroundColor: '#1a1d24',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            padding: '16px',
                            zIndex: 1000,
                            minWidth: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {/* Surface Type Select */}
                            <div className="filter-group">
                                <label style={{ fontSize: '12px', color: '#888' }}>Surface Type</label>
                                <select
                                    value={surface}
                                    onChange={(e) => setSurface(e.target.value)}
                                    style={{ width: '100%', padding: '6px', background: '#0f1115', color: '#fff', borderRadius: '4px' }}
                                >
                                    <option value="">All Surfaces</option>
                                    <option value="Canvas">Canvas</option>
                                    <option value="Paper">Paper</option>
                                    <option value="Wood">Wood</option>
                                    <option value="Digital">Digital</option>
                                    <option value="Glass">Glass</option>
                                    <option value="Fabric">Fabric</option>
                                    <option value="Metal">Metal</option>
                                    <option value="Ceramic">Ceramic</option>
                                    <option value="Stone">Stone</option>
                                    <option value="Wall">Wall</option>
                                    <option value="Leather">Leather</option>
                                </select>
                            </div>

                            {/* Color Medium Select */}
                            <div className="filter-group">
                                <label style={{ fontSize: '12px', color: '#888' }}>Color Medium</label>
                                <select
                                    value={medium}
                                    onChange={(e) => setMedium(e.target.value)}
                                    style={{ width: '100%', padding: '6px', background: '#0f1115', color: '#fff', borderRadius: '4px' }}
                                >
                                    <option value="">All Mediums</option>
                                    <option value="Oil">Oil</option>
                                    <option value="Watercolor">Watercolor</option>
                                    <option value="Acrylic">Acrylic</option>
                                    <option value="Pixels">Pixels</option>
                                    <option value="Inks">Inks</option>
                                    <option value="Charcoal">Charcoal</option>
                                    <option value="Pastel">Pastel</option>
                                    <option value="Spray Paint">Spray Paint</option>
                                    <option value="Encaustic">Encaustic</option>
                                    <option value="Pencils">Pencils</option>
                                    <option value="Mixed Media">Mixed Media</option>
                                </select>
                            </div>

                            {/* Artistic Style Select */}
                            <div className="filter-group">
                                <label style={{ fontSize: '12px', color: '#888' }}>Artistic Style</label>
                                <select
                                    value={style}
                                    onChange={(e) => setStyle(e.target.value)}
                                    style={{ width: '100%', padding: '6px', background: '#0f1115', color: '#fff', borderRadius: '4px' }}
                                >
                                    <option value="">All Styles</option>
                                    <option value="Realism">Realism</option>
                                    <option value="Abstract">Abstract</option>
                                    <option value="Impressionism">Impressionism</option>
                                    <option value="Modern">Modern</option>
                                    <option value="Surrealism">Surrealism</option>
                                    <option value="Anime / Manga">Anime / Manga</option>
                                    <option value="Pixel Art">Pixel Art</option>
                                    <option value="Concept Art">Concept Art</option>
                                    <option value="Expressionism">Expressionism</option>
                                    <option value="Art Nouveau">Art Nouveau</option>
                                    <option value="Folk Art">Folk Art</option>
                                    <option value="Dark Art">Dark Art</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button
                                    onClick={handleResetFilters}
                                    type="button"
                                    style={{ flex: 1, padding: '6px', background: 'transparent', color: '#ccc', border: '1px solid #444', borderRadius: '4px' }}
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={applySearchAndFilters}
                                    type="button"
                                    style={{ flex: 1, padding: '6px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px' }}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-root">
                <div className="profile-frame" onClick={toggleDropdown}>
                    <img className="profile-picture" src={userData?.profile_picture} alt="" />
                    <p className="mb-0 profile-name">{userData?.username}</p>

                    <button className={`expand-btn ${isOpen ? 'active' : ''}`}>
                        <img className="expand-btn-arrow" src="/arrow.png" alt="" />
                    </button>
                </div>
                {userData?.username !== 'Guest User' ? (
                    <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        <Link to="/profile">My Profile</Link>
                        <Link to="/profile/settings">Settings</Link>
                        {userData.role === "admin" ? <Link to="/admin/dashboard">Admin Panel</Link> : null}
                        <hr />
                        <LogOut setUser={setUserData} />
                    </div>
                ) : (
                    <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        <a href="/login">Log In</a>
                        <a href="/register">Sign Up</a>
                    </div>
                )}
            </div>
        </div>
    )
}