import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';
import { ThemedText } from '@/components/ThemedText';

export default function ChatBotScreen() {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

    const askAI = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setChatHistory([...chatHistory, { type: 'user', text: question }]);

        try {
            const res = await axios.post('http://192.168.0.110:5050/ai/ask', { question });

            const aiResponse = res.data.response || "Sorry, I couldn't understand that. Please try again.";
            setResponse(aiResponse);
            setChatHistory(prev => [...prev, { type: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error('Error asking AI:', error);
            setResponse('Error: Could not get a response from the AI.');
        }

        setQuestion('');
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.chatContainer}>
                {chatHistory.map((chat, index) => (
                    <View
                        key={index}
                        style={[
                            styles.chatBubble,
                            chat.type === 'user' ? styles.userBubble : styles.aiBubble
                        ]}
                    >
                        <ThemedText type="subtitle">{chat.text}</ThemedText>
                    </View>
                ))}
            </ScrollView>

            {loading && <ActivityIndicator size="large" color="#007537" />}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={question}
                    onChangeText={setQuestion}
                    placeholder="Ask me anything..."
                />
                <Button title="Send" onPress={askAI} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    chatContainer: {
        flex: 1,
        padding: 20,
    },
    chatBubble: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    userBubble: {
        backgroundColor: '#007537',
        alignSelf: 'flex-end',
    },
    aiBubble: {
        backgroundColor: '#E0E0E0',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#DDD',
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 8,
        marginRight: 10,
    },
});
