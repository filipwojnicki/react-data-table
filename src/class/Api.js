

export default class Api {
  constructor() {
    this.apiUrl = 'https://recruitment.hal.skygate.io';
  }

  /**
   * Get companies list from api.
   */
  async getCompanies() {
    try{
      let response = await fetch(`${this.apiUrl}/companies`);
      let companies = await response.json();

      if (!companies.length) {
        return [];
      }

      return companies;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /**
   * Get income of current company by id.
   *
   * @param companyId
   */
  async getCurrentCompanyIncomes(companyId) {
    try {
      if(!companyId) {
        return {
          id: companyId,
          incomes: []
        };
      }

      let response = await fetch(`${this.apiUrl}/incomes/${parseInt(companyId, 10)}`);
      let incomes = await response.json();

      if (incomes.hasOwnProperty('id') && incomes.hasOwnProperty('incomes')) {
        if (incomes.incomes.length) {
          return incomes;
        }
      }

      return {
        id: companyId,
        incomes: []
      };

    } catch (e) {
      console.error(e);
      return {
        id: companyId,
        incomes: []
      };
    }
  }
}
