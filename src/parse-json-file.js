const fs = require('fs');
const path = require('path');
const root = path.resolve(process.cwd(), 'src', 'stache', 'data');

const preload = (content, resourcePath) => {
  if (!resourcePath.match(/data.service.ts$/)) {
    return content;
  }

  let files = fs.readdirSync(root);

  let dataObject = files.reduce(function (acc, file) {
    let fileContent = fs.readFileSync(path.join(root, file), 'utf8');
    let fileName = file.split('.')[0];
    acc[fileName] = JSON.parse(fileContent);
    return acc;
  }, {});

  let template = `
import { Injectable } from '@angular/core';

@Injectable()
export class StacheDataService {
  /* tslint:disable */
  private data: any = ${JSON.stringify(dataObject)};
  /* tslint:enable */

  public getAllData(): any[] {
    return this.data;
  }

  public getData(key: string): any {
    return this.data[key];
  }
}
`;

  content = template;


  return content;
};

module.exports = { preload };
