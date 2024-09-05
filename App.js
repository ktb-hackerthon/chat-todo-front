import React from 'react';
import styled from 'styled-components/native';
import Header from './src/components/Header';
import Calendar from './src/pages/Calendar';

const App = () => {
  return (
      <SafeAreaView>
        <Container>
            <Header>이거는 제목!!!!</Header>
            <Calendar/>
        </Container>
      </SafeAreaView>
  );
};

export default App;

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
`;

const Container = styled.View`
  padding: 20px;
`;
