import React from 'react';
import { Line } from 'react-chartjs-2';

export default function Chart(props) {
  return (
    <div>
      <Line 
        data={{
          labels: props.labels,
          datasets: [
            {
              label: 'Networth Over Time',
              data: props.data,
            }
          ]
        }}
      />
    </div>
  );
};