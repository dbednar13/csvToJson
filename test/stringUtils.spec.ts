import stringUtils from '../src/util/stringUtils';
import { describe, it, expect } from '@jest/globals';

describe('StringUtils class testing', () => {
  describe('trimPropertyName()', () => {
    it('Should trim input value with empty spaces', () => {
      //given
      const value = ' value ';

      //when
      const result = stringUtils.trimPropertyName(true, value);

      //then
      expect(result).toEqual('value');
    });

    it('Should trim input value without empty spaces', () => {
      //given
      const value = ' val ue ';

      //when
      const result = stringUtils.trimPropertyName(false, value);

      //then
      expect(result).toEqual('val ue');
    });
  });

  describe('getValueFormatByType()', () => {
    it('should return type of Number for integers', () => {
      //given
      const value = '23';

      //when
      const result = stringUtils.getValueFormatByType(value);

      //then
      expect(typeof result).toEqual('number');
      expect(result).toEqual(23);
    });

    it('should return type of Number for non-integers', () => {
      //given
      const value = '0.23';

      //when
      const result = stringUtils.getValueFormatByType(value);

      //then
      expect(typeof result).toEqual('number');
      expect(result).toEqual(0.23);
    });

    it('should return type of String when value contains only words', () => {
      //given
      const value = 'value';

      //when
      const result = stringUtils.getValueFormatByType(value);

      //then
      expect(typeof result).toEqual('string');
      expect(result).toEqual('value');
    });

    it('should return type of String when value contains words and digits', () => {
      //given
      const value = '11value';

      //when
      const result = stringUtils.getValueFormatByType(value);

      //then
      expect(typeof result).toEqual('string');
      expect(result).toEqual('11value');
    });

    it('should return empty value when input value is not defined', () => {
      //given
      const value = undefined;

      //when
      const result = stringUtils.getValueFormatByType(value);

      //then
      expect(typeof result).toEqual('string');
      expect(result).toEqual('');
    });

    it('should return empty value when input value is empty string', () => {
      //given
      const value = '';

      //when
      const result = stringUtils.getValueFormatByType(value);

      //then
      expect(typeof result).toEqual('string');
      expect(result).toEqual('');
    });

    it('should return Boolean value when input value is "true"', () => {
      //given
      const value = 'true';

      //when
      const result = stringUtils.getValueFormatByType(value);

      //then
      expect(typeof result).toEqual('boolean');
      expect(result).toEqual(true);
    });

    it('should return Boolean value when input value is "false"', () => {
      //given
      const value = 'false';

      //when
      const result = stringUtils.getValueFormatByType(value);

      //then
      expect(typeof result).toEqual('boolean');
      expect(result).toEqual(false);
    });
  });
});
