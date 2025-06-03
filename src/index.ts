import { PathOrFileDescriptor } from 'fs';
import { ENCODING } from './common/constants';
import { readFile, writeFile } from './util/fileUtils';
import { validateJson } from './util/jsonUtils';
import { getValueFormatByType } from './util/stringUtils';

export type CsvJsonRow = Record<
  string,
  string | number | boolean | (string | number | boolean)[]
>;

export class ConvertCsvToJson {
  printValueFormatByType?: boolean;
  isSupportQuotedField?: boolean;
  delimiter?: string;
  isTrimHeaderFieldWhiteSpace?: boolean;
  _indexHeader?: number;
  parseSubArrayDelimiter?: string;
  parseSubArraySeparator?: string;
  encoding: ENCODING = ENCODING.utf8;

  formatValueByType(active: boolean = true): this {
    this.printValueFormatByType = active;
    return this;
  }

  supportQuotedField(active: boolean = false): this {
    this.isSupportQuotedField = active;
    return this;
  }

  fieldDelimiter(delimiter: string): this {
    this.delimiter = delimiter;
    return this;
  }

  trimHeaderFieldWhiteSpace(active: boolean = false): this {
    this.isTrimHeaderFieldWhiteSpace = active;
    return this;
  }

  indexHeader(indexHeader: number): this {
    if (isNaN(indexHeader)) {
      throw new Error('The index Header must be a Number!');
    }
    this._indexHeader = indexHeader;
    return this;
  }

  parseSubArray(delimiter: string = '*', separator: string = ','): this {
    this.parseSubArrayDelimiter = delimiter;
    this.parseSubArraySeparator = separator;
    return this;
  }

  customEncoding(encoding: ENCODING): this {
    this.encoding = encoding;
    return this;
  }

  utf8Encoding(): this {
    this.encoding = ENCODING.utf8;
    return this;
  }

  ucs2Encoding(): this {
    this.encoding = ENCODING.ucs2;
    return this;
  }

  utf16leEncoding(): this {
    this.encoding = ENCODING.utf16le;
    return this;
  }

  latin1Encoding(): this {
    this.encoding = ENCODING.latin1;
    return this;
  }

  asciiEncoding(): this {
    this.encoding = ENCODING.ascii;
    return this;
  }

  base64Encoding(): this {
    this.encoding = ENCODING.base64;
    return this;
  }

  hexEncoding(): this {
    this.encoding = ENCODING.hex;
    return this;
  }

  generateJsonFileFromCsv(
    fileInputName: PathOrFileDescriptor,
    fileOutputName: string
  ): void {
    const jsonStringified = this.getJsonFromCsvStringified(fileInputName);
    writeFile(jsonStringified, fileOutputName);
  }

  getJsonFromCsvStringified(fileInputName: PathOrFileDescriptor): string {
    const json = this.getJsonFromCsv(fileInputName);
    const jsonStringified = JSON.stringify(json, undefined, 1);

    validateJson(jsonStringified);

    return jsonStringified;
  }

  getJsonFromCsv(fileInputName: PathOrFileDescriptor): CsvJsonRow[] {
    const parsedCsv = readFile(fileInputName, this.encoding);
    return this.csvToJson(parsedCsv);
  }

  csvStringToJson(csvString: string): CsvJsonRow[] {
    return this.csvToJson(csvString);
  }

