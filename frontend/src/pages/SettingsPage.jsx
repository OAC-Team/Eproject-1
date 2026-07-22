import { useState, useEffect } from 'react';
import userApi from '../api/userApi';
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import '../themes/SettingsPage.css'

import EditProfileForm from '../components/EditProfileForm';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('edit-profile');
    const [userData, setUserData] = useState(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(false);
    const [promoNotifs, setPromoNotifs] = useState(false);

    const token = Cookies.get('token');

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
                    <div className="tab-pane mt-5">
                        <h2 className="fw-bold mb-2">Account Management</h2>
                        <p>Manage your core account details.</p>
                        <div className="input-group">
                            <label>Registered Email</label>
                            <input type="email" value={userData?.email || "user@example.com"} disabled />
                            <small style={{ color: '#888' }}>Email changes are locked to secure your account.</small>
                        </div>
                        <button className="settings-delete-btn" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '50px', marginTop: '20px', cursor: 'pointer' }} onClick={() => alert("Are you sure? This action is permanent! (Account deleted!)")}>
                            Delete Account
                        </button>
                    </div>
                );

            case 'visibility':
                return (
                    <div className="tab-pane mt-5">
                        <h2 className="fw-bold mb-2">Profile Visibility</h2>
                        <p>Control who can discover your profile.</p>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
                            Make my profile private
                        </label>
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>{isPrivate ? "🔒 Your profile is currently hidden from search." : "🌐 Your profile is public to all users."}</p>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="tab-pane mt-5">
                        <h2 className="fw-bold mb-2">Notification Settings</h2>
                        <p>Choose how we contact you.</p>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '15px 0', cursor: 'pointer' }}>
                            <input type="checkbox" checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
                            Email me when someone saves my art
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input type="checkbox" checked={promoNotifs} onChange={() => setPromoNotifs(!promoNotifs)} />
                            Send weekly digest updates
                        </label>
                    </div>
                );

            case 'privacy':
                const downloadData = () => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `account_data.json`);
                    downloadAnchor.click();
                };

                return (
                    <div className="tab-pane mt-5">
                        <h2 className="fw-bold mb-2">Privacy and Data</h2>
                        <p>Manage your digital footprint and data rights.</p>
                        <button className="settings-save-btn" onClick={downloadData}>
                            📥 Download My Personal Data (.JSON)
                        </button>
                    </div>
                );

            case 'security':
                return (
                    <div className="tab-pane mt-5">
                        <h2 className="fw-bold mb-2">Security</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 'bold', margin: '15px 0' }}>
                            <span>🛡️</span> Secured with Google Authentication
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>Your password and login safety are managed directly by Google.</p>
                    </div>
                );

            default:
                return <EditProfileForm />;
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