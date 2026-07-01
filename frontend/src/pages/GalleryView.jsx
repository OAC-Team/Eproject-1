export default function GalleryView({ paintings }) {
    if (!Array.isArray(paintings)) {
        console.log(paintings)
        return <p>Loading gallery items or data format is invalid...</p>;
    }

    if (paintings.length === 0) {
        return <p>No pictures found in the gallery portal yet!</p>;
    }

    return (
        <div className="gallery-grid">
            {paintings.map((painting) => (
                <div key={painting._id} className="gallery-card">
                    <h4>{painting.title}</h4>
                </div>
            ))}
        </div>
    );
}