import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

const initialState = {
    status: "",
    error: "",
    activeConversation: {},
    messages: [],
    notification: [],
};

export const getConversationMessages = createAsyncThunk("conversation/messages", 
    async(convo_id, {rejectWithValue}) => {
      try {
        const response = await api.getMessagesByConversationId(convo_id);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
  });

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload;
        },
        updateMessages: (state, action) => {
            state.messages = [...state.messages, action.payload];
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getConversationMessages.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getConversationMessages.fulfilled, (state, action) => {
            state.status = 'success';
            state.messages = action.payload;
        })
        .addCase(getConversationMessages.rejected, (state, action) => {
            state.status = 'error';
            state.error = action.payload;
        });
    }
});

export const { setActiveConversation, updateMessages } = chatSlice.actions;
export default chatSlice.reducer;
