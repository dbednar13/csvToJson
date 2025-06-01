export function validateJson(jsonString: string) {
  try {
    JSON.parse(jsonString);
  } catch (err) {
    throw Error('Parsed csv has generated an invalid json!!!\n' + err);
  }
}

export default {
  validateJson,
};
