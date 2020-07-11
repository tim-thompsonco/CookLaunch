import axios from 'axios';
import isEmpty from 'is-empty';
import cookies from 'js-cookie';
import {REQUEST_SUCCESS, REQUEST_FAIL} from './types';

// Get user profile
export const getUserData = async () => {
  try {
    const token = cookies.get('user');
    const response = await axios.get('/api/user/profile', {
      headers: {
        Authorization: token,
      },
    });

    if (response.data.message === REQUEST_SUCCESS) {
      return {
        authResponseType: REQUEST_SUCCESS,
        authResponsePayload: response.data.payload,
      };
    } else {
      return {
        authResponseType: REQUEST_FAIL,
        authResponsePayload: response.data.message,
      };
    }
  } catch (err) {
    return {
      authResponseType: REQUEST_FAIL,
      authResponsePayload: err,
    };
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  let error;

  let firstName = userData.firstName;
  let lastName = userData.lastName;
  let email = userData.email;

  // Check to see if values are empty, and if so, convert them to empty strings
  firstName = !isEmpty(firstName) ? firstName : '';
  lastName = !isEmpty(lastName) ? lastName : '';
  email = !isEmpty(email) ? email : '';

  // Check for valid first name
  if (isEmpty(firstName)) {
    error = 'Please enter a first name.';
  }

  // Check for valid last name
  if (isEmpty(lastName)) {
    error = 'Please enter a last name.';
  }

  // Check for valid email
  if (isEmpty(email)) {
    error = 'Please enter an email.';
  }

  if (!isEmpty(error)) {
    return {
      authResponseType: REQUEST_FAIL,
      authResponsePayload: error,
    };
  } else {
    try {
      const token = cookies.get('user');
      const response = await axios.put('/api/user/profile', userData, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        return {
          authResponseType: REQUEST_SUCCESS,
          authResponsePayload: response.data,
        };
      } else {
        return {
          authResponseType: REQUEST_FAIL,
          authResponsePayload: response.data,
        };
      }
    } catch (err) {
      return {
        authResponseType: REQUEST_FAIL,
        authResponsePayload: isEmpty(err.response.data)
          ? 'An error has occurred. Please try again.'
          : err.response.data,
      };
    }
  }
};