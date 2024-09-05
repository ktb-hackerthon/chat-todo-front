import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';


const Chatting = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef();

    const handleSend = () => {
        if (inputText.trim()) {
            setMessages([...messages, { id: Date.now().toString(), text: inputText, sentByMe: true }]);
            setInputText('');
        }
    };

    return (
        <SafeAreaView>
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
                    />
                    <SendButton onPress={handleSend}>
                        <ArrowImage source={require('../assets/arrow.png')} />
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
    background-color: ${({sentByMe}) => (sentByMe ? '#fae100' : '#fff')}; /* 내가 보낸 메시지는 노란색, 상대방 메시지는 흰색 */
    padding: 10px;
    border-radius: 20px;
    margin-bottom: 5px;
    align-self: ${({sentByMe}) => (sentByMe ? 'flex-end' : 'flex-start')}; /* 내가 보낸 메시지는 오른쪽, 상대방 메시지는 왼쪽 */
    max-width: 70%; /* 메시지 버블의 최대 너비를 설정하여 화면 폭에 맞게 조절 */
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
`;

const SendButton = styled.TouchableOpacity`
    background-color: ${({ isPressed }) => (isPressed ? '#fff' : '#f4e71d')};
    padding: 10px;
    border-radius: 20px;
`;

const ArrowImage = styled.Image`
    width: 20px;
    height: 20px;
`;
