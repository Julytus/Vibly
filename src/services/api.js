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
    console.log("1. Starting createPost with data:", postData);
    
    const response = await axios.post('/post/u', {
      content: postData.content
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log("2. Created post response:", response.data);

    let finalResponse = response.data;
    console.log("imgs:", postData.images);
    console.log( postData.images.length)
    if (postData.images && postData.images.length > 0) {
      console.log("3. Starting image upload");
      
      const formData = new FormData();
      postData.images.forEach(image => {
        formData.append('files', image);
      });
      console.log("4. FormData created:", formData);

      try {
        const uploadResponse = await axios.post(`/post/u/upload/${response.data.id}`, formData);
        finalResponse = uploadResponse.data;
        console.log("5. Upload response:", uploadResponse);
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
    }

    return finalResponse;
  } catch (error) {
    console.error('API createPost, Error:', error);
    throw error;
  }
};

export const getPostsByUserId = async (userId, page = 1, size = 4) => {
  try {
    const response = await axios.get(`/post/u/${userId}`, {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('API getPostsByUserId, Error:', error);
    throw error;
  }
};

export const getPostImage = async (imageUrl) => {
  try {
    const response = await axios.get(`/post/u/img/${imageUrl}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('getPostImage, Error:', error);
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