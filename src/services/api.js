import axios from "../utils/axios-customize";

const token = localStorage.getItem('token');

export const callRegister = async ({ email, username, password, first_name, last_name, retype_password }) => {
    try {
        const response = await axios.post('/identity/auth/register', {
            email,
            username,
            password,
            first_name,
            last_name,
            retype_password
        });
        return response.data;
    } catch (error) {
        console.error('API callRegister, Error:', error);
        throw error;
    }
};

export const callLogin = async ({ username, password }) => {
    try {
        const response = await axios.post('/identity/auth/login', {
            username,
            password
        });
        return response.data;
    } catch (error) {
        console.error('API callLogin, Error:', error);
        throw error;
    }
}

export const callLogout = async () => {
    try {
        const response = await axios.post('/identity/auth/logout', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error('API callLogout, Error', error);
        throw error;
    }
}

export const fetchProfile = async () => {
    try {
        const response = await axios.get('/profile/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API fetchProfile, Error:', error);
        throw error;
    }
}

export const getBasicProfileById = async (id) => {
  try {
      const response = await axios.get(`/profile/users/basic/id/${id}`);
      return response.data;
  } catch (error) {
      console.error('API getBasicProfileById, Error:', error);
      throw error;
  }
}

export const getAvatarById = async (id) => {
  try {
    const response = await axios.get(`/profile/users/avatar/${id}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('getAvatarById, Error:', error);
    throw error;
  }
};

export const getBackgroundById = async (id) => {
    try {
      const response = await axios.get(`/profile/users/background/${id}`, {
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('getBackgroundById, Error:', error);
      throw error;
    }
  };

export const getProfileById = async (id) => {
    try {
        const response = await axios.get(`/profile/users/id/${id}`);
        return response.data;
    } catch (error) {
        console.error('getProfileById, Error:', error);
        throw error;
    }
};

export const createPost = async (postData) => {
  try {
    const formData = new FormData();
    formData.append('content', postData.content);
    formData.append('privacyLevel', postData.privacyLevel || 'PUBLIC');
    
    if (postData.images && postData.images.length > 0) {
      postData.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await axios.post('/post/u', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('API createPost, Error:', error);
    throw error;
  }
};

export const getPostsByUserId = async (userId, page = 1, size = 4) => {
  try {
    const response = await axios.get(`/search/s/posts/user/${userId}`, {
      params: { page, size },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('API getPostsByUserId, Error:', error);
    throw error;
  }
};

//conversation

export const openConversation = async (senderId, receiverId) => {
    try {
        const response = await axios.post('/chat/conversation', {
            sender_id: senderId,
            receiver_id: receiverId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API openConversation, Error:', error);
        throw error;
    }
};

export const getConversationById = async (conversationId) => {
    try {
        const response = await axios.get(`/chat/conversation/${conversationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API getConversationById, Error:', error);
        throw error;
    }
};

export const getConversationsByUserId = async (userId, page = 1, size = 10) => {
    try {
        const response = await axios.get('/chat/conversation', {
            params: { page, size, userId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API getConversationsByUserId, Error:', error);
        throw error;
    }
};

//message

export const getMessagesByConversationId = async (conversationId, page = 1, size = 10) => {
    try {
        const response = await axios.get(`/chat/message/${conversationId}`, { params: { page, size } });
        return response.data;
    } catch (error) {
        console.error('API getMessagesByConversationId, Error:', error);
        throw error;
    }
};

export const sendMessage = async (senderId, content, conversationId) => {
    try {
        const response = await axios.post('/chat/message', {
            sender_id: senderId,
            content: content,
            conversation_id: conversationId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API sendMessage, Error:', error);
        throw error;
    }
};

// Friend Request APIs
export const sendFriendRequest = async (receiverId) => {
    try {
        const response = await axios.post('/profile/friends/send', null, {
            params: { receiverId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API sendFriendRequest, Error:', error);
        throw error;
    }
};

export const checkFriendRequest = async (friendId) => {
    try {
        const response = await axios.get('/profile/friends/checkRequest', {
            params: { friendId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API checkFriendRequest, Error:', error);
        throw error;
    }
};

export const cancelFriendRequest = async (requestId) => {
    try {
        const response = await axios.delete('/profile/friends/cancel', {
            params: { requestId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API cancelFriendRequest, Error:', error);
        throw error;
    }
};

export const acceptFriendRequest = async (requestId) => {
    try {
        const response = await axios.post(`/profile/friends/accept`, null, {
            params: { requestId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API acceptFriendRequest, Error:', error);
        throw error;
    }
};

export const declineFriendRequest = async (requestId) => {
    try {
        const response = await axios.post('/profile/friends/decline', null, {
            params: { requestId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API declineFriendRequest, Error:', error);
        throw error;
    }
};

export const checkFriendStatus = async (friendId, userId) => {
    try {
        const response = await axios.get('/profile/friends/checkFriend', {
            params: { 
                friendId,
                userId 
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API checkFriendStatus, Error:', error);
        throw error;
    }
};

export const unfriend = async (friendId) => {
    try {
        const response = await axios.post('/profile/friends/unfriend', null, {
            params: { friendId },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API unfriend, Error:', error);
        throw error;
    }
};

export const getFriendRequests = async (page = 1, size = 4) => {
    try {
        const response = await axios.get('/notification/friend/request', {
            params: { page, size },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('API getFriendRequests, Error:', error);
        throw error;
    }
};

export const getTimeline = async (userId, page = 0, size = 10) => {
  try {
    const response = await axios.get(`/timeline/timelines/${userId}`, {
      params: { page, size },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('API getTimeline, Error:', error);
    throw error;
  }
};