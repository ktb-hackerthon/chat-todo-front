import React from 'react';
import styled from 'styled-components/native';

const Header = ({ children, style }) => {
    return <HeaderText style={style}>{children}</HeaderText>;
};

export default Header;

// Styled Components
const HeaderText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;
