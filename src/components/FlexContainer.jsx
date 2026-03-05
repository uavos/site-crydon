import React from 'react';

const FlexContainer = ({ 
  children, 
  align = 'center', 
  justify = 'space-between', 
  wrap = 'wrap',
  gap = '1rem',
  direction = 'row',
  className = '',
  style = {},
  resetMargins = true, 
  ...props 
}) => {
  const containerStyle = {
    display: 'flex',
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    gap: gap,
    flexDirection: direction,
    ...style
  };

  const renderChildren = () => {
    if (!resetMargins) return children;

    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          style: {
            margin: 0,
            ...child.props.style
          }
        });
      }
      return child;
    });
  };

  return (
    <div 
      className={`flex-container ${className}`}
      style={containerStyle}
      {...props}
    >
      {renderChildren()}
    </div>
  );
};

export default FlexContainer;