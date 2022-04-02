const db = require('../db/connection');
const format = require('pg-format');

exports.isValidOrder = (order = 'desc') => {
  const validOrder = ['asc', 'desc'];
  if (!validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid sort by order: valid values are 'asc' and 'desc'`,
    });
  }
  return order;
};
