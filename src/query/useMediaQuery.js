import React from 'react';
import { useMediaQuery } from 'react-responsive';

export const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({
    query: '(max-width:768px)',
  });
  return <>{isMobile && children}</>;
};

export const Laptop = ({ children }) => {
  const isLaptop = useMediaQuery({
    query: '(max-width:1700px)',
    // query: '(min-width:1024px) and (max-width:1700px)',
  });
  return <>{isLaptop && children}</>;
};

export const PC = ({ children }) => {
  const isPC = useMediaQuery({
    query: '(min-width:1701px)',
  });
  return <>{isPC && children}</>;
};
