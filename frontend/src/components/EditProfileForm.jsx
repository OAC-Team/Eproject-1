import { useState } from 'react'
import uploadApi from '../api/uploadApi'
import Swal from 'sweetalert2'

export default function EditAccountForm({ userData, setUserData, onProfileSave, isSaving }) {
    const [isUploading, setIsUploading] = useState(false);

    if (!userData) return <p style={{ color: 'var(--admin-text-muted)' }}>Loading...</p>;

    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const imagePath = await uploadApi.uploadProfilePicture(file);
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
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px' }}>
            <h2 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>Edit profile</h2>
            <p className="mb-4" style={{ fontSize: '0.95rem', color: 'var(--admin-text-secondary)' }}>
                Please keep your personal details private. Information you shared will appear on your profile.
            </p>

            {/* Hidden file input */}
            <input
                id="profile-pic-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleProfilePictureChange}
            />

            {/* Photo Row */}
            <div className="settings-profile-avatar mb-4">
                <label className="d-block mb-2" style={{ fontSize: '0.85rem', color: '#7d8590' }}>Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0px' }}>
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
                            opacity: isUploading ? 0.5 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                    />
                    <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => document.getElementById('profile-pic-input').click()}
                        style={{
                            fontSize: '20px',
                            fontWeight: 500,
                            color: '#3b82f6',
                            background: 'rgba(59,130,246,0.15)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 13px',
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            opacity: isUploading ? 0.6 : 1,
                        }}
                    >
                        {isUploading ? 'Uploading...' : 'Change Avatar'}
                    </button>
                </div>
            </div>

            <div className="d-flex flex-column gap-3">
                <div className="pintl-input-container">
                    <label>Name</label>
                    {userData?.username !== "Guest" ?
                        <input
                            type="text"
                            value={userData?.username || ""}
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
                    disabled={isSaving || isUploading}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    )
}