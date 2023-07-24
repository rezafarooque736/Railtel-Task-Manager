import jwt_decode from 'jwt-decode';
import axios from 'axios';

const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

if (token !== null) {
  const jwt_decode_data = jwt_decode(token);
  if (jwt_decode_data.exp <= Math.round(Date.now() / 1000)) {
    localStorage.removeItem('REACT_TOKEN_AUTH_KEY');
    alert('Your session has expired , please login again.');
    window.location.reload();
  }
}

// page - addNewTaskButton.jsx, type - post
export const postApiData = async (url, data) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JSON.parse(token)}`,
  };

  try {
    return await axios.post(url, data, { headers: headers });
  } catch (error) {
    console.log(error);
  }
};

// file upload "post" axios api call
export const postApiFileUpload = async (url, FormData) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${JSON.parse(token)}`,
  };

  try {
    return await axios.post(url, FormData, { headers: headers });
  } catch (error) {
    console.log(error);
  }
};

// getApiData , type - get.
export const getApiData = async url => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JSON.parse(token)}`,
  };

  try {
    return await axios.get(url, { headers: headers });
  } catch (error) {
    console.log(error);
  }
};

// getApiData , type - get.
export const getAuthApiData = async url => {
  try {
    return await axios.get(url);
  } catch (error) {
    console.log(error);
  }
};

// for login & signup , type - post.
export const postAuthApiData = async (url, data) => {
  try {
    return await axios.post(url, data);
  } catch (error) {
    console.log(error);
  }
};

// for forgotpassword & resetPassword, type - put.
export const putAuthApiData = async (url, data) => {
  try {
    return await axios.put(url, data);
  } catch (error) {
    console.log(error);
  }
};

//
export const putApiData = async (url, data) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JSON.parse(token)}`,
  };

  try {
    return await axios.put(url, data, { headers: headers });
  } catch (error) {
    console.log(error);
  }
};

export const deleteApiData = async url => {
  const headers = {
    Authorization: `Bearer ${JSON.parse(token)}`,
  };

  try {
    return await axios.delete(url, { headers: headers });
  } catch (error) {
    console.log(error);
  }
};
