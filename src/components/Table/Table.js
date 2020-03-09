import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react'

/**
 * Table component that hold a table action, generating rows, filter and sort.
 */
const Table = forwardRef((params, ref) => {
  const [companies, setCompanies] = useState([]);
  const [clickCounterObj, setClickCounterObj] = useState({
    id: 0,
    name: 0,
    city: 0,
    total: 0,
    avg: 0,
    lastmonth: 0
  });

  const [companiesFiltered, setCompaniesFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (params.companies.length) {
      let companiesParams = params.companies.sort((prevCompany, company) => prevCompany.id - company.id);

      setCompanies(companiesParams);
      setCompaniesFiltered(companiesParams);
    }
  }, [params.companies]);

  useEffect(() => {
    setPageCount(Math.ceil(companiesFiltered.length / pageLimit));
  }, [companiesFiltered])

  useImperativeHandle(ref, () => ({

    filterCompanies(e) {
      let value = e.target.value;

      if (!companies.length) {
        return;
      }

      setCompaniesFiltered(companies.filter(company => {
        if (company.name.toLowerCase().includes(value.toLowerCase())) {
          return company;
        }

        if (company.city.toLowerCase().includes(value.toLowerCase())) {
          return company;
        }

        if (company.total.toString().includes(value.toLowerCase())) {
          return company;
        }

        if (company.avg.toString().includes(value.toLowerCase())) {
          return company;
        }

        if (company.lastmonth.toString().includes(value.toLowerCase())) {
          return company;
        }
      }));

      setPage(1);
    }

  }));

  const paginate  = (array) => {
    return array.slice((page - 1) * pageLimit, page * pageLimit);
  }

  const generatePagination = () => {
    let paginateObj = [];

    for(let i = 1; i <= pageCount; i++) {
      paginateObj.push(<li key={i} className={(i === page) ? 'active' : ''} onClick={() => setPage(i)}>{i}</li>)
    }

    return paginateObj;
  }

  const generateTable = (company, id) => {
    return (
    <tr key={id}>
      <td>{company.id}</td>
      <td>{company.name}</td>
      <td>{company.city}</td>
      <td>{+company.total.toFixed(2)}</td>
      <td>{+company.avg.toFixed(2)}</td>
      <td>{+company.lastmonth.toFixed(2)}</td>
    </tr>);
  }

  const filterHandler = (keyName) => {
    if (clickCounterObj[keyName] % 2 === 0) {
      // ascending
      companiesFiltered.sort((prevCompany, company) => {
        let prevValue = prevCompany[keyName];
        let value = company[keyName];

        if (typeof prevValue === 'number') {
          return prevValue - value;
        }

        if (typeof prevValue === 'string') {
          return prevValue.localeCompare(value);
        }
      });
    } else {
      // descending
      companiesFiltered.sort((prevCompany, company) => {
        let prevValue = prevCompany[keyName];
        let value = company[keyName];

        if (typeof prevValue === 'number') {
          return value - prevValue;
        }

        if (typeof prevValue === 'string') {
          return value.localeCompare(prevValue);
        }
      });
    }

    setPage(1);
    setClickCounterObj({...clickCounterObj, [keyName]: clickCounterObj[keyName] + 1 });
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => filterHandler('id')}>Id</th>
            <th onClick={() => filterHandler('name')}>Name</th>
            <th onClick={() => filterHandler('city')}>City</th>
            <th onClick={() => filterHandler('total')}>Total Income</th>
            <th onClick={() => filterHandler('avg')}>Averge Income</th>
            <th onClick={() => filterHandler('lastmonth')}>Last Month Income</th>
          </tr>
        </thead>
        <tbody>
          {paginate(companiesFiltered).map(generateTable)}
        </tbody>
      </table>
      {pageCount > 1 ? <ul className="pagination"> {generatePagination()} </ul> : null}
    </div>
  );
});

export default Table;
