export default {
  default: {
    headers: {
      'Access-Control-Allow-Origin': process.env.APP_ORIGIN,
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    }
  }
};
