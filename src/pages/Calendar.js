import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import CalendarComponent from '../components/CalendarComponent';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [slideAnim] = useState(new Animated.Value(0));

    const [openYear, setOpenYear] = useState(false);
    const [openMonth, setOpenMonth] = useState(false);
    const [openDay, setOpenDay] = useState(false);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

    useEffect(() => {
    }, [currentDate, selectedDate]);

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

    const handlePrevMonth = () => {
        setCurrentDate(moment(currentDate).subtract(1, 'months').toDate());
    };

    const handleNextMonth = () => {
        setCurrentDate(moment(currentDate).add(1, 'months').toDate());
    };

    const handleDateChange = () => {
        const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
        setSelectedDate(moment(date).format('YYYY-MM-DD'));
        setCurrentDate(date);
        hideDatePicker();
    };

    const handleTodayPress = () => {
        const today = new Date();
        setSelectedDate(today.toISOString().split('T')[0]);
        setCurrentDate(today);
        setSelectedYear(today.getFullYear());
        setSelectedMonth(today.getMonth() + 1);
        setSelectedDay(today.getDate());
        hideDatePicker();
    };

    const animatePopup = (toValue) => {
        Animated.timing(slideAnim, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
        animatePopup(1); // 팝업을 화면의 50% 높이까지 올림
    };

    const hideDatePicker = () => {
        animatePopup(0); // 팝업을 숨김
        setTimeout(() => setDatePickerVisibility(false), 300); // 애니메이션이 끝난 후 상태 업데이트
    };

    return (
        <SafeAreaView>
            <Container>
                <HeaderContainer>
                    <Header>
                        {moment(currentDate).format('MMM YYYY')}
                    </Header>
                    <ButtonContainer>
                        <NavButton onPress={handlePrevMonth}>
                            <NavButtonText>{'<'}</NavButtonText>
                        </NavButton>
                        <NavButton onPress={showDatePicker}>
                            <NavButtonText>{'📅'}</NavButtonText>
                        </NavButton>
                        <NavButton onPress={handleNextMonth}>
                            <NavButtonText>{'>'}</NavButtonText>
                        </NavButton>
                    </ButtonContainer>
                </HeaderContainer>
                <CalendarComponent
                    key={currentDate}
                    currentDate={currentDate}
                    selectedDate={selectedDate}
                    onDayPress={handleDayPress}
                    onPressArrowLeft={handlePrevMonth}
                    onPressArrowRight={handleNextMonth}
                />
                <ViewDetail>
                    <DateDetails>
                        <DateText>Selected Date: {selectedDate}</DateText>
                        {/* 여기에 일정 컴포넌트 추가 */}
                    </DateDetails>
                </ViewDetail>
                {isDatePickerVisible && (
                    <AnimatedPopupView
                        style={{
                            transform: [{
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [300, 0]
                                }),
                            }],
                        }}
                    >
                        <PickerContainer>
                            <StyledDropDownPicker
                                open={openYear}
                                value={selectedYear}
                                items={Array.from({ length: 50 }, (_, i) => ({ label: `${2020 + i}`, value: 2020 + i }))}
                                setOpen={setOpenYear}
                                setValue={setSelectedYear}
                                placeholder="Select Year"
                                zIndex={3000}
                            />
                            <StyledDropDownPicker
                                open={openMonth}
                                value={selectedMonth}
                                items={Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))}
                                setOpen={setOpenMonth}
                                setValue={setSelectedMonth}
                                placeholder="Select Month"
                                zIndex={2000}
                            />
                            <StyledDropDownPicker
                                open={openDay}
                                value={selectedDay}
                                items={Array.from({ length: 31 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))}
                                setOpen={setOpenDay}
                                setValue={setSelectedDay}
                                placeholder="Select Day"
                                zIndex={1000}
                            />
                        </PickerContainer>
                        <DatePickerButton onPress={handleTodayPress}>
                            <DatePickerButtonText>Today</DatePickerButtonText>
                        </DatePickerButton>
                        <DatePickerButton onPress={handleDateChange}>
                            <DatePickerButtonText>Set Date</DatePickerButtonText>
                        </DatePickerButton>
                        <DatePickerButton onPress={hideDatePicker}>
                            <DatePickerButtonText>Close</DatePickerButtonText>
                        </DatePickerButton>
                    </AnimatedPopupView>
                )}
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
    padding: 20px 20px 0 20px;
    flex: 1;
`;

const HeaderContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const Header = styled.Text`
    font-size: 24px;
    font-weight: bold;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
`;

const NavButton = styled.TouchableOpacity`
    margin-left: 10px;
`;

const NavButtonText = styled.Text`
    font-size: 24px;
    font-weight: bold;
`;

const ViewDetail = styled.View`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50%;
    background-color: #fae100;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    padding: 20px 20px 0 20px;
    shadow-color: #000;
    shadow-offset: 0px -2px;
    shadow-opacity: 0.3;
    shadow-radius: 4px;
    elevation: 5;
`

const AnimatedPopupView = styled(Animated.View)`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50%;
    background-color: white;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    padding: 20px 20px 0 20px;
    shadow-color: #000;
    shadow-offset: 0px -2px;
    shadow-opacity: 0.3;
    shadow-radius: 4px;
    elevation: 5;
`;

const DateDetails = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const DateText = styled.Text`
    font-size: 18px;
    font-weight: bold;
`;

const PickerContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
    z-index: 4000;
`;

const StyledDropDownPicker = styled(DropDownPicker).attrs(props => ({
    containerStyle: {
        width: 100,
    },
    style: {
        marginRight: 10,
    },
    dropDownContainerStyle: {
        zIndex: props.zIndex,
        elevation: 3, // 드롭다운 리스트의 elevation 설정
    },
}))``;

const DatePickerButton = styled.TouchableOpacity`
    background-color: #333;
    padding: 10px;
    border-radius: 5px;
    margin-top: 20px;
`;

const DatePickerButtonText = styled.Text`
    color: #fff;
    text-align: center;
    font-size: 16px;
`;

