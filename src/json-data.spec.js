/* node: true */

const plugin = require('./json-data');
const mock = require('mock-fs');

describe('JSON Data Plugin', () => {
  beforeAll(() => {
    mock({
      'src/stache/data': {
        'config.json': '{ "productNameLong": "Stache 2" }',
        'test file.json': '{ "test":"test" }'
      },
      'shared/json-data.service.ts': `private jsonData: any = 'noop';`
    });
  });
  afterAll(() => {
    mock.restore();
  });

  it('should contain a preload hook', () => {
    expect(plugin.preload).toBeDefined();
  });

  it('should not alter the content if the resourcePath is not an html file.', () => {
    const content = 'let foo = "bar";';
    const path = 'foo.js';
    let result = plugin.preload(content, path);
    expect(result).toBe(content);
  });

  it('should add the template reference variable to each <stache> tag', () => {
    const content = '<stache></stache>';
    const path = 'foo.html';
    let result = plugin.preload(content, path);
    expect(result).toBe('<stache #stache=""></stache>');
  });

  it('should not add the attribute if no stache tag exists', () => {
    const content = '<h1>No attribute</h1>';
    const path = 'foo.html';
    let result = plugin.preload(content, path);
    expect(result).toBe(content);
  });

  it('should replace the noop string in the json-data service file with the json data.', () => {
    const content = `private jsonData: any = 'noop';`;
    const contentParsed = `private jsonData: any = {"config":{"productNameLong":"Stache 2"},"test-file":{"test":"test"}};`;
    const path = 'shared/json-data.service.ts';
    let result = plugin.preload(content, path);
    expect(result).toContain(contentParsed);
  });

  it('should create a valid object key given a file name.', () => {
    const content = `private jsonData: any = {"config":{"productNameLong":"Stache 2"},"test-file":{"test":"test"}};`;
    const parsedContent = `private jsonData: any = {"config":{"productNameLong":"Stache 2"},"test-file":{"test":"test"}};`;
    const path = 'shared/json-data.service.ts';
    let result = plugin.preload(content,path);
    expect(result).toContain(parsedContent);
  });
});

describe('JSON Data plugin no files.', () => {
  beforeAll(() => {
    mock({
      'src/stache/data': {
      },
      'shared/json-data.service.ts': `private jsonData: any = 'noop';`
    });
  });
  afterAll(() => {
    mock.restore();
  });

  it('should return the data service file unchanged if no json files exist.', () => {
    const content = `private jsonData: any = 'noop';`;
    const path = 'src/shared/json-data.service.ts';
    let result = plugin.preload(content, path);
    expect(result).toBe(content);
  });
});
