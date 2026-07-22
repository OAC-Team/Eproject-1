import axios from "axios";

//Painting
async function getPendingPaintings(token) {
    try {
        const response = await axios.get('http://localhost:5000/api/admin/paintings/pending',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching pending paintings', error);
        throw error;
    }
};

async function getApprovePaintings(token) {
    try {
        const response = await axios.get('http://localhost:5000/api/admin/paintings/approve',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching approved paintings', error);
        throw error;
    }
};

async function getRejectPaintings(token) {
    try {
        const response = await axios.get('http://localhost:5000/api/admin/paintings/reject',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching reject paintings', error);
        throw error;
    }
};

async function getAllPaintings(token) {
    try {
        const response = await axios.get('http://localhost:5000/api/admin/paintings',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching all paintings', error);
        throw error;
    }
}

async function handleStatusPainting(painting_id, status, token) {
    try {
        const response = await axios.patch(`http://localhost:5000/api/admin/paintings/${painting_id}/handle`,
            { status },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error updating painting status', error);
        throw error;
    }
}

async function deletePaintings(painting_id, token) {
    try {
        const response = await axios.delete(`http://localhost:5000/api/admin/paintings/${painting_id}/delete`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error delete reject paintings', error);
        throw error;
    }
};

//User
async function getAllUser(token) {
    try {
        const response = await axios.get('http://localhost:5000/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data;
    } catch (error) {
        console.log("Failed to fetch user data from database." + error.message);
    }
}

async function getUser(user_id, token) {
    try {
        const response = await axios.get(`http://localhost:5000/api/admin/users/${user_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data;
    } catch (error) {
        console.log('Failed to fetch user data from database.' + error.message)
        throw error;
    }
}

async function getUserLog(user_id, token) {
    try {
        const response = await axios.get(`http://localhost:5000/api/admin/userLog/${user_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error get user log', error);
        throw error;
    }
}

async function updateUserStatus(user_id, active, reason, adminName, token) {
    try {
        const response = await axios.patch(`http://localhost:5000/api/admin/users/${user_id}/status`,
            {
                active,
                reason,
                adminName
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error updating user status', error);
        throw error;
    }
}

//Admin
async function verifyAdminPassword(password, token) {
    try {
        const response = await axios.post(`http://localhost:5000/api/admin/verify-password`,
            { password },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error verify admin password', error);
        throw error;
    }
}

async function getAdminLog(targetUserId, token) {
    try {
        const response = await axios.get(`http://localhost:5000/api/admin/adminLog/${targetUserId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error get admin log', error);
        throw error;
    }
}

async function resetUserPassword(targetUserId, newPassword, reason, adminName, token) {
    try {
        const response = await axios.patch(`http://localhost:5000/api/admin/users/${targetUserId}/reset-password`,
            { newPassword, reason, adminName },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error reset Pw', error);
        throw error;
    }
}


async function updateUserProfileByAdmin(targetUserId, profileData, token) {
    try {
        const response = await axios.patch(`http://localhost:5000/api/admin/users/${targetUserId}/profile`,
            profileData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user profile by admin', error);
        throw error;
    }
}

async function getAllUserLogs(token) {
    try {
        const response = await axios.get(`http://localhost:5000/api/admin/userLogs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting all user logs:', error);
        throw error;
    }
}

async function deleteUserLog(logId, token) {
    try {
        const response = await axios.delete(`http://localhost:5000/api/admin/userLog/${logId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user log:', error);
        throw error;
    }
}

async function getRejectedPaintingsByUser(userId, token) {
    try {
        const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}/rejected-paintings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching rejected paintings:', error);
        throw error;
    }
}

export default {
    getAllPaintings,
    getPendingPaintings,
    handleStatusPainting,
    getApprovePaintings,
    getRejectPaintings,
    deletePaintings,
    getAllUser,
    getUser,
    updateUserStatus,
    verifyAdminPassword,
    getAdminLog,
    resetUserPassword,
    getUserLog,
    updateUserProfileByAdmin,
    getAllUserLogs,
    deleteUserLog,
    getRejectedPaintingsByUser
}