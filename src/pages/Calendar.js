import React, { useState } from 'react';
import styled from 'styled-components/native';
import CalendarComponent from '../components/CalendarComponent';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const currentYear = new Date().getFullYear();

    return (
        <SafeAreaView>
            <Container>
                <Header>{currentYear}</Header>
                <CalendarComponent
                    selectedDate={selectedDate}
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                />
                <SelectedDateContainer>
                    <SelectedDateText>Selected Date: {selectedDate}</SelectedDateText>
                </SelectedDateContainer>
            </Container>
        </SafeAreaView>
    );
};

export default Calendar;

// Styled Components
const SafeAreaView = styled.SafeAreaView`
    flex: 1;
`;

const Container = styled.View`
    padding: 20px;
    height: 500px;
`;

const Header = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const SelectedDateContainer = styled.View`
    margin-top: 20px;
    align-items: center;
`;

const SelectedDateText = styled.Text`
    font-size: 18px;
    color: #333;
`;
