import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import Header from './src/components/Header';
import Calendar from './src/pages/Calendar';
import Chatting from './src/pages/Chatting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('Chatting');
    const [userId, setUserId] = useState(null);

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
                    //alert("새 아이디: "+ newUserId);
                } else {
                    setUserId(storedUserId);
                    //alert("저장된 아이디: "+ storedUserId);
                }
            } catch (error) {
                alert("에러");
            }
        };

        checkUserId();
    }, []);

    const handleNavigate = () => {
        setCurrentScreen((prevScreen) => (prevScreen === 'Calendar' ? 'Chatting' : 'Calendar'));
    };

    return (
        <SafeAreaProvider>
              <SafeAreaView currentScreen={currentScreen}>
                <Container>
                    <Header
                        onMenuPress={() => console.log('Menu pressed')}
                        onNotificationPress={() => console.log('Notification pressed')}
                        onChatPress={handleNavigate}
                        currentScreen={currentScreen}
                    />
                    {currentScreen === 'Calendar' ? <Calendar /> : <Chatting userId={userId} />}
                </Container>
              </SafeAreaView>
        </SafeAreaProvider>
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
