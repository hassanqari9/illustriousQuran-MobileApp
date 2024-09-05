import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SubmitButton from '../ui/SubmitButton';
import { createNewUser } from '../apis/authApi';

function Signup() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    async function signupSubmitHandler() {
        setLoading(true);
        try {
            const user = await createNewUser(formData);
            if (user) {
                Alert.alert(user.message);
                navigation.navigate('Login');
            }
        } catch (error) {
            Alert.alert(error.message);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                mode="outlined"
                label="Username"
                value={formData.username}
                onChangeText={value => setFormData({ ...formData, username: value })}
                style={styles.input}
                theme={{ colors: { primary: '#6200ee' } }} // Customize input underline color
            />
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
            <SubmitButton loading={loading} onPress={signupSubmitHandler} style={styles.button}>
                Submit
            </SubmitButton>
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Login</Text>
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        fontSize: 16,
        color: '#333',
    },
    loginLink: {
        fontSize: 16,
        color: '#6200ee',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

export default Signup;
