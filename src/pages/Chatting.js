import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const Chatting = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            setMessages([...messages, { id: Date.now().toString(), text: inputText }]);
            setInputText('');
        }
    };

    return (
        <SafeAreaView>
            <Container>
                <MessagesContainer>
                    {messages.map((message) => (
                        <MessageBubble key={message.id}>
                            <MessageText>{message.text}</MessageText>
                        </MessageBubble>
                    ))}
                </MessagesContainer>
                <InputBar>
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                    />
                    <SendButton onPress={handleSend}>
                        <SendButtonText>Send</SendButtonText>
                    </SendButton>
                </InputBar>
            </Container>
        </SafeAreaView>
    );
};

export default Chatting;

// Styled Components
const SafeAreaView = styled.SafeAreaView`
    flex: 1;
    height: ${height}px;
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
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 20px;
    margin-bottom: 5px;
    align-self: flex-start;
`;

const MessageText = styled.Text`
    font-size: 16px;
    color: #333;
`;

const InputBar = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 10px;
    border-top-width: 1px;
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
`;

const SendButton = styled.TouchableOpacity`
    background-color: #007bff;
    padding: 10px 15px;
    border-radius: 20px;
`;

const SendButtonText = styled.Text`
    color: #fff;
    font-size: 16px;
`;
