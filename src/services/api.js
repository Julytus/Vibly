import axios from "../utils/axios-customize";

export const callRegister = async ({ username, password, first_name, last_name, retype_password }) => {
    try {
        const response = await axios.post('/identity/auth/register', {
            username,
            password,
            first_name,
            last_name,
            retype_password
        });
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
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
        console.error('Error logging in:', error);
        throw error;
    }
}

export const callLogout = async () => {
    try {
        const response = await axios.post('/identity/auth/logout', {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}