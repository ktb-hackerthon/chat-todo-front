import React from 'react';
import styled from 'styled-components/native';

// 임시로 사용하는 Icon 컴포넌트
const Icon = styled.Text`
  font-size: 18px;
  color: #333;
`;

const Header = ({ children, style, onMenuPress, onChatPress, onNotificationPress, currentScreen }) => {
    return (
        <HeaderContainer>
            <IconButton onPress={onMenuPress}>
                <Icon>≡</Icon>
            </IconButton>
            <HeaderText style={style}>{children}</HeaderText>
            <ButtonContainer>
                <IconButton onPress={onNotificationPress}>
                    <Icon>🔔</Icon>
                </IconButton>
                <IconButton onPress={onChatPress}>
                    <Icon>{currentScreen === 'Calendar' ? '💬' : '📅'}</Icon>
                </IconButton>
            </ButtonContainer>
        </HeaderContainer>
    );
};

export default Header;

// Styled Components
const HeaderContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
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
