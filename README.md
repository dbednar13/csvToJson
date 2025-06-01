# CSVtoJSON

**This project is not dependent on others packages or libraries.**

This project started as a fork to [Iuccio's](https://github.com/iuccio) [csvToJSON](https://github.com/iuccio/csvToJson) but quickly turned into a spiritual successor. There are 3 major differences between this project and the original.

1. Typescript by default
1. Code reorganized to remove duplicate definitions.
1. Default field deliminator is now a comma (',') instead of a semi-colon (';')

If you found this project useful, please go and express your gratitude to Iuccio.

## Table of Contents

<!-- toc -->

- [Description](#description)
- [Support for JS & TS](#support-for-js--ts)
- [Prerequisites](#prerequisites)
- [Install npm _convert-csv-to-json package_](#install-npm-convert-csv-to-json-package)
  - [Install](#install)
  - [Usage](#usage)
    - [Generate JSON file](#generate-json-file)
    - [Generate Array of Object in JSON format](#generate-array-of-object-in-json-format)
    - [Generate Object with sub array](#generate-object-with-sub-array)
    - [Define field delimiter](#define-field-delimiter)
    - [Trim header field](#trim-header-field)
    - [Trim header field with whitespaces](#trim-header-field-with-whitespaces)
    - [Support Quoted Fields](#support-quoted-fields)
    - [Index header](#index-header)
    - [Empty rows](#empty-rows)
    - [Format property value by type](#format-property-value-by-type)
      - [Number](#number)
      - [Boolean](#boolean)
    - [Encoding](#encoding)
  - [Chaining Pattern](#chaining-pattern)
- [Development](#development)
- [CI CD github action](#ci-cd-github-action)
- [License](#license)
- [Buy me a Coffee](#buy-me-a-coffee)

<!-- tocstop -->

## Description

Converts _csv_ files to _JSON_ files with Node.js.

Give an input file like:

| first_name | last_name |        email         | gender | age | zip | registered |
| :--------: | :-------: | :------------------: | :----: | :-: | :-: | :--------: |
| Constantin | Langsdon  | clangsdon0@hc360.com |  Male  | 96  | 123 |    true    |
|   Norah    |  Raison   |  nraison1@wired.com  | Female | 32  |     |   false    |

e.g. :

```
first_name;last_name;email;gender;age;zip;registered
Constantin;Langsdon;clangsdon0@hc360.com;Male;96;123;true
Norah;Raison;nraison1@wired.com;Female;32;;false
```

will generate:

```json
[
  {
    "first_name": "Constantin",
    "last_name": "Langsdon",
    "email": "clangsdon0@hc360.com",
    "gender": "Male",
    "age": "96",
    "zip": "123",
    "registered": "true"
  },
  {
    "first_name": "Norah",
    "last_name": "Raison",
    "email": "nraison1@wired.com",
    "gender": "Female",
    "age": "32",
    "zip": "",
    "registered": "false"
  }
]
```

## Support for JS & TS

This package is compatible with ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) and ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white).

## Prerequisites

**NPM** (see [Installing Npm](https://docs.npmjs.com/getting-started/installing-node)).

## Install npm _convert-csv-to-json package_

Go to NPM package [convert-csv-to-json](https://www.npmjs.com/package/convert-csv-to-json2).

### Install

Install package in your _package.json_

```bash
$ npm install convert-csv-to-json2 --save
$ yarn install convert-csv-to-json2 --save
$ pnpm add convert-csv-to-json2 --save
```

### Usage

#### Generate JSON file

```js
import csvToJson from 'convert-csv-to-json2';

const fileInputName = 'myInputFile.csv';
const fileOutputName = 'myOutputFile.json';

csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);
```

#### Generate Array of Object in JSON format

```js
import csvToJson from 'convert-csv-to-json2';

const json = csvToJson.getJsonFromCsv('myInputFile.csv');
for (let i = 0; i < json.length; i++) {
  console.log(json[i]);
}
```

#### Generate Object with sub array

```
firstName;lastName;email;gender;age;birth;sons
Constantin;Langsdon;clangsdon0@hc360.com;Male;96;10.02.1965;*diego,marek,dries*
```

Given the above CSV example, to generate a JSON Object with properties that contains sub Array, like the property **sons**
with the values <b>_diego,marek,dries_</b> you have to call the function `parseSubArray(delimiter, separator)` .
To generate the JSON Object with sub array from the above CSV example:

```js
csvToJson.parseSubArray('*', ',').getJsonFromCsv('myInputFile.csv');
```

The result will be:

```json
[
  {
    "firstName": "Constantin",
    "lastName": "Langsdon",
    "email": "clangsdon0@hc360.com",
    "gender": "Male",
    "age": "96",
    "birth": "10.02.1965",
    "sons": ["diego", "marek", "dries"]
  }
]
```

#### Define field delimiter

A field delimiter is needed to split the parsed values. As default the field delimiter is the **comma** (**,**), this means that during the parsing when a **comma (,)** is matched a new JSON entry is created.
In case your CSV file has defined another field delimiter you have to call the function `fieldDelimiter(myDelimiter)` and pass it as parameter the field delimiter.

E.g. if your field delimiter is the semicolon **;** then:

```js
csvToJson.fieldDelimiter(';').getJsonFromCsv(fileInputName);
```

#### Trim header field

The content of the field header is cut off at the beginning and end of the string. E.g. " Last Name " -> "Last Name".

#### Trim header field with whitespaces

Use the method _trimHeaderFieldWhiteSpace(true)_ to remove the whitespaces in an header field (E.g. " Last Name " -> "LastName"):

```js
csvToJson.trimHeaderFieldWhiteSpace(true).getJsonFromCsv(fileInputName);
```

#### Support Quoted Fields

To be able to parse correctly fields wrapped in quote, like the **last_name** in the first row in the following example:

| first_name |         last_name          |        email         |
| :--------: | :------------------------: | :------------------: |
| Constantin | "Langsdon,Nandson,Gangson" | clangsdon0@hc360.com |

you need to activate the support quoted fields feature:

```js
csvToJson.supportQuotedField(true).getJsonFromCsv(fileInputName);
```

The result will be:

```json
[
  {
    "firstName": "Constantin",
    "lastName": "Langsdon,Nandson,Gangson",
    "email": "clangsdon0@hc360.com"
  }
]
```

#### Index header

If the header is not on the first line you can define the header index like:

```js
csvToJson.indexHeader(3).getJsonFromCsv(fileInputName);
```

#### Empty rows

Empty rows are ignored and not parsed.

#### Format property value by type

If you want that a number will be printed as a Number type, and values _true_ or _false_ is printed as a boolean Type, use:

```js
csvToJson.formatValueByType().getJsonFromCsv(fileInputName);
```

For example:

```json
[
  {
    "first_name": "Constantin",
    "last_name": "Langsdon",
    "email": "clangsdon0@hc360.com",
    "gender": "Male",
    "age": 96,
    "zip": 123,
    "registered": true
  },
  {
    "first_name": "Norah",
    "last_name": "Raison",
    "email": "nraison1@wired.com",
    "gender": "Female",
    "age": 32,
    "zip": "",
    "registered": false
  }
]
```

##### Number

The property **age** is printed as

```json
 "age": 32
```

instead of

```json
  "age": "32"
```

##### Boolean

The property **registered** is printed as

```json
 "registered": true
```

instead of

```json
  "registered": "true"
```

#### Encoding

You can read and decode files with the following encoding:

- utf8:
  ```js
  csvToJson.utf8Encoding().getJsonFromCsv(fileInputName);
  ```
- ucs2:
  ```js
  csvToJson.ucs2Encoding().getJsonFromCsv(fileInputName);
  ```
- utf16le:
  ```js
  csvToJson.utf16leEncoding().getJsonFromCsv(fileInputName);
  ```
- latin1:
  ```js
  csvToJson.latin1Encoding().getJsonFromCsv(fileInputName);
  ```
- ascii:
  ```js
  csvToJson.asciiEncoding().getJsonFromCsv(fileInputName);
  ```
- base64:
  ```js
  csvToJson.base64Encoding().getJsonFromCsv(fileInputName);
  ```
- hex:
  ```js
  csvToJson.hexEncoding().getJsonFromCsv(fileInputName);
  ```

### Chaining Pattern

The exposed API is implemented with the [Method Chaining Pattern](https://en.wikipedia.org/wiki/Method_chaining), which means that multiple methods can be chained, e.g.:

```js
import csvToJson from 'convert-csv-to-json2';

csvToJson
  .fieldDelimiter(',')
  .formatValueByType()
  .parseSubArray('*', ',')
  .supportQuotedField(true)
  .getJsonFromCsv('myInputFile.csv');
```

## Development

- Download all csvToJson dependencies:
  ```
  pnpm install
  ```
- Run Tests
  ```
  pnpm test
  ```
- Debug Tests
  ```
  pnpm run test-debug
  ```
