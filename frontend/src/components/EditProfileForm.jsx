import { useState } from 'react'

export default function EditAccountForm({ userData, setUserData, onProfileSave, isSaving }) {
    return (
        <div style={{ maxWidth: '600px' }}>
            <h2 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>Edit profile</h2>
            <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                Please keep your personal details private. Information you shared will appear on your profile.
            </p>

            {/* Photo Row */}
            <div className="settings-profile-avatar mb-4">
                <label className="d-block mb-2" style={{ fontSize: '0.85rem', color: '#7d8590' }}>Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: "24px 0px" }}>
                    <img
                        src={userData?.profile_picture || "https://via.placeholder.com/80"}
                        alt="Avatar"
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #3b82f6',
                            flexShrink: 0,
                        }}
                    />
                    <button style={{
                        fontSize: '20px',
                        fontWeight: 500,
                        color: '#3b82f6',
                        background: 'rgba(59,130,246,0.15)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 13px',
                        cursor: 'pointer',
                    }}>
                        Change Avatar
                    </button>
                </div>
            </div>

            <form className="d-flex flex-column gap-3">
                <div className="pintl-input-container">
                    <label>Name</label>
                    {userData?.username !== "Guest" ?
                        <input
                            type="text"
                            value={userData?.username || "Not Loaded"}
                            placeholder="Add your name"
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        />
                        :
                        <input type="text" value="Guest" placeholder="Cannot change guest's name" disabled />
                    }
                </div>

                <div className="pintl-input-container">
                    <label>About</label>
                    <textarea
                        rows="3"
                        placeholder="Write something about yourself..."
                        value={userData?.bio || ""}
                        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                    />
                </div>

                <button
                    className="settings-save-btn"
                    onClick={() => onProfileSave()}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div >
    )
}