import React from 'react';
import styled from 'styled-components/native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const CalendarComponent = ({ currentDate, selectedDate, onDayPress, onPressArrowLeft, onPressArrowRight }) => {
    return (
        <CalendarContainer>
            <Calendar
                current={moment(currentDate).format('YYYY-MM-DD')}
                onDayPress={onDayPress}
                markedDates={{
                    [selectedDate]: { selected: true, marked: true, selectedColor: '#191919' },
                }}
                renderHeader={() => null}
                hideArrows={true}
                onPressArrowLeft={onPressArrowLeft}
                onPressArrowRight={onPressArrowRight}
            />
        </CalendarContainer>
    );
};

export default CalendarComponent;

// Styled Components
const CalendarContainer = styled.View`
    flex: 1;
    background-color: white;
`;
