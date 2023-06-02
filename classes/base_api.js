import axios from "axios";



/**
 * @class BaseApi - The base class for all API wrappers.
 * @param {string} baseURL - The base URL for the API.
 * @param {Object} headers - The headers for the API.
 */
class BaseApi {
  constructor(baseURL, headers = {}) {
    this.client = axios.create({
      baseURL,
      headers,
    });
  }

  async makeRequest(url, method = 'GET', data = null) {
    try {
      const response = await this.client.request({
        url,
        method,
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default BaseApi; 