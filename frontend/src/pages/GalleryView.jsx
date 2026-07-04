export default function GalleryView({ paintings }) {
    const BASE_URL = "http://localhost:5000"
    if (!Array.isArray(paintings)) {
        // console.log(paintings)
        // console.log(typeof (paintings))
        return <p>Loading gallery items or data format is invalid...</p>;
    }

    if (paintings.length === 0) {
        return <p>No pictures found in the gallery yet.</p>;
    }

    return (
        <div className="gallery-grid">
            {paintings.map((painting) => (
                <div key={painting._id} className="gallery-card">
                    {/* Image Frame Wrapper */}
                    <div className="gallery-image-frame">
                        <img
                            src={`${BASE_URL}${painting.image_url}`}
                            alt={painting.title}
                            className="gallery-display-img"
                        />

                        <div className="gallery-card-overlay">
                            <span className="gallery-artist-tag">{painting.artist}</span>
                            <div className="gallery-view-action">
                                <img className="open-url-icon" src="/open_url.png" alt="" disabled></img>
                            </div>
                        </div>
                    </div>

                    <div className="gallery-card-details">
                        <h4 className="gallery-card-title">{painting.title}</h4>
                        {painting.artistic_style && (
                            <span className="gallery-style-badge">{painting.artistic_style}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}