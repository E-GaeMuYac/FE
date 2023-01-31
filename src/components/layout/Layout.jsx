import React from 'react';
import styled from 'styled-components';
import Header from './Header';
// import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <LayoutWrapper>{children}</LayoutWrapper>
    </div>
  );
};

const LayoutWrapper = styled.div`
  max-width: 1380px;
  margin: 0 auto;
  padding-top: 60px;
  @media screen and (max-width: 1700px) {
    max-width: 1024px;
  }
`;
export default Layout;
