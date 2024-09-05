import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {},
        token: '',
        isAuthenticated: false
    },
    reducers: {
        addUserToken: (state, action) => {
            // console.log(action.payload.user);
            // console.log(action.payload.token);
            state.token = action.payload.token
            state.user = action.payload.user
            state.isAuthenticated = true
            AsyncStorage.setItem('user', JSON.stringify(action.payload.user))
            AsyncStorage.setItem('token', action.payload.token)
        },
        logout: (state, action) => {
            state.token = null;
            state.isAuthenticated = false
            AsyncStorage.removeItem('token')
        },
    }
})

export const addUserToken = authSlice.actions.addUserToken
export const logout = authSlice.actions.logout

export default authSlice.reducer