import React from 'react';
import styled from 'styled-components';
import Header from './Header';
// import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <LayoutWrapper></LayoutWrapper>
      {/* <Footer /> */}
    </div>
  );
};

const LayoutWrapper = styled.div`
  max-width: 1380px;
  margin: 0 auto;
  padding-top: 60px;
`;
export default Layout;
