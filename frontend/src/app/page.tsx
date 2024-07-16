"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setStocks, setSymbol } from '../store/index';
import axios from 'axios';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColDef } from 'ag-grid-community';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stocks, symbol } = useSelector((state: RootState) => state.stocks);
  // console.log({ stocks })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
        dispatch(setStocks(response.data));
        localStorage.setItem('stocks', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, symbol]);

  const handleChangeSymbol = (newSymbol: string) => {
    dispatch(setSymbol(newSymbol));
  };

  const colDefs: ColDef[] = [
    { field: "Coin" },
    { field: "Price" },
    { field: "Market Cap" },
    { field: "Volumn 24" },
    { field: "24h" },
    { field: "Hour" }
  ];


  return (
    <div className="page-container">
      <div className="header">
        <h1>Stock Prices for {symbol}</h1>
        <div className="button-group">
          <button onClick={() => handleChangeSymbol('BTC')}>Bitcoin</button>
          <button onClick={() => handleChangeSymbol('ETH')}>Ethereum</button>
          <button onClick={() => handleChangeSymbol('USDT')}>Tether</button>
          <button onClick={() => handleChangeSymbol('BNB')}>BNB</button>
          <button onClick={() => handleChangeSymbol('SOL')}>Solana</button>
        </div>
      </div>
      <div className="ag-grid-wrapper ag-theme-quartz">
        <div className="ag-grid-container">
          <AgGridReact
            rowData={stocks}
            columnDefs={colDefs}
            domLayout="autoHeight"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
