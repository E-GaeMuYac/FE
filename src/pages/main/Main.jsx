import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FirstSection from './FirstSection';
import SecondSection from './SecondSection';
import ThirdSection from './ThirdSection';
import FourthSection from './FourthSection';
import FifthSection from './FifthSection';
import SixthSection from './SixthSection';
const Main = () => {
  const [scrollPoint, setScrollPoint] = useState(0);

  const updateScroll = () => {
    setScrollPoint(window.scrollY || document.documentElement.scrollTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
  }, []);

  return (
    <Wrapper>
      <FirstSection scrollpoint={scrollPoint} />
      <SecondSection />
      <ThirdSection scrollpoint={scrollPoint} />
      <FourthSection scrollpoint={scrollPoint} />
      <FifthSection scrollpoint={scrollPoint} />
      <SixthSection scrollpoint={scrollPoint} />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  /* height: 585vh; */
  display: flex;
  flex-direction: column;
`;
export default Main;
