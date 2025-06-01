import {
  readFileSync,
  writeFile as fsWriteFile,
  PathOrFileDescriptor,
} from 'fs';
import { ENCODING } from '../common/constants';

export function readFile(
  fileInputName: PathOrFileDescriptor,
  encoding: ENCODING = ENCODING.utf8
): string {
  return readFileSync(fileInputName, encoding).toString();
}

export function writeFile(jsonString: string, fileOutputName: string): void {
  fsWriteFile(fileOutputName, jsonString, function (err) {
    if (err) {
      throw err;
    } else {
      console.log('File saved: ' + fileOutputName);
    }
  });
}

export default {
  readFile,
  writeFile,
};
