import converter from '../src/index';
import { expect, describe, it } from '@jest/globals';

describe('Encoding testing', () => {
  it('should return an object with latin1 encode decoded', () => {
    //when
    const result = converter
      .latin1Encoding()
      .fieldDelimiter(';')
      .getJsonFromCsv('test/resource/input_latin1_encode.csv');

    //then
    expect(result).not.toBeNull();
    expect(result[0].l_ATC1).toEqual('Système digestif et métabolisme');
  });
});
