import converter from '../src/index';

// ...existing code...
describe('API testing quoted fields', () => {
  afterEach(() => {
    converter.formatValueByType(false);
    converter.supportQuotedField(false);
  });

  it('should handle quoted fields', () => {
    const result = converter
      .fieldDelimiter(',')
      .supportQuotedField(true)
      .getJsonFromCsv('test/resource/input_quoted_fields.csv');

    const first = result[0];
    expect(first.lastName).toEqual('Langsdon,Langsdon');

    const second = result[1];
    expect(second.gender).toEqual('Female" ');

    const third = result[2];
    expect(third.lastName).toEqual(',Taborre');
  });

  it('should handle quoted fields', () => {
    const result = converter
      .fieldDelimiter(',')
      .getJsonFromCsv('test/resource/input_quoted_fields.csv');

    const first = result[0];
    expect(first.lastName).toEqual('"Langsdon');

    const second = result[1];
    expect(second.gender).toEqual('"Female"" "');

    const third = result[2];
    expect(third.lastName).toEqual('"');
  });

  it('should handle quoted fields with subarray', () => {
    const result = converter
      .fieldDelimiter(',')
      .parseSubArray('*', ';')
      .supportQuotedField(true)
      .getJsonFromCsv('test/resource/input_quoted_fields_with_subarray.csv');

    const first = result[0];
    expect(first.lastName).toEqual('Langsdon');
    expect(Array.isArray(first.sons) ? first.sons.length : 0).toEqual(3);
    expect(['anto', 'diego', 'hamsik']).toEqual(
      expect.arrayContaining(Array.isArray(first.sons) ? first.sons : [])
    );

    const second = result[1];
    expect(second.gender).toEqual('Male');
    expect(Array.isArray(second.sons) ? second.sons.length : 0).toEqual(3);
    expect(['12', '10', '13']).toEqual(
      expect.arrayContaining(Array.isArray(second.sons) ? second.sons : [])
    );
  });

  it('should not handle quoted fields with subarray', () => {
    const result = converter
      .fieldDelimiter(',')
      .parseSubArray('*', ';')
      .getJsonFromCsv('test/resource/input_quoted_fields_with_subarray.csv');

    const first = result[0];
    expect(first.lastName).toEqual('"Langsdon"');
    expect(Array.isArray(first.sons) ? first.sons.length : 0).toEqual(3);
    expect(['anto', 'diego', 'hamsik']).toEqual(
      expect.arrayContaining(Array.isArray(first.sons) ? first.sons : [])
    );

    const second = result[1];
    expect(second.gender).toEqual('"Male"');
    expect(Array.isArray(second.sons) ? second.sons.length : 0).toEqual(3);
    expect(['12', '10', '13']).toEqual(
      expect.arrayContaining(Array.isArray(second.sons) ? second.sons : [])
    );
  });
});
