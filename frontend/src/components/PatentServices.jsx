import React from 'react'

// services/patentService.js
const axios = require('axios');

const PatentServices = async (patentNumber) => {
  try {
    const response = await axios.get(
      `https://developer.uspto.gov/ibd-api/v1/application/patent/${patentNumber}`
    );
    return response.data;
  } catch (error) {
    console.error('USPTO API error:', error);
    return null;
  }
};

export default PatentServices
