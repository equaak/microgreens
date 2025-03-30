import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput, Button, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function BatchDetailScreen() {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photos, setPhotos] = useState([]);
    const [irrigationEvents, setIrrigationEvents] = useState([]);
    const [growthNotes, setGrowthNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    const { id } = useLocalSearchParams();

    useEffect(() => {
        if (id) {
            fetchBatch();
        }
    }, [id]);

    const fetchBatch = async () => {
        try {
            const response = await axios.get(`http://192.168.0.110:5050/batches/${id}`);
            setBatch(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching batch details:', error);
            setLoading(false);
        }
    };

    const handleAddPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
        });

        if (!result.canceled && result.assets) {
            const newPhoto = result.assets[0].uri;
            setPhotos([...photos, newPhoto]); // Save photo locally in the state
        }
    };


    if (loading) {
        return <ActivityIndicator size="large" color="#007537" />;
    }

    if (!batch) {
        return <ThemedText type="error">No batch data available</ThemedText>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.batchInfo}>
                    <ThemedText type="title" style={styles.title}>{batch.name}</ThemedText>
                    <ThemedText type="subtitle" style={styles.detail}>Type: {batch.type}</ThemedText>
                    <ThemedText type="subtitle" style={styles.detail}>Substrate: {batch.substrate}</ThemedText>
                    <ThemedText type="subtitle" style={styles.detail}>Sowing Date: {new Date(batch.sowing_date).toDateString()}</ThemedText>
                    <ThemedText type="subtitle" style={styles.detail}>
                        Expected Harvest: {batch.expected_harvest_date ? new Date(batch.expected_harvest_date).toDateString() : 'Not set'}
                    </ThemedText>
                    <ThemedText type="subtitle" style={styles.detail}>Status: {batch.status}</ThemedText>
                </View>

                {/* Photo Tracking */}
                <ThemedText type="title" style={styles.sectionTitle}>Photo Tracking</ThemedText>
                <View style={styles.photoContainer}>
                    {photos.length === 0 ? (
                        <ThemedText type="subtitle">No photos available.</ThemedText>
                    ) : (
                        photos.map((photo, index) => (
                            <Image key={index} source={{ uri: photo }} style={styles.photo} />
                        ))
                    )}
                    <Button title="Add Photo" onPress={handleAddPhoto} />
                </View>


                {/* Irrigation Tracking */}
                <ThemedText type="title" style={styles.sectionTitle}>Irrigation Tracking</ThemedText>
                <View style={styles.trackingContainer}>
                    {irrigationEvents.map((event, index) => (
                        <ThemedText key={index} type="subtitle" style={styles.trackingItem}>Irrigation on {event}</ThemedText>
                    ))}
                    <Button title="Add Irrigation Record" onPress={() => setIrrigationEvents([...irrigationEvents, new Date().toLocaleString()])} />
                </View>

                {/* Growth Tracking */}
                <ThemedText type="title" style={styles.sectionTitle}>Growth Tracking</ThemedText>
                <View style={styles.trackingContainer}>
                    {growthNotes.map((note, index) => (
                        <ThemedText key={index} type="subtitle" style={styles.trackingItem}>{note}</ThemedText>
                    ))}
                    <TextInput
                        style={styles.input}
                        value={newNote}
                        onChangeText={setNewNote}
                        placeholder="Add a growth note..."
                    />
                    <Button title="Add Note" onPress={() => {
                        if (newNote.trim()) {
                            setGrowthNotes([...growthNotes, newNote]);
                            setNewNote('');
                        }
                    }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        padding: 20,
    },
    batchInfo: {
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 20,
    },
    title: {
        marginBottom: 10,
        color: '#007537',
    },
    detail: {
        marginBottom: 5,
    },
    sectionTitle: {
        marginTop: 20,
        marginBottom: 10,
        color: '#007537',
    },
    photoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    trackingContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#FFF',
    },
});
