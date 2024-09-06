import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import Header from './src/components/Header';
import Calendar from './src/pages/Calendar';
import Chatting from './src/pages/Chatting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('Chatting');
    const [userId, setUserId] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);

    //userId check
    useEffect(() => {
        const checkUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (!storedUserId) {
                    const newUserId = uuidv4({
                        random: Array.from({ length: 16 }, () => Math.floor(Math.random() * 256))
                    });
                    await AsyncStorage.setItem('userId', newUserId);
                    setUserId(newUserId);
                    alert("새 아이디: "+ newUserId);
                } else {
                    setUserId(storedUserId);
                    alert("저장된 아이디: "+ storedUserId);
                }
            } catch (error) {
                alert("에러");
            }
        };

        checkUserId();
    }, []);

    // notice chat
    useEffect(() => {
        const interval = setInterval(async () => {
            const currentDateTime = new Date().toISOString();
            const timeRange = '00:00:30'; // 30초 간격
            await fetchNotifications(currentDateTime, timeRange);
        }, 300000); // 30초 간격

        return () => clearInterval(interval);
    }, []);

    //알림 data 가져오기
    const fetchNotifications = async (currentDateTime, timeRange) => {
        try {
            const response = await axios.get('http://43.203.202.150/schedules/reminder', {
                headers: {
                    member_id: `${userId}`,
                },
                params: {
                    current_date_time: currentDateTime,
                    time_range: timeRange,
                },
            });

            const data = response.data.message;
            if (data) {
                console.log("새 알림: ", data);
                const notificationMessage = { id: Date.now().toString(), text: data, sentByMe: false };

                setChatMessages((prevMessages) => {
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

    const handleNavigate = () => {
        setCurrentScreen((prevScreen) => (prevScreen === 'Calendar' ? 'Chatting' : 'Calendar'));
    };

    const saveMessages = async (newMessages) => {
        try {
            await AsyncStorage.setItem('chatMessages', JSON.stringify(newMessages));
        } catch (error) {
            console.error('Error saving messages:', error);
        }
    };


    return (
      <SafeAreaView currentScreen={currentScreen}>
        <Container>
            <Header
                onMenuPress={() => console.log('Menu pressed')}
                onNotificationPress={() => console.log('Notification pressed')}
                onChatPress={handleNavigate}
                currentScreen={currentScreen}
            />
            {currentScreen === 'Calendar' ? <Calendar /> : <Chatting />}
        </Container>
      </SafeAreaView>
    );
};

export default App;

const SafeAreaView = styled.SafeAreaView`
    flex: 1;
    background-color: ${(props) => props.currentScreen === 'Chatting' ? '#9bbbd4' : 'white'};
`;

const Container = styled.View`
    flex: 1;
    padding: 10px 0 0 0;
`;
