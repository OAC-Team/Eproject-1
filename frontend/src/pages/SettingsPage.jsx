import { useState, useEffect } from 'react';
import userApi from '../api/userApi';
import uploadApi from '../api/uploadApi.js';
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import '../themes/SettingsPage.css'
import ComingSoon from '../components/ComingSoon.jsx'

import EditProfileForm from '../components/EditProfileForm';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('edit-profile');
    const [userData, setUserData] = useState(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(false);
    const [promoNotifs, setPromoNotifs] = useState(false);

    const token = Cookies.get('token');

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const imagePath = await uploadApi.uploadImage(file);

            // update userData with the new picture URL
            setUserData({ ...userData, profile_picture: imagePath.url });

            Swal.fire({
                title: 'Success!',
                text: 'Profile picture updated!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to upload image.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleSaveProfile = async () => {
        if (isSaving) return;

        setIsSaving(true);

        try {
            await userApi.updateUser(token, userData)

            Swal.fire({
                title: "Success",
                text: "Profile saved.",
                confirmButtonText: "Close",
                icon: "success"
            })
        } catch (error) {
            console.error("Failed to save changes:", error);
            Swal.fire({
                title: "Error",
                text: "Something went wrong.",
                confirmButtonText: "Close",
                icon: "error"
            })
        } finally {
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    setIsSaving(false);
                }, 1000)
            })
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'edit-profile':
                return <EditProfileForm isSaving={isSaving} userData={userData} setUserData={setUserData} onProfileSave={handleSaveProfile} />;

            case 'account':
                return (
                    <div className="tab-pane">
                        <h2 className="fw-bold mb-2" style={{ color: 'var(--admin-text-primary)', fontSize: '1.8rem' }}>Account Management</h2>
                        <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '24px' }}>Manage your core account details.</p>

                        <div className="pintl-input-container" style={{ marginBottom: '24px' }}>
                            <label>Registered Email</label>
                            <input type="email" value={userData?.email || "user@example.com"} disabled />
                            <small style={{ color: 'var(--admin-text-muted)', marginTop: '4px', fontSize: '0.8rem' }}>Email changes are locked to secure your account.</small>
                        </div>

                        <div style={{ padding: '16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', marginTop: '8px' }}>
                            <p style={{ color: '#f87171', fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>Delete Account</p>
                            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '12px' }}>Permanently remove your account and all data. This cannot be undone.</p>
                            <em style={{ color: '#fafafa94', fontWeight: 600, marginBottom: '4px', fontSize: '0.9rem' }}>Coming Soon</em>
                            {/* <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', transition: 'background 0.18s ease' }}
                                onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                                onMouseLeave={e => e.target.style.background = 'transparent'}
                                onClick={() => alert("Are you sure? This action is permanent!")}>
                                🗑 Delete my account
                            </button> */}
                        </div>
                    </div>
                );

            case 'visibility':
                return <ComingSoon title="Profile Visibility" description="Control who can discover your profile." />;


            case 'notifications':
                return <ComingSoon title="Notification Settings" description="Choose how we contact you." />;

            case 'privacy':
                const downloadData = () => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `account_data.json`);
                    downloadAnchor.click();
                };

                return (
                    <div className="tab-pane">
                        <h2 style={{ color: 'var(--admin-text-primary)', fontSize: '1.8rem', marginBottom: '4px' }}>Privacy and Data</h2>
                        <p style={{ color: 'var(--admin-text-secondary)', marginBottom: '24px' }}>Manage your digital footprint and data rights.</p>
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.6 }}>Download a copy of your personal data at any time includes your profile, posts, and account settings as a JSON file.</p>
                        <button className="settings-save-btn" onClick={downloadData}>
                            📥 Download My Personal Data
                        </button>
                    </div>
                );

            case 'security':
                return <ComingSoon title="Security" description="Your account protection and login settings." />;

            default:
                return <EditProfileForm isSaving={isSaving} userData={userData} setUserData={setUserData} onProfileSave={handleSaveProfile} />;

        }
    };

    useEffect(() => {

        (async () => {
            const responseData = await userApi.fetchUser(token);
            if (responseData) {
                setUserData(responseData.userData);
            } else {
                setUserData({ username: 'Guest User', role: 'guest' });
            }

            // if (userData) {
            //     console.log(userData)
            // }
        })()

    }, [])

    return (
        <div className="settings-wrapper d-flex gap-5 align-items-start w-100 text-white" style={{ fontFamily: 'sans-serif', padding: '40px 20px' }}>

            <aside className="settings-sidebar d-flex flex-column gap-4">
                {[
                    { id: 'edit-profile', label: 'Edit profile' },
                    { id: 'account', label: 'Account management' },
                    { id: 'visibility', label: 'Profile visibility' },
                    { id: 'notifications', label: 'Notifications' },
                    { id: 'privacy', label: 'Privacy and data' },
                    { id: 'security', label: 'Security' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`settings-option-btn text-start fw-bold position-relative ${activeTab === tab.id ? 'active-tab' : ''}`}
                        style={{
                            fontSize: '1.1rem',
                            background: 'none',
                            border: 'none',
                            padding: '8px 12px',
                            color: activeTab === tab.id ? '#e6edf3' : '#7d8590',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'color 0.2s, background 0.2s',
                            position: 'relative',
                            borderRadius: '8px',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </aside>

            <main className="settings-content">
                {renderTabContent()}
            </main>
        </div>
    );
}