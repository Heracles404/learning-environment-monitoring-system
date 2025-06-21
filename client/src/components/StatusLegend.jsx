import React from 'react';

const StatusDot = ({ color }) => (
  <span
    style={{
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: color,
      display: 'inline-block',
      marginRight: '8px',
      border: '1px solid #ccc',
    }}
  ></span>
);

const StatusLegend = () => {
  return (
    <div style={{ display: 'flex', gap: '16px',  }}>
      <div style={{ display: 'flex', alignItems: 'center', color: 'green' }}>
        <StatusDot color="green" />
        <span>Active</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', color: 'red' }}>
        <StatusDot color="red" />
        <span>Inactive</span>
      </div>
    </div>
  );
};

export default StatusLegend;