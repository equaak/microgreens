import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Button, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';

const API_KEY = 'b98df9cb94877b4da37f249705d4f270';  // Replace with your OpenWeather API key

export default function WeatherScreen() {
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location is required!');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            fetchWeather(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007537" />;
    }

    if (!location || !weather) {
        return <ThemedText type="error">Failed to fetch location or weather data.</ThemedText>;
    }

    const { latitude, longitude } = location.coords;

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker coordinate={{ latitude, longitude }} title="Your Location" />
            </MapView>

            <View style={styles.infoBox}>
                <ThemedText type="title">Current Weather</ThemedText>
                <ThemedText type="subtitle">Temperature: {weather.main.temp}°C</ThemedText>
                <ThemedText type="subtitle">Humidity: {weather.main.humidity}%</ThemedText>
                <ThemedText type="subtitle">Description: {weather.weather[0].description}</ThemedText>
                <Button title="Refresh" onPress={() => fetchWeather(latitude, longitude)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '50%',
    },
    infoBox: {
        padding: 20,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
});
