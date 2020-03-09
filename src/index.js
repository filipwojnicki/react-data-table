import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';

import Api from './components/Api/ApiComponent';
import Table from './components/Table/Table';

import './main.css';
import * as serviceWorker from './serviceWorker';

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tableRef = useRef();

  const [value, setValue] = useState("");

  return (
    <div className="App">
      <Api setIsLoading={setIsLoading} setCompanies={setCompanies} />
      {isLoading ? (<h1>Loading...</h1>) : (
        <div>
          <input name="search" type="text" value={value} onChange={e => {setValue(e.target.value); tableRef.current.filterCompanies(e);}} placeholder="Filter the result" />
          {companies.hasOwnProperty('timestamp') ? <span>Last time data updated: {new Date(companies.timestamp).toUTCString()}</span> : ''}
          {companies.hasOwnProperty('value') ? <Table companies={companies.value} ref={tableRef} /> : 'No data'}
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
