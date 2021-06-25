const fs = require('fs').promises;
const path = require('path');

exports.handler = async function (event, context) {
  try {
    const content = await fs.readFile(path.join(__dirname, 'data.json'), {
      encoding: 'utf-8'
    });
    return {
      statusCode: 200,
      body: content
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e
    };
  }
};