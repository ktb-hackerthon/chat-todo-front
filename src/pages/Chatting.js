import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { KeyboardAvoidingView, Platform } from 'react-native';


const Chatting = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef();

    // 로컬스토리지에서 메시지 불러오기
    useEffect(() => {
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
                const userId = await AsyncStorage.getItem('userId');

                // AI request
                const response = await axios.post('http://43.203.202.150/chat/',
                    {
                        user_input: inputText,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            member_id: `${userId}`,
                        },
                    }
                );

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

    return (
        <SafeAreaView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 90}  // 키보드가 올라왔을 때의 오프셋 조정
                style={{ flex: 1 }}
            >
            <Container>
                <MessagesContainer
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                >
                    {messages.map((message) => (
                        <MessageBubble key={message.id} sentByMe={message.sentByMe}>
                            <MessageText sentByMe={message.sentByMe}>{message.text}</MessageText>
                        </MessageBubble>
                    ))}
                </MessagesContainer>
                <InputBar>
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        multiline={true}
                        scrollEnabled={false}
                    />
                    <SendButton onPress={handleSend}>
                        <ArrowImage source={require('../assets/arrow.png')} />
                    </SendButton>
                </InputBar>
            </Container>
            </KeyboardAvoidingView>
        </SafeAreaView>
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

const MessagesContainer = styled.ScrollView`
    flex: 1;
    margin-bottom: 10px;
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

    /* iOS에서 그림자 */
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-offset: 2px;
    shadow-radius: 2px;

    /* Android에서 그림자 */
    elevation: 2;
`;

const SendButton = styled.TouchableOpacity`
    background-color: ${({ isPressed }) => (isPressed ? '#fff' : '#FFCD00')};
    padding: 10px;
    border-radius: 20px;

    /* iOS에서 그림자 */
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-offset: 1px;
    shadow-radius: 1px;

    /* Android에서 그림자 */
    elevation: 2;
`;

const ArrowImage = styled.Image`
    width: 20px;
    height: 20px;
`;
