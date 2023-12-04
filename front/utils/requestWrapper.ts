import axios from "axios";

/**
 * Get the API endpoint based on environment
 * @returns The API endpoint
 */
export const getAPIEndpoint = () => {
  // If app is built in development, use dev environment
  if (process.env.NODE_ENV == "development") {
    return "http://localhost:8000";
  } else {
    // If app is built in production, use prod environment
    return "https://squid-app-znkgm.ondigitalocean.app";
  }
};

/**
 * Wrapper function to perform a GET request to API
 * @param endpoint the endpoint to call
 * @returns the response
 */
export const apiGET = async (endpoint: string): Promise<any> => {
  const API = getAPIEndpoint();
  const route = `${API}${endpoint}`;
  return axios
    .get(route)
    .then((response) => Promise.resolve(response.data))
    .catch((error) => {
      return Promise.reject(error);
    });
};

/**
 * Wrapper function to perform a POST request to API
 * @param endpoint the endpoint to call
 * @param payload the payload to send
 * @returns the response
 */
export const apiPOST = async (endpoint: string, payload: any): Promise<any> => {
  const API = getAPIEndpoint();
  const route = `${API}${endpoint}`;
  return axios
    .post(route, payload)
    .then((response) => Promise.resolve(response.data))
    .catch((error) => {
      return Promise.reject(error);
    });
};
