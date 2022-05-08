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
        selectedContact: '',
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
        addContactInfo: (state, action) => {
            state.userInfo.contacts = action.payload
            if (localStorage.getItem("chats")) {
                const chats = JSON.parse(localStorage.getItem("chats"))
                state.userInfo.contacts.forEach(contact => {
                    chats.forEach(chat => {
                        if (contact.number === chat.number) {
                            contact.messages = chat.messages
                        } else {
                            state.userInfo.contacts.push(chat)
                        }
                    })
                })

            } else {
                localStorage.setItem("chats", JSON.stringify(state.userInfo.contacts))
            }
        },
        addContactMessage: (state, action) => {
            let contactIn = false
            const contacts = state.userInfo.contacts
            for (let contact of contacts) {
                console.log(contact.number, action.payload.from)
                if (contact.number === action.payload.from) {
                    contact.typing = false
                    contactIn = true
                    contact.messages.push(action.payload.message)
                    const chats = JSON.parse(localStorage.getItem('chats'))
                    for (let chat of chats) {
                        if (chat.number === action.payload.from) {
                            chat.messages.push(action.payload.message)
                            localStorage.setItem('chats', JSON.stringify(chats))
                            break;
                        }
                    }
                    break;
                }

            }
            if (!contactIn) {
                state.userInfo.contacts.push({
                    number: action.payload.from,
                    messages: [action.payload.message],
                    online: true,
                    notSaved: true
                })
                const chats = JSON.parse(localStorage.getItem('chats'))
                chats.push({
                    number: action.payload.from,
                    notSaved: true,
                    messages: [action.payload.message],
                })
                localStorage.setItem('chats', JSON.stringify(chats))
            }


        },
        addContact: (state, action) => {

            state.userInfo.contacts.push({ ...action.payload, messages: [] })
            const chats = JSON.parse(localStorage.getItem('chats'))
            chats.push({ number: action.payload.number, messages: [], })
            localStorage.setItem('chats', JSON.stringify(chats))


        },
        changeContactStatus: (state, action) => {
            const { number, status } = action.payload
            state.userInfo.contacts.find(contact => contact.number === number).online = status

        },
        changeTypingStatus: (state, action) => {
            const { from, status } = action.payload
            state.userInfo.contacts.find(contact => contact.number === from).typing = status
        },
        removeContact: (state, action) => {

            const conIndex = state.userInfo.contacts.findIndex(contact => contact.number === action.payload)
            state.userInfo.contacts.splice(conIndex, 1)

            const chats = JSON.parse(localStorage.getItem('chats'))
            const chIndex = chats.findIndex(chat => chat.number === action.payload)
            chats.splice(chIndex, 1)
            localStorage.setItem('chats', JSON.stringify(chats))

        }, selectContact: (state, action) => {
            state.selectedContact = action.payload
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
export const getSelectedContact = state => state.user.userInfo?.contacts.find(contact => contact.number === state.user.selectedContact)

export const {
    login, logout, addContactInfo, addContact,
    addContactMessage, changeContactStatus,
    changeTypingStatus, removeContact, selectContact

} = userSlice.actions;

export default userSlice.reducer;