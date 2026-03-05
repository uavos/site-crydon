import React from 'react';
import Card from './Card';

const Cards = ({ children, num = 2 }) => {
  return (
    <div className={`custom-cards custom-cards-${num}`}>
      {children}
    </div>
  );
};

export default Cards;