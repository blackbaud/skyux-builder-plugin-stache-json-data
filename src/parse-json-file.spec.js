/* node: true */
//
// const plugin = require('./data');
// const mock = require('mock-fs');
//
// describe('Include Plugin', () => {
//   beforeAll(() => {
//     mock({
//       'src/stache/includes': {
//         'test.html': '<h1>Test</h1>'
//       }
//     });
//   });
//   afterAll(() => {
//     mock.restore();
//   });
//
//   it('should contain a preload hook', () => {
//     expect(plugin.preload).toBeDefined();
//   });
//
//   it('should not alter the content if the resourcePath is not an html file.', () => {
//     const content = 'let foo = "bar";';
//     const path = 'foo.js';
//     let result = plugin.preload(content, path);
//     expect(result).toBe(content);
//   });
//
//   it('should not alter the content if the html file does not include any <stache include> tags.', () => {
//     const content = '<p></p>';
//     const path = 'foo.html';
//     let result = plugin.preload(content, path);
//     expect(result).toBe(content);
//   });
//
//   it('should convert the inner HTML of all <stache-include> to the referenced file.', () => {
//     const content = `
//       <stache-include fileName="test.html">
//       </stache-include>
//     `;
//     const path = 'foo.html';
//     let result = plugin.preload(content, path);
//     expect(result).toContain(`<stache-include fileName="test.html"><h1>Test</h1></stache-include>`);
//   });
//
//   it('should throw an error if the file is not found.', () => {
//     const content = `
//       <stache-include fileName="error.html">
//       </stache-include>
//     `;
//     const path = 'foo.html';
//     let result = function () {
//       return plugin.preload(content,path);
//     }
//     expect(result).toThrow();
//   });
// });
