import React from 'react';
import '../themes/AddCollectionModal.css'

export default function AddCollectionModal({ isOpen, onClose, collections, onSelectCollection }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h3>Add to Collection</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {collections?.length > 0 ? (
                        <div className="collections-list">
                            {collections.map((col) => (
                                <button 
                                    key={col._id} 
                                    className="collection-option-row"
                                    onClick={() => onSelectCollection(col.name)}
                                >
                                    <span className="folder-icon">📁</span>
                                    <div className="collection-meta">
                                        <p className="col-name">{col.name}</p>
                                        <p className="col-count">{col.paintings?.length || 0} saved paintings</p>
                                    </div>
                                    <span className="arrow-icon">➔</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-modal-state">
                            <p>You haven't created any collections.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}