import {useState} from 'react'

export default function EditAccountForm({ userData, setUserData, onProfileSave, isSaving }) {
    return (
        <div className='mt-5' style={{ maxWidth: '600px' }}>
            <h2 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>Edit profile</h2>
            <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                Please keep your personal details private. Information you shared will appear on your profile.
            </p>

            {/* Photo Row */}
            <div className="mb-4">
                <label className="d-block text-secondary mb-2" style={{ fontSize: '0.85rem' }}>Photo</label>
                <div className="d-flex align-items-center gap-3">
                    <img
                        src={userData?.profile_picture || "https://via.placeholder.com/80"}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: '75px', height: '75px', objectFit: 'cover' }}
                    />
                    <button className="btn btn-light fw-bold px-3 rounded-pill" style={{ background: '#e9e9e9', border: 'none', fontSize: '0.9rem' }}>
                        Change
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
        </div>
    )
}