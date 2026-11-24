
// 🌐 Yahan apna backend API URL enter karein:
// export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';



export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";
/**
 * 🔑 Login API Handler
 * @param {Object} credentials - { email, password, rememberMe }
 * @returns {Promise<Object>} API Response
 */

export const loginApi = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};
/**
 * 
 * 
 * 
 * 
 * 📝 Register API Handler
 * @param {Object} userData - { name, email, mobile, password, confirmPassword }
 * @returns {Promise<Object>} API Response
 */

// REGISTER API
export const registerApi = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      mobileNumber: userData.mobile,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return {
    ...data,
    user: data.user || data.data,
  };
};



/**
 * 🚪 Logout API Handler
 * @param {string} token
 * @returns {Promise<Object>} API Response
 */
export const logoutApi = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
};

/**
 * 📧 Forgot Password API Handler
 * @param {string} email
 * @returns {Promise<Object>} API Response
 */
export const forgotPasswordApi = async (email) => {
  throw new Error("Forgot password API is not connected yet.");
};