import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';

import userStore from '@/UserStore';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showRegistration, setShowRegistration] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');

    const router = useRouter();

    const validateEmail = (email) => {
        const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i;
        return emailRegex.test(email);
    };

    const handleCheckUser = async () => {
        if (!validateEmail(email)) {
            setError('Email invalid. Please try again.');
            return;
        }
        setError('');

        try {
            const response = await axios.get(`http://192.168.0.110:5050/user/getByEmail?email=${email}`);
            console.log(response.data);

            if (response.data) {
                handleLogin(); // Proceed to login if user exists
            } else {
                setShowRegistration(true); // Show registration form if user doesn't exist
            }
        } catch (err) {
            if (err.response) {
                console.log('Server Error:', err.response.data);
                setError(`Server Error: ${err.response.data.message || 'Something went wrong.'}`);
            } else if (err.request) {
                console.log('Network Error: No response received');
                setError('Network Error: Please check your internet connection.');
            } else {
                console.log('Error:', err.message);
                setError(`Error: ${err.message}`);
            }
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.0.110:5050/auth/login', { email, password });

            if (response.data) {
                const userData = response.data;

                // Save user data in MobX store
                userStore.setUser({
                    user_id: userData.user_id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    location: userData.location
                });

                router.push('/screens/home');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            if (err.response) {
                console.log('Server Error:', err.response.data);
                setError(`Server Error: ${err.response.data.message || 'Something went wrong.'}`);
            } else if (err.request) {
                console.log('Network Error: No response received');
                setError('Network Error: Please check your internet connection.');
            } else {
                console.log('Error:', err.message);
                setError(`Error: ${err.message}`);
            }
        }
    };

    const handleRegistration = async () => {
        if (!firstname || !lastname || !phone || !password) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await axios.post('http://192.168.0.110:5050/auth/registration', {
                email, password, firstName: firstname, lastName: lastname, phoneNumber: phone
            });

            if (response.data) {
                const userData = response.data;

                // Save user data in MobX store
                userStore.setUser({
                    user_id: userData.user_id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    location: userData.location
                });

                Alert.alert('Success', 'Registration successful!');
                router.push('/screens/home');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            if (err.response) {
                console.log('Server Error:', err.response.data);
                setError(`Server Error: ${err.response.data.message || 'Something went wrong.'}`);
            } else if (err.request) {
                console.log('Network Error: No response received');
                setError('Network Error: Please check your internet connection.');
            } else {
                console.log('Error:', err.message);
                setError(`Error: ${err.message}`);
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.title}>AgroVision</ThemedText>
                <ThemedText type="subtitle" style={styles.subtitle}>
                    Your Premier Destination for Lush Greenery: Elevate your space with our exceptional plant selection
                </ThemedText>

                {showRegistration && (
                    <>
                        <TextInput style={styles.input} placeholder="First Name" value={firstname} onChangeText={setFirstname} />
                        <TextInput style={styles.input} placeholder="Last Name" value={lastname} onChangeText={setLastname} />
                        <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    </>
                )}

                <TextInput style={styles.input} placeholder="E-mail address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} autoCapitalize="none" />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={showRegistration ? handleRegistration : handleCheckUser}>
                    <Text style={styles.buttonText}>{showRegistration ? 'Register' : 'Login / Register'}</Text>
                </TouchableOpacity>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    title: {
        fontSize: 32,
        color: '#1A7F00',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 8,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'black',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        width: '100%'
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
