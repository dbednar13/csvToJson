import converter from '../src/index';
import { describe, it, beforeEach, afterEach, expect } from '@jest/globals';

const fileInputName = 'test/resource/input.csv';

describe('API testing', () => {
  describe('getJsonFromCsv() testing', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let expectedJson: any[];
    beforeEach(() => {
      expectedJson = [
        {
          firstName: 'Constantin',
          lastName: 'Langsdon',
          email: 'clangsdon0@hc360.com',
          gender: 'Male',
          age: '96',
          birth: '10.02.1965',
          zip: '123',
          registered: 'true',
        },
        {
          firstName: 'Norah',
          lastName: 'Raison',
          email: 'nraison1@wired.com',
          gender: 'Female',
          age: '32.5',
          birth: '10.05.2000',
          zip: '',
          registered: 'false',
        },
      ];
    });
    it('should return json array', () => {
      //when
      const result = converter.getJsonFromCsv(fileInputName);
      //then
      expect(result.length).toEqual(expectedJson.length);
      expect(result).toEqual(expectedJson);
    });

    afterEach(() => {
      converter.formatValueByType(false);
    });

    it('should return json array that contains the same property of the csv header', () => {
      const headers = [
        'firstName',
        'lastName',
        'email',
        'gender',
        'age',
        'birth',
        'zip',
        'registered',
      ];
      const result = converter.getJsonFromCsv(fileInputName);
      const resultHeaders = Object.keys(result[0]);
      expect(result).not.toBeNull();
      expect(resultHeaders).toEqual(headers);
    });

    it('should not remove empty spaces from header field', () => {
      const headers = [
        'first Name',
        'last Name',
        'email',
        'gender',
        'age',
        'birth',
      ];
      const result = converter
        .trimHeaderFieldWhiteSpace(false)
        .getJsonFromCsv('test/resource/input_header_with_empty_spaces.csv');
      const resultHeaders = Object.keys(result[0]);
      expect(result).not.toBeNull();
      expect(resultHeaders).toEqual(headers);
    });

    it('should remove empty spaces from header field', () => {
      const headers = [
        'firstName',
        'lastName',
        'email',
        'gender',
        'age',
        'birth',
      ];
      const result = converter
        .trimHeaderFieldWhiteSpace(true)
        .getJsonFromCsv('test/resource/input_header_with_empty_spaces.csv');
      const resultHeaders = Object.keys(result[0]);
      expect(result).not.toBeNull();
      expect(resultHeaders).toEqual(headers);
    });

    it('should return json array from csv with tilde as field delimiter', () => {
      const result = converter
        .fieldDelimiter('~')
        .getJsonFromCsv('test/resource/input_tilde_delimiter.csv');
      expect(result.length).toEqual(expectedJson.length);
      expect(result).toEqual(expectedJson);
    });

    it('should return json array with subArray', () => {
      const expectedResult = [
        {
          firstName: 'Constantin',
          lastName: 'Langsdon',
          email: 'clangsdon0@hc360.com',
          gender: 'Male',
          age: '96',
          birth: '10.02.1965',
          sons: ['anto', 'diego', 'hamsik'],
        },
        {
          firstName: 'Constantin',
          lastName: 'Langsdon',
          email: 'clangsdon0@hc360.com',
          gender: 'Male',
          age: '96',
          birth: '10.02.1965',
          sons: ['12', '10', '13'],
        },
      ];
      const result = converter
        .parseSubArray('*', ';')
        .fieldDelimiter(',')
        .getJsonFromCsv('test/resource/input_example_sub_array.csv');
      expect(result.length).toEqual(2);
      expect(result[0].sons).toEqual(expectedResult[0].sons);
      expect(result[1].sons).toEqual(expectedResult[1].sons);
    });

    it('should return json array with subArray both formatted by type', () => {
      const expectedResult = [
        {
          firstName: 'Constantin',
          lastName: 'Langsdon',
          email: 'clangsdon0@hc360.com',
          gender: 'Male',
          age: '96',
          birth: '10.02.1965',
          sons: ['anto', 'diego', 'hamsik'],
        },
        {
          firstName: 'Constantin',
          lastName: 'Langsdon',
          email: 'clangsdon0@hc360.com',
          gender: 'Male',
          age: '96',
          birth: '10.02.1965',
          sons: [12, 10, 13],
        },
      ];
      const result = converter
        .parseSubArray('*', ';')
        .fieldDelimiter(',')
        .formatValueByType()
        .getJsonFromCsv('test/resource/input_example_sub_array.csv');
      expect(result.length).toEqual(2);
      expect(result[0].sons).toEqual(expectedResult[0].sons);
    });

    it('should return json array with value formatted by type', () => {
      expectedJson[0].age = 96;
      expectedJson[0].zip = 123;
      expectedJson[1].age = 32.5;
      expectedJson[0].registered = true;
      expectedJson[1].registered = false;
      const result = converter
        .formatValueByType()
        .fieldDelimiter(',')
        .getJsonFromCsv(fileInputName);
      expect(result.length).toEqual(expectedJson.length);
      expect(result).toEqual(expectedJson);
    });

    it('should return json array when file contains empty rows', () => {
      const result = converter
        .fieldDelimiter(',')
        .getJsonFromCsv(
          'test/resource/input_with_empty_row_at_the_beginning.csv'
        );
      expect(result.length).toEqual(expectedJson.length);
      expect(result).toEqual(expectedJson);
    });

    it('should return json array header is not the first line', () => {
      const result = converter
        .fieldDelimiter(',')
        .indexHeader(5)
        .getJsonFromCsv('test/resource/input_with_header_not_first_line.csv');
      expect(result.length).toEqual(expectedJson.length);
      expect(result).toEqual(expectedJson);
    });
  });

  describe('Input config testing', () => {
    beforeEach(() => {
      converter.supportQuotedField(false);
      converter.fieldDelimiter(',');
    });

    it('should throw error when isSupportQuotedField active and fieldDelimiter is equal to "', () => {
      expect(() => {
        converter
          .supportQuotedField(true)
          .fieldDelimiter('"')
          .getJsonFromCsv(fileInputName);
      }).toThrow(
        'When SupportQuotedFields is enabled you cannot defined the field delimiter as quote -> ["]'
      );
    });
    it('should throw error when parseSubArrayDelimiter active and fieldDelimiter is equal to "', () => {
      expect(() => {
        converter
          .supportQuotedField(true)
          .parseSubArray('"', ';')
          .getJsonFromCsv(fileInputName);
      }).toThrow(
        'When SupportQuotedFields is enabled you cannot defined the field parseSubArrayDelimiter as quote -> ["]'
      );
    });

    it('should throw error when parseSubArraySeparator active and parseSubArraySeparator is equal to "', () => {
      expect(() => {
        converter
          .supportQuotedField(true)
          .parseSubArray('*', '"')
          .getJsonFromCsv(fileInputName);
      }).toThrow(
        'When SupportQuotedFields is enabled you cannot defined the field parseSubArraySeparator as quote -> ["]'
      );
    });
  });
});
