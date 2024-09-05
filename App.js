import React, {useState} from 'react';
import styled from 'styled-components/native';
import Header from './src/components/Header';
import Calendar from './src/pages/Calendar';
import Chatting from './src/pages/Chatting';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState('Chatting');

    const handleNavigate = () => {
        setCurrentScreen((prevScreen) => (prevScreen === 'Calendar' ? 'Chatting' : 'Calendar'));
    }
    return (
      <SafeAreaView>
        <Container>
            <Header
                onMenuPress={() => console.log('Menu pressed')}
                onNotificationPress={() => console.log('Notification pressed')}
                onChatPress={handleNavigate} // 전환 함수 전달
                currentScreen={currentScreen} // 현재 화면 상태 전달
            />
            {currentScreen === 'Calendar' ? <Calendar /> : <Chatting />}
        </Container>
      </SafeAreaView>
    );
};

export default App;

const SafeAreaView = styled.SafeAreaView`
    flex: 1;
`;

const Container = styled.View`
    flex: 1;
    padding: 10px;
`;
