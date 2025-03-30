import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function HomeScreen() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const response = await axios.get('http://192.168.0.110:5050/batches');
            setBatches(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching batches:', error);
            setLoading(false);
        }
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                <View style={styles.header}>
                    <Image style={styles.back} source={require('../../assets/images/chevron-left.png')} />
                    <ThemedText type='subtitle'>SEEDS</ThemedText>
                    <TouchableOpacity onPress={toggleMenu}>
                        <Image style={styles.icon} source={require('../../assets/images/user (1).png')} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.burgerButton} onPress={toggleMenu}>
                    <Text style={styles.burgerText}>☰</Text>
                </TouchableOpacity>

                {menuVisible && (
                    <View style={styles.menuWrapper}>
                        <TouchableOpacity style={[styles.menuItem, { bottom: 150, right: 0 }]}>
                            <Ionicons name="home" size={30} color="#007537" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuItem, { bottom: 120, right: 60 }]}
                            onPress={() => router.push('/screens/weather')}  // Add this line for navigation
                        >
                            <Feather name="cloud" size={30} color="#007537" />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuItem, { bottom: 75, right: 100 }]}>
                            <MaterialIcons name="library-books" size={30} color="#007537" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('/screens/chat')} style={[styles.menuItem, { bottom: 20, right: 110 }]}>
                            <FontAwesome5 name="comments" size={30} color="#007537" />
                        </TouchableOpacity>
                    </View>
                )}


                <Text style={styles.batchHeader}>Batches</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#007537" />
                ) : (
                    <ScrollView style={styles.batchList}>
                        {batches.map((batch) => (
                            <TouchableOpacity
                                key={batch.batch_id}
                                style={styles.batchItem}
                                onPress={() => router.push(`/screens/batch?id=${batch.batch_id}`)}
                            >
                                <Text style={styles.batchTitle}>{batch.name}</Text>
                                <Text style={styles.batchSubtitle}>{batch.type} - {batch.status}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        width: '100%',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 20
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    back: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    burgerButton: {
        position: 'absolute',
        bottom: 60,
        right: 30,
        backgroundColor: '#007537',
        padding: 10,
        borderRadius: 50,
        zIndex: 9999 // Ensure button is clickable
    },
    burgerText: {
        color: 'white',
        fontSize: 24,
    },
    menuWrapper: {
        position: 'absolute',
        bottom: 20,
        right: 10,
        zIndex: 9999, // Ensure menu items are clickable
    },
    menuItem: {
        position: 'absolute',
    },
    batchHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    batchList: {
        marginTop: 10,
    },
    batchItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    batchTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    batchSubtitle: {
        fontSize: 14,
        color: '#666',
    },
});
