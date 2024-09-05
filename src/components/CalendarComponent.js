import React from 'react';
import styled from 'styled-components/native';
import { Calendar } from 'react-native-calendars';

const CalendarComponent = ({ selectedDate, onDayPress }) => {
    return (
        <CalendarContainer>
            <Calendar
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
                }}
            />
        </CalendarContainer>
    );
};

export default CalendarComponent;

// Styled Components
const CalendarContainer = styled.View`
  flex: 1;
  background-color: #fff;
`;
