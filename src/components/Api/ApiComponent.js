import React, { useEffect, useState } from "react";
import Api from '../../class/Api';

/**
 * Component that init on load. Cares that all data is loaded from api before table rendered.
 *
 * @param params
 */
export default function ApiComponent(params) {
  const api = new Api();

  useEffect(() => {
    /**
     * Function to get basic array of companies. Checks for old data saved to session storage thats not older than 10 minutes.
     */
    const getCompanies = async () => {
      let tempCompanies = sessionStorage.getItem('companies');
      if (tempCompanies) {
        tempCompanies = JSON.parse(tempCompanies);

        if (tempCompanies.hasOwnProperty('value') && tempCompanies.hasOwnProperty('timestamp')) {
          const now = new Date().getTime();
          const minutesDiff = (now - tempCompanies.timestamp) / 1000 / 60;

          if (tempCompanies.value.length && minutesDiff < 10) {
            params.setCompanies(tempCompanies);
            params.setIsLoading(false);
            return;
          }
        }
      }

      const companies = await api.getCompanies();
      await updateCompaniesIncomes(companies);
    };

    /**
     * Function to merge basic companies with they're incomes. On the basis of incomes
     * it computes total income sum, last month sum and average of total income.
     * Cache data in session storage.
     *
     * @param companies
     */
    const updateCompaniesIncomes = async (companies) => {
      if (!companies.length) {
        params.setCompanies({value: [], timestamp: new Date().getTime()});
        params.setIsLoading(false);
        return;
      }

      let companyPromises = [];

      for(let company of companies) {
        companyPromises.push(api.getCurrentCompanyIncomes(company.id))
      }

      let responses = await Promise.all(companyPromises).catch(error => console.error(error));

      const prevMonthFirstDay = new Date(new Date().setDate(0)).setDate(1);
      const prevMonthLastDay = new Date().setDate(0);

      companies = companies.map(company => {
        for (let companyResponse of responses) {
          if (company.id === companyResponse.id) {
            Object.assign(company, companyResponse);
          }
        }

        if(company.incomes.length) {
          let total = company.incomes.reduce((a, b) => a + (Number(b.value) || 0), 0);

          company.total = total;
          company.avg = total / company.incomes.length;
          company.lastmonth = company.incomes.filter(inc => {
            let date = new Date(inc.date);
            if (date >= prevMonthFirstDay && date <= prevMonthLastDay) {
              return inc;
            }
          }).reduce((a, b) => a + (Number(b.value) || 0), 0);
        } else {
          company.total = 0;
          company.avg = 0;
          company.lastmonth = 0;
        }

        return company;
      });

      let storageData = {
        value: companies,
        timestamp: new Date().getTime()
      };
      sessionStorage.setItem('companies', JSON.stringify(storageData));

      params.setCompanies(storageData);
      params.setIsLoading(false);
    };

    getCompanies();
  }, []);

  return(null);

}
