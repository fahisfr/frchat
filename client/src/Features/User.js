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
        }
    }, extraReducers: {
        [fetchUser.fulfilled]: (state, action) => {
            state.loading = false;
            console.log(action.payload.UserInfo)
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

export const { login, logout,Setinfo } = userSlice.actions;

export default userSlice.reducer;