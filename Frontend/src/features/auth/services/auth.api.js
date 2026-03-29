import axios from "axios";

const api = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: true,
});

/**
 * Registers a new user by sending their details to the backend
 *
 * @async
 * @function register
 * @param {Object} param0 - The user registeration details.
 * @param {string} param0.username - The username of the user.
 * @param {string} param0.email - The email address of the user.
 * @param {string} param0.password - The password for the account.
 * @returns {Promise<Object|undefined>} The response data from the server if successful, or undefined if the error occurs.
 *
 * @throws will log an error to the console if the request fail
 */
export async function register({ username, email, password }) {
  try {
    const response = await api.post(`/api/auth/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Login a user by sending their details to the backend
 *
 * @async
 * @function login
 * @param {Object} param0 - The user login details.
 * @param {string} param0.email - The email address of the user.
 * @param {string} param0.password - The password for the account.
 * @returns {Promise<Object|undefined>} The response data from the server if successful, or undefined if the error occurs.
 *
 * @throws will log an error to the console if the request fail
 */
export async function login({ email, password }) {
  try {
    const response = await api.post(`/api/auth/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Logs out the currently authenticated user by calling the backend API.
 *
 * @async
 * @function logout
 *
 * @returns {Promise<Object|undefined>} The response data from the server if successful,
 * or undefined if an error occurs.
 *
 * @description
 * Sends a GET request to the logout endpoint and includes credentials (cookies)
 * to properly clear the user session on the server.
 *
 * @throws Will log an error to the console if the request fails.
 */
export async function logout() {
  try {
    const response = await api.get(`/api/auth/logout`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getMe() {
  try {
    const response = await api.get(`/api/auth/get-me`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}
