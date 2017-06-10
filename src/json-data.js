const fs = require('fs');
const path = require('path');
const root = path.resolve(process.cwd(), 'src', 'stache', 'data');
const reserved = require('reserved-words');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/stache-extras\.module\.ts$/)) {
    return content;
  }

  let files = fs.readdirSync(root);

  if (!files.length) {
    return content;
  }

  let dataObject = files.reduce((acc, file) => {
    const filePath = path.join(root, file);
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let propertyName = convertFileNameToObjectPropertyName(file);

    if (!isPropertyNameValid(propertyName)) {
      console.error(
        `[SKY UX Plugin Error: stache-json-data] A valid Object property could not be determined from file ${filePath}!`
      );
      return acc;
    }

    acc[propertyName] = JSON.parse(fileContent);

    return acc;
  }, { });

  let moduleDirectory = '@blackbaud/stache';
  if (resourcePath.match('/stache2/')) {
    moduleDirectory = './public';
  }

  return `
import {
  STACHE_JSON_DATA_SERVICE_CONFIG_TOKEN,
  STACHE_JSON_DATA_PROVIDERS
} from '${moduleDirectory}';

STACHE_JSON_DATA_PROVIDERS.push({
  provide: STACHE_JSON_DATA_SERVICE_CONFIG_TOKEN,
  useValue: ${JSON.stringify(dataObject)}
});

${content}`;
};

const convertFileNameToObjectPropertyName = (fileName) => {
  return fileName.split('.')[0]
    .toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/_/g, '-')          // Replace all underscores with -
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text;
};

const isPropertyNameValid = (propertyName) => {
  if (!propertyName) {
    return false;
  }

  if (propertyName === 'prototype') {
    return false;
  }

  // Parsing as boolean because reserved-words returns `undefined` for falsy values.
  return !reserved.check(propertyName, 'es6', true);
};

module.exports = { preload };
