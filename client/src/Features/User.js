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
            state.userInfo.contacts = action.payload.contacts
            for (let message of action.payload.messages) {
                let conIn = false
                message = JSON.parse(message)
                for (let contact of state.userInfo.contacts) {
                    if (contact.number === message.from) {
                        conIn = true
                        contact.messages.push(message.message)
                        break;
                    }
                }

                if (!conIn) {
                    state.userInfo.contacts.push({
                        number: message.from,
                        messages: [message.message],
                        notSaved: true
                    })
                }
            }

        },

        addContactMessage: (state, action) => {
            let contactIn = false
            const contacts = state.userInfo.contacts
            for (let contact of contacts) {
                if (contact.number === action.payload.from) {
                    contact.typing = false
                    contactIn = true
                    contact.messages.push(action.payload.message)
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
            }

        },
        addContact: (state, action) => {
            const connExist = state.userInfo.contacts.find(contact => contact.number === action.payload.number)

            connExist ? connExist = { ...action.payload, messages: connExist.messages }
                : state.userInfo.contacts.push({ ...action.payload, messages: [] })
   
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


        }, selectContact: (state, action) => {
            state.selectedContact = action.payload
        }


    }, extraReducers: {
        [fetchUser.fulfilled]: (state, action) => {
            state.loading = false;
            if (action.payload.success) {
                state.userInfo = action.payload.userInfo

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