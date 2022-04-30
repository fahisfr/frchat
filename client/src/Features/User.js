import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Axios from '../Axios'


export const fetchUser = createAsyncThunk('user/fetchUser', async (userId) => {
    const response = await Axios.get('/auth').then(res => res.data)
    return response
})
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: {
            name: '',
            number: '',
            contacts: [],
            isAuth: false,
        },
        error: '',
        loading: false,
    },
    reducers: {
        login: (state, action) => {
            console.log(action.payload)
            state.userInfo.name = action.payload.name
            state.userInfo.number = action.payload.number
            state.userInfo.isAuth = true

        },
        logout: (state, action) => {
            state.userInfo = {
                name: '',
                number: '',
                isAuth: false,
            }
        },
        contact: (state, action) => {
            state.userInfo.contacts = action.payload
        },
        ContactsMessages: (state, action) => {
            state.userInfo.contacts.forEach(contact => {
                if (contact.number === action.payload.from) {
                    contact.messages.push(action.payload.message)
                }
            })

        },
        ChangeUserStatus: (state, action) => {
            state.userInfo.contacts.forEach(contact => {
                if (contact.number === action.payload.number) {
                    contact.online = action.payload.status
                }
            })

        },
        
    }, extraReducers: {
        [fetchUser.fulfilled]: (state, action) => {
            state.loading = false;
            if (action.payload.success) {
                state.userInfo = action.payload.UserInfo
            }
        },
        [fetchUser.pending]: (state, action) => {
            state.loading = true;

        },
        [fetchUser.rejected]: (state, action) => {
            state.error = action.error;
            state.loading = false;
        }
    }
})

export const isAuth = state => state.user.userInfo.isAuth
export const GetUserInfo = state => state.user.userInfo

export const { login, logout, Setinfo, contact,ContactsMessages,ChangeUserStatus } = userSlice.actions;

export default userSlice.reducer;