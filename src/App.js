import React, { useEffect, useState } from 'react';
import moment from 'moment';

import './App.css';

import Chart from './components/Chart';

const axios = require('axios');

function App() {
  let data = [];
  let labels = [];

  const [state, setState] = useState({
    data: [],
    labels: [],
    BTC_CAD_rate: null,
    ETH_CAD_rate: null,
  })

  useEffect(() => {
    axios.get('https://cors-anywhere.herokuapp.com/https://api.shakepay.co/rates')
      .then(response => {
        // BTC_CAD_rate = response.data.BTC_CAD;
        // ETH_CAD_rate = response.data.ETH_CAD;
        setState({ BTC_CAD_rate: response.data.BTC_CAD, ETH_CAD_rate: response.data.ETH_CAD})

        axios.get('https://shakepay.github.io/programming-exercise/web/transaction_history.json')
        .then(response => {
          let networth = 0; 
          response.data.reverse().forEach((element, idx) => {
            if (element.type !== 'conversion') {
              labels.push(moment(element.createdAt).format('YYYY-MM-DD'))

              if (idx === 0 ) {
                networth += element.amount;
              } else if (element.direction === 'credit') {
                if (element.currency === 'BTC') {
                  networth += element.amount * state.BTC_CAD_rate;
                } else if (element.currency === 'ETH') {
                  networth += element.amount * state.ETH_CAD_rate;
                } else if (element.currency === 'CAD') {
                  networth += element.amount;
                }
              } else if (element.direction === 'debit') {
                if (element.currency === 'BTC') {
                  networth -= element.amount * state.BTC_CAD_rate;
                } else if (element.currency === 'ETH') {
                  networth -= element.amount * state.ETH_CAD_rate;
                } else if (element.currency === 'CAD') {
                  networth -= element.amount;
                }
              }
              data.push(networth);
            }
          })
        })

      })
    .catch(err => {
      console.log(err)
    })
  }, []);

  return (
    <div className="App">
        <Chart 
          labels={labels}
          data={data}
        />
    </div>
  );
}

export default App;
