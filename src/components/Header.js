import React, {useState} from 'react';
import styled from 'styled-components/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const Header = ({ children, style, onMenuPress, onChatPress, onNotificationPress, currentScreen }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        onDateChange(moment(date).format('YYYY-MM-DD'));
        hideDatePicker();
    };

    return (
        <HeaderContainer>
            <HeaderText style={style}>{children}</HeaderText>
            <ButtonContainer>
                <IconButton onPress={onChatPress}>
                    <Icon>{currentScreen === 'Calendar' ? '💬' : '📅'}</Icon>
                </IconButton>
            </ButtonContainer>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </HeaderContainer>
    );
};

export default Header;

// Styled Components
const HeaderContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
`;

const HeaderText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const IconButton = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
`;

const Icon = styled.Text`
  font-size: 18px;
  color: #333;

    /* iOS에서 그림자 */
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-offset: 2px;
    shadow-radius: 2px;

    /* Android에서 그림자 */
    elevation: 3;
`;
