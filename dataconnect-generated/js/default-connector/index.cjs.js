const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'toko-online-nuxt',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

