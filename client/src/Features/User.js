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
        newMessges: [],
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
            if (localStorage.getItem("chats")) {
                const chats = JSON.parse(localStorage.getItem("chats"))
                state.userInfo.contacts.forEach(contact => {
                    chats.forEach(chat => {
                        if (contact.number === chat.number) {
                            contact.messages = chat.messages
                        }
                    })
                })

            } else {
                localStorage.setItem("chats", JSON.stringify(state.userInfo.contacts))
            }
        },
        ContactsMessages:  (state, action) => {
            // var contactIn = false
            state.userInfo.contacts.forEach(contact => {
                if (contact.number === action.payload.from) {
                    contact.typing = false
                    // contactIn = true
                    contact.messages.push(action.payload.message)
                    const oldchats = localStorage.getItem('chats')
                    const chats = JSON.parse(oldchats)
                    chats.forEach(chat => {
                        if (chat.number === action.payload.from) {
                            chat.messages.push(action.payload.message)
                            localStorage.setItem('chats', JSON.stringify(chats))
                        }
                    })
                } 

            })
            // if (!contactIn) {
            //     state.userInfo.contacts.push({
            //         number: action.payload.from,
            //         messages: [action.payload.message],
            //     })
            // }


        },
        // addContact: (state, action) => {
        //     state.userInfo.contacts.push({ ...action.payload, messages: [] })
        //     const chat = localStorage.getItem('chats')
        //     const chats = JSON.parse(chat)
        //     chats.push({
        //         number: action.payload.number,
        //         messages: [],
        //     })
        //     localStorage.setItem('chats', JSON.stringify(chats))

            
        // },
        ChangeUserStatus: (state, action) => {
            state.userInfo.contacts.forEach(contact => {
                if (contact.number === action.payload.number) {
                    contact.online = action.payload.status
                }
            })

        },
        typing: (state, action) => {
            state.userInfo.contacts.forEach(contact => {
                if (contact.number === action.payload.from) {
                    contact.typing = action.payload.status
                }
            })
        },
        removeContact: (state, action) => {
            state.userInfo.contacts = state.userInfo.contacts.filter(contact => contact.number !== action.payload)
            const chats = JSON.parse(localStorage.getItem('chats'))
            chats.forEach(chat => {
                if (chat.number === action.payload) {
                    chats.splice(chats.indexOf(chat), 1)
                    localStorage.setItem('chats', JSON.stringify(chats))
                }
            })
        }


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

export const {
    login, logout, Setinfo, contact,
    ContactsMessages, ChangeUserStatus, typing,

} = userSlice.actions;

export default userSlice.reducer;