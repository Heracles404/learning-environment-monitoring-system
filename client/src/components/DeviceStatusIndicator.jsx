import React from 'react';

const DeviceStatusIndicator = ({ status }) => {
  const getColor = () => {
    if (status === 'ACTIVE') return 'green';
    if (status === 'INACTIVE') return 'red';
    return 'gray';
  };

  const circleStyle = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: getColor(),
    border: '1px solid #ccc',
    display: 'inline-block',
  };

  return <span style={circleStyle}></span>;
};

export default DeviceStatusIndicator;