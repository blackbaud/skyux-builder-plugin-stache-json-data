const fs = require('fs');
const path = require('path');
const root = path.resolve(process.cwd(), 'src', 'stache', 'data');
const cheerio = require('cheerio');

// Adds directive and template reference variable to stache tag:
// <stache #stache="jsonData" stacheJsonData></stache>
function addTemplateReferenceVariable(content) {
  let $ = cheerio.load(content, {
    lowerCaseTags: false,
    lowerCaseAttributeNames: false,
    decodeEntities: false
  });

  let stacheTags = $('stache');

  if (stacheTags.length) {
    stacheTags.each(function () {
      $(this)
        .attr('stacheJsonData', '')
        .attr('#stache', 'jsonData');
    });

    content = $.html().toString();
  }

  return content;
}

const preload = (content, resourcePath) => {
  if (resourcePath.match(/\.html$/)) {
    return addTemplateReferenceVariable(content);
  }

  if (!resourcePath.match(/src\/modules\/json-data\/json-data\.service\.ts$/)) {
    return content;
  }

  let files = fs.readdirSync(root);

  let dataObject = files.reduce((acc, file) => {
    let fileContent = fs.readFileSync(path.join(root, file), 'utf8');
    let fileName = file.split('.')[0];
    acc[fileName] = JSON.parse(fileContent);
    return acc;
  }, {});

  content = content.replace(`'noop'`, JSON.stringify(dataObject));

  return content;
};

module.exports = { preload };
