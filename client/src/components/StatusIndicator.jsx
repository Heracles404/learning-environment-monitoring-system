import React from 'react';

const StatusIndicator = ({ status }) => {
  const getColor = () => {
    if (status === 'Active') return 'green';
    if (status === 'Inactive') return 'red';
    return 'gray';
  };

  const circleStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: getColor(),
    border: '1px solid #ccc',
    display: 'inline-block',
    marginRight: '8px',
  };

  const textStyle = {
    color: 'white', // 👈 Just the text color
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', color: 'white'}}>
      <span style={circleStyle}></span>
      <span style={textStyle}>{status}</span>
    </div>
  );
};

export default StatusIndicator;