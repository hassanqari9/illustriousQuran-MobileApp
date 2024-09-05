import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { loginUser } from '../apis/authApi';
import SubmitButton from '../ui/SubmitButton';
import { addUserToken } from '../store/authSlice';

function Login() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const dispatch = useDispatch();

    async function loginSubmitHandler() {
        setLoading(true);
        try {
            const user = await loginUser(formData);
            if (user) {
                dispatch(addUserToken({ token: user.token, user: user.data }));
                Alert.alert(user.message);
                navigation.navigate('Profile');
            }
        } catch (error) {
            Alert.alert(error.message);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                mode="outlined"
                label="Email"
                value={formData.email}
                onChangeText={value => setFormData({ ...formData, email: value })}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }} // Customize input underline color
            />
            <TextInput
                mode="outlined"
                label="Password"
                value={formData.password}
                onChangeText={value => setFormData({ ...formData, password: value })}
                secureTextEntry
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }} // Customize input underline color
            />
            <SubmitButton loading={loading} onPress={loginSubmitHandler} style={styles.button}>
                Submit
            </SubmitButton>
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.signupLink}>Signup</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 20,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        fontSize: 16,
        color: '#333',
    },
    signupLink: {
        fontSize: 16,
        color: '#6200ee',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

export default Login;