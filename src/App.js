import React, { useEffect, useState, useRef } from 'react';
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
        setState({ BTC_CAD_rate: response.data.BTC_CAD, ETH_CAD_rate: response.data.ETH_CAD}); // get currency rate

        axios.get('https://shakepay.github.io/programming-exercise/web/transaction_history.json')
        .then(response => {
          let networth = 0; 
          response.data.reverse().forEach((element, idx) => {
            if (element.type !== 'conversion') {
              labels.push(moment(element.createdAt).format('YYYY-MM-DD'));

              // Couldn't get the correct way to push to array using setState method but here's what I tried below 
              // const labelsCopy = state.labels;
              // labelsCopy.push(moment(element.createdAt).format('YYYY-MM-DD'))
              // setState(prev => ({...prev, labels: labelsCopy}))
              // const labelsCopy = state.labels.concat([moment(element.createdAt).format('YYYY-MM-DD')])
              // setState(prev => ({labels: [...prev.labels, moment(element.createdAt).format('YYYY-MM-DD')]}))

              if (idx === 0 ) {
                networth += element.amount; 
              } else if (element.direction === 'credit') { // Adds amount to networth
                if (element.currency === 'BTC') {
                  networth += element.amount * state.BTC_CAD_rate; // calculate BTC to CAD 
                } else if (element.currency === 'ETH') {
                  networth += element.amount * state.ETH_CAD_rate; // calculate ETH to CAD
                } else if (element.currency === 'CAD') {
                  networth += element.amount; 
                }
              } else if (element.direction === 'debit') { // Deducts amount from networth
                if (element.currency === 'BTC') {
                  networth -= element.amount * state.BTC_CAD_rate; // calculate BTC to CAD 
                } else if (element.currency === 'ETH') {
                  networth -= element.amount * state.ETH_CAD_rate; // calculate ETH to CAD 
                } else if (element.currency === 'CAD') {
                  networth -= element.amount;
                }
              }
              data.push(networth);

              // Couldn't get the correct way to push to array using setState method but here's what I tried below 
              // const dataCopy = state.data;
              // dataCopy.push(networth)
              // setState(prev => ({...prev, data: dataCopy}))
            }
          })

          // ended up using setState here when all data is collecte
          setState({ labels: labels, data: data})
        })
        .catch(err => {
          console.log(err);
        })

      })
    .catch(err => {
      console.log(err);
    })
  }, []);

  return (
    <div className="App">
        <Chart 
          labels={state.labels}
          data={state.data}
        />
    </div>
  );
}

export default App;
