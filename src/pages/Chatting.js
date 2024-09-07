import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FlatList, View, Keyboard, KeyboardAvoidingView, Platform, InputAccessoryView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Chatting = ({userId}) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef();
    const inset = useSafeAreaInsets();

    const loadMessages = async () => {
        try {
            const storedMessages = await AsyncStorage.getItem('chatMessages');
            if (storedMessages) {
                setMessages(JSON.parse(storedMessages));
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    // 로컬 스토리지에서 메시지 불러오기
    useEffect(() => {
        loadMessages();
    }, []);

    // 메시지를 로컬 스토리지에 저장
    const saveMessages = async (newMessages) => {
        try {
            await AsyncStorage.setItem('chatMessages', JSON.stringify(newMessages));
        } catch (error) {
            console.error('Error saving messages:', error);
        }
    };

    const handleSend = async () => {
        if (inputText.trim()) {
            const newMessage = { id: Date.now().toString(), text: inputText, sentByMe: true };
            const updatedMessages = [...messages, newMessage];

            if (updatedMessages.length > 50) {
                updatedMessages.shift(); // 오래된 메시지 삭제
            }

            setMessages(updatedMessages);
            saveMessages(updatedMessages);
            setInputText('');

            try {
                // AI request
                const response = await axios.post('http://43.203.202.150/chat/', {
                    user_input: inputText,
                    member_id: `${userId}`,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // response success
                const aiMessage = { id: Date.now().toString(), text: response.data.response, sentByMe: false };
                const updatedMessagesWithAI = [...updatedMessages, aiMessage];

                // 최대 50개
                if (updatedMessagesWithAI.length > 50) {
                    updatedMessagesWithAI.shift();
                }

                setMessages(updatedMessagesWithAI);
                saveMessages(updatedMessagesWithAI);
            } catch (error) {
                const errorMessage = { id: Date.now().toString(), text: 'Error: ' + error.message, sentByMe: false };
                const updatedMessagesWithError = [...updatedMessages, errorMessage];

                // 최대 50개
                if (updatedMessagesWithError.length > 50) {
                    updatedMessagesWithError.shift();
                }

                setMessages(updatedMessagesWithError);
                saveMessages(updatedMessagesWithError);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            const currentDateTime = new Date();
            const koreaOffset = 9 * 60 * 60 * 1000; // UTC+9 시간 오프셋 (9시간)
            const koreaTime = new Date(currentDateTime.getTime() + koreaOffset).toISOString().slice(0, 19);
            const timeRange = '00:00:30'; // 30초 간격
            await fetchNotifications(koreaTime, timeRange);
        }, 30000); // 30초 간격

        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async (koreaTime, timeRange) => {
        try {
            const response = await axios.get('http://43.203.202.150/schedules/reminder', {
                headers: {
                    member_id: `${userId}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    current_date_time: koreaTime,
                    time_range: timeRange,
                },
            });

            const data = response.data;
            if (data) {
                const notificationMessage = { id: Date.now().toString(), text: data, sentByMe: false };

                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, notificationMessage];
                    // 최대 50개
                    if (updatedMessages.length > 50) {
                        updatedMessages.shift();
                    }

                    saveMessages(updatedMessages);
                    return updatedMessages;
                });
            }
        } catch (error) {
            console.error("알림 가져오기 오류: ", error);
        }
    };

    const renderItem = ({ item }) => (
        <MessageBubble sentByMe={item.sentByMe}>
            <MessageText sentByMe={item.sentByMe}>{item.text}</MessageText>
        </MessageBubble>
    );


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? inset.bottom : 10}
        >
            <SafeAreaView>
                <Container>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        onContentSizeChange={() => {
                            if (flatListRef.current && messages.length > 0) {
                                flatListRef.current.scrollToEnd({ animated: false });
                            }
                        }}
                    />
                    {Platform.OS === 'ios' && (
                        <InputAccessoryView>
                            <InputBar>
                                <TextInput
                                    value={inputText}
                                    onChangeText={setInputText}
                                    placeholder="메시지를 입력하세요..."
                                    multiline={true}
                                />
                                <SendButton onPress={handleSend}>
                                    <ArrowImage source={require('../assets/arrow.png')} />
                                </SendButton>
                            </InputBar>
                        </InputAccessoryView>
                    )}
                    {Platform.OS === 'android' && (
                        <InputBar>
                            <TextInput
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="메시지를 입력하세요..."
                                multiline={true}
                            />
                            <SendButton onPress={handleSend}>
                                <ArrowImage source={require('../assets/arrow.png')} />
                            </SendButton>
                        </InputBar>
                    )}
                </Container>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default Chatting;

// Styled Components
const SafeAreaView = styled.SafeAreaView`
    flex: 1;
    background-color: #9bbbd4;
`;

const Container = styled.View`
    flex: 1;
    padding: 10px;
    justify-content: space-between;
`;

const MessageBubble = styled.View`
    background-color: ${({sentByMe}) => (sentByMe ? '#FFCD00' : '#fff')};
    padding: 10px;
    border-radius: 20px;
    margin: 5px 0;
    align-self: ${({sentByMe}) => (sentByMe ? 'flex-end' : 'flex-start')};
    max-width: 70%;
`;

const MessageText = styled.Text`
    font-size: 16px;
    color: #333;
`;

const InputBar = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 10px;
    border-top-color: #ccc;
    height: 60px;
`;

const TextInput = styled.TextInput`
    flex: 1;
    height: 40px;
    border-width: 1px;
    border-color: #ccc;
    border-radius: 20px;
    padding: 10px;
    margin-right: 10px;
    background-color: white;
`;

const SendButton = styled.TouchableOpacity`
    background-color: ${({ isPressed }) => (isPressed ? '#fff' : '#FFCD00')};
    padding: 10px;
    border-radius: 20px;
`;

const ArrowImage = styled.Image`
    width: 20px;
    height: 20px;
`;
