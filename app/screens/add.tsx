import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView, Text } from 'react-native';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';

export default function AddBatchScreen() {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [sowingDate, setSowingDate] = useState('');
    const [substrate, setSubstrate] = useState('');

    const handleAddBatch = async () => {
        if (!name || !type || !sowingDate || !substrate) {
            Alert.alert('Error', 'Please fill in all the required fields.');
            return;
        }

        try {
            const response = await axios.post('http://192.168.0.110:5050/batches', {
                name,
                type,
                sowing_date: sowingDate,
                substrate
            });

            console.log(response.data);

            Alert.alert('Success', 'Batch added successfully!');
            setName('');
            setType('');
            setSowingDate('');
            setSubstrate('');
        } catch (error) {
            console.error('Error adding batch:', error);
            Alert.alert('Error', 'Failed to add batch. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ThemedText type="title" style={styles.title}>Add New Batch</ThemedText>

                <TextInput
                    style={styles.input}
                    placeholder="Batch Name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#8F8F8F"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Type (e.g., Microgreens)"
                    value={type}
                    onChangeText={setType}
                    placeholderTextColor="#8F8F8F"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Sowing Date (YYYY-MM-DD)"
                    value={sowingDate}
                    onChangeText={setSowingDate}
                    placeholderTextColor="#8F8F8F"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Substrate (e.g., Coconut Coir)"
                    value={substrate}
                    onChangeText={setSubstrate}
                    placeholderTextColor="#8F8F8F"
                />

                <TouchableOpacity style={styles.button} onPress={handleAddBatch}>
                    <Text style={styles.buttonText}>Add Batch</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8F5',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        color: '#007537',
        marginBottom: 30,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#DDD',
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    button: {
        backgroundColor: '#007537',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