  csvToJson(parsedCsv: string): CsvJsonRow[] {
    this.validateInputConfig();
    const newLine = /\r?\n/;
    const defaultFieldDelimiter = ',';
    let lines = parsedCsv.split(newLine);
    const fieldDelimiter = this.delimiter || defaultFieldDelimiter;
    let index = this._indexHeader ?? 0;
    let headers: string[] = [];

    lines = lines.filter((line) => line !== undefined && line.trim() !== '');

    if (this.isSupportQuotedField) {
      headers = this.split(lines[index]);
    } else {
      headers = lines[index].split(fieldDelimiter);
    }

    while (headers.length === 0 && index <= lines.length) {
      index = index + 1;
      headers = lines[index].split(fieldDelimiter);
    }

    const jsonResult: CsvJsonRow[] = [];
    for (let i = index + 1; i < lines.length; i++) {
      let currentLine: string[] = [];
      if (this.isSupportQuotedField) {
        currentLine = this.split(lines[i]);
      } else {
        currentLine = lines[i].split(fieldDelimiter);
      }
      if (currentLine.length > 0) {
        jsonResult.push(this.buildJsonResult(headers, currentLine));
      }
    }
    return jsonResult;
  }

  buildJsonResult(headers: string[], currentLine: string[]): CsvJsonRow {
    const jsonObject: CsvJsonRow = {};
    for (let j = 0; j < headers.length; j++) {
      const propertyName = this.isTrimHeaderFieldWhiteSpace
        ? headers[j].replace(/\s/g, '')
        : headers[j].trim();
      let value: string | number | boolean | (string | number | boolean)[] =
        currentLine[j];
      if (
        this.parseSubArrayDelimiter &&
        value &&
        typeof value === 'string' &&
        value.indexOf(this.parseSubArrayDelimiter) === 0 &&
        value.lastIndexOf(this.parseSubArrayDelimiter) === value.length - 1
      ) {
        value = value
          .substring(
            value.indexOf(this.parseSubArrayDelimiter) + 1,
            value.lastIndexOf(this.parseSubArrayDelimiter)
          )
          .trim()
          .split(this.parseSubArraySeparator!);
      }
      if (this.printValueFormatByType && !Array.isArray(value)) {
        value = getValueFormatByType(value);
      }
      jsonObject[propertyName] = value;
    }
    return jsonObject;
  }

  hasQuotes(line: string): boolean {
    return line.includes('"');
  }

  split(line: string): string[] {
    if (line.length == 0) {
      return [];
    }
    const delim = this.delimiter || ',';
    const subSplits: string[] = [''];
    if (this.hasQuotes(line)) {
      const chars = line.split('');
      let subIndex = 0;
      let startQuote = false;
      let isDouble = false;
      chars.forEach((c, i, arr) => {
        if (isDouble) {
          subSplits[subIndex] += c;
          isDouble = false;
          return;
        }
        if (c != '"' && c != delim) {
          subSplits[subIndex] += c;
        } else if (c == delim && startQuote) {
          subSplits[subIndex] += c;
        } else if (c == delim) {
          subIndex++;
          subSplits[subIndex] = '';
          return;
        } else {
          if (arr[i + 1] === '"') {
            isDouble = true;
          } else {
            if (!startQuote) {
              startQuote = true;
            } else {
              startQuote = false;
            }
          }
        }
      });
      if (startQuote) {
        throw new Error('Row contains mismatched quotes!');
      }
      return subSplits;
    } else {
      return line.split(delim);
    }
  }

  validateInputConfig() {
    if (this.isSupportQuotedField) {
      if (this.delimiter === '"') {
        throw new Error(
          'When SupportQuotedFields is enabled you cannot defined the field delimiter as quote -> ["]'
        );
      }
      if (this.parseSubArraySeparator === '"') {
        throw new Error(
          'When SupportQuotedFields is enabled you cannot defined the field parseSubArraySeparator as quote -> ["]'
        );
      }
      if (this.parseSubArrayDelimiter === '"') {
        throw new Error(
          'When SupportQuotedFields is enabled you cannot defined the field parseSubArrayDelimiter as quote -> ["]'
        );
      }
    }
  }

  /**
   * @deprecated Use generateJsonFileFromCsv()
   */
  jsonToCsv(inputFileName: PathOrFileDescriptor, outputFileName: string): void {
    this.generateJsonFileFromCsv(inputFileName, outputFileName);
  }
}

export default new ConvertCsvToJson();
