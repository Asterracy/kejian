# Third-party notices

KeJian / 课间 includes ExcelJS 4.4.0 and the browser libraries embedded in its published bundle. These components remain under their own licenses. The project MIT license does not replace these notices. Retain this file and the complete `third-party-licenses/` directory with source and binary distributions.

## Distribution and license choices

- ExcelJS and most browser modules use MIT. Some use ISC or BSD-3-Clause. `sha.js` retains both MIT and BSD-3-Clause terms.
- JSZip 3.10.1 is offered under MIT or GPL-3.0-or-later. This distribution elects **MIT**; its complete MIT text is retained.
- JSZip contains `pako`, `lie`, `immediate` and `setimmediate`. Pako has MIT and zlib-origin code; both notices are retained.
- These licenses permit the project to be publicly distributed with the retained notices and disclaimers. Third-party names are attribution, not endorsement.

## Verification method and version limits

The shipped `prototype/vendor/exceljs-4.4.0.min.js` was byte-for-byte compared with `dist/exceljs.min.js` from the official immutable npm ExcelJS 4.4.0 tarball:

```text
npm tarball SHA-256: 8adac13d192ce80e11304732d3ab96708b2c64bb54771b5da4f946e5eea55a18
browser bundle SHA-256: 7e49da68588e250dbb8bba190d2caa8ab3787cc0284bda1d8b2f805c4df742c9
```

The official sourcemap identifies **68 external package names** (72 installation paths because some packages occur in multiple versions). JSZip browser code was separately inspected and adds four embedded packages, giving **72 external package names** in total, plus ExcelJS itself. [The ExcelJS v4.4.0 source tree](https://github.com/exceljs/exceljs/tree/v4.4.0) contains no committed dependency lockfile; installing its semver ranges today cannot reconstruct this bundle.

The inventory uses historical npm packages published no later than ExcelJS 4.4.0 (2023-10-19), and compares all corresponding source files exposed by the official sourcemap. The versions below are **license reference / source-equivalent versions**, not an assertion of a recovered install lock. Source equivalence can span multiple package patch versions. Core-js 3.33.0 and elliptic 6.5.4 have explicit versions in bundled source; JSZip identifies itself as 3.10.1. Some TypeScript/Babel-generated modules, and browser wrapper code inside JSZip, differ from their npm source text. Those are marked as transformed/reference-only and retain their upstream license texts without claiming an exact installed version.

Full license text was copied from each listed npm tarball. For packages whose license is in their README, the complete license section was copied. Saxes omitted its license file from its npm tarball; its complete upstream [v5.0.1 LICENSE](https://github.com/lddubeau/saxes/blob/v5.0.1/LICENSE) is retained, including its inherited ISC and historical MIT notices. Pako’s zlib notice was also copied directly from JSZip’s embedded source. A machine-readable provenance and source-match inventory is in [`third-party-licenses/bundle-inventory.json`](third-party-licenses/bundle-inventory.json).

## Redistributed runtime components

| Component | License reference version | Terms | Evidence | Complete text |
| --- | --- | --- | --- | --- |
| [ExcelJS](https://registry.npmjs.org/exceljs/-/exceljs-4.4.0.tgz) | 4.4.0 | MIT | Official bundle byte match | [License](third-party-licenses/exceljs-4.4.0-LICENSE.txt) |
| [@fast-csv/format](https://registry.npmjs.org/@fast-csv/format/-/format-4.3.5.tgz) | 4.3.5 | MIT | Transformed / reference only | [License](third-party-licenses/fast-csv-format-4.3.5-LICENSE) |
| [@fast-csv/parse](https://registry.npmjs.org/@fast-csv/parse/-/parse-4.3.6.tgz) | 4.3.6 | MIT | Transformed / reference only | [License](third-party-licenses/fast-csv-parse-4.3.6-LICENSE) |
| [asn1.js](https://registry.npmjs.org/asn1.js/-/asn1.js-5.4.1.tgz) | 5.4.1 | MIT | All mapped files match | [License](third-party-licenses/asn1.js-5.4.1-LICENSE) |
| [base64-js](https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz) | 1.5.1 | MIT | All mapped files match | [License](third-party-licenses/base64-js-1.5.1-LICENSE) |
| [bn.js](https://registry.npmjs.org/bn.js/-/bn.js-4.12.0.tgz) | 4.12.0 | MIT | All mapped files match | [License](third-party-licenses/bn.js-4.12.0-LICENSE) |
| [bn.js](https://registry.npmjs.org/bn.js/-/bn.js-5.2.1.tgz) | 5.2.1 | MIT | All mapped files match | [License](third-party-licenses/bn.js-5.2.1-LICENSE) |
| [brorand](https://registry.npmjs.org/brorand/-/brorand-1.1.0.tgz) | 1.1.0 | MIT | All mapped files match | [License](third-party-licenses/brorand-1.1.0-LICENSE-from-README.txt) |
| [browser-pack](https://registry.npmjs.org/browser-pack/-/browser-pack-6.1.0.tgz) | 6.1.0 | MIT | All mapped files match | [License](third-party-licenses/browser-pack-6.1.0-LICENSE) |
| [browserify-aes](https://registry.npmjs.org/browserify-aes/-/browserify-aes-1.2.0.tgz) | 1.2.0 | MIT | All mapped files match | [License](third-party-licenses/browserify-aes-1.2.0-LICENSE) |
| [browserify-cipher](https://registry.npmjs.org/browserify-cipher/-/browserify-cipher-1.0.1.tgz) | 1.0.1 | MIT | All mapped files match | [License](third-party-licenses/browserify-cipher-1.0.1-LICENSE) |
| [browserify-des](https://registry.npmjs.org/browserify-des/-/browserify-des-1.0.2.tgz) | 1.0.2 | MIT | All mapped files match | [License](third-party-licenses/browserify-des-1.0.2-license) |
| [browserify-rsa](https://registry.npmjs.org/browserify-rsa/-/browserify-rsa-4.1.0.tgz) | 4.1.0 | MIT | All mapped files match | [License](third-party-licenses/browserify-rsa-4.1.0-LICENSE) |
| [browserify-sign](https://registry.npmjs.org/browserify-sign/-/browserify-sign-4.2.1.tgz) | 4.2.1 | ISC | All mapped files match | [License](third-party-licenses/browserify-sign-4.2.1-LICENSE) |
| [buffer](https://registry.npmjs.org/buffer/-/buffer-5.2.1.tgz) | 5.2.1 | MIT | All mapped files match | [License](third-party-licenses/buffer-5.2.1-LICENSE) |
| [buffer-xor](https://registry.npmjs.org/buffer-xor/-/buffer-xor-1.0.3.tgz) | 1.0.3 | MIT | All mapped files match | [License](third-party-licenses/buffer-xor-1.0.3-LICENSE) |
| [cipher-base](https://registry.npmjs.org/cipher-base/-/cipher-base-1.0.4.tgz) | 1.0.4 | MIT | All mapped files match | [License](third-party-licenses/cipher-base-1.0.4-LICENSE) |
| [core-js](https://registry.npmjs.org/core-js/-/core-js-3.33.0.tgz) | 3.33.0 | MIT | All mapped files match | [License](third-party-licenses/core-js-3.33.0-LICENSE) |
| [core-util-is](https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.3.tgz) | 1.0.3 | MIT | All mapped files match | [License](third-party-licenses/core-util-is-1.0.3-LICENSE) |
| [create-ecdh](https://registry.npmjs.org/create-ecdh/-/create-ecdh-4.0.4.tgz) | 4.0.4 | MIT | All mapped files match | [License](third-party-licenses/create-ecdh-4.0.4-LICENSE) |
| [create-hash](https://registry.npmjs.org/create-hash/-/create-hash-1.2.0.tgz) | 1.2.0 | MIT | All mapped files match | [License](third-party-licenses/create-hash-1.2.0-LICENSE) |
| [create-hmac](https://registry.npmjs.org/create-hmac/-/create-hmac-1.1.7.tgz) | 1.1.7 | MIT | All mapped files match | [License](third-party-licenses/create-hmac-1.1.7-LICENSE) |
| [crypto-browserify](https://registry.npmjs.org/crypto-browserify/-/crypto-browserify-3.12.0.tgz) | 3.12.0 | MIT | All mapped files match | [License](third-party-licenses/crypto-browserify-3.12.0-LICENSE) |
| [dayjs](https://registry.npmjs.org/dayjs/-/dayjs-1.11.10.tgz) | 1.11.10 | MIT | All mapped files match | [License](third-party-licenses/dayjs-1.11.10-LICENSE) |
| [des.js](https://registry.npmjs.org/des.js/-/des.js-1.1.0.tgz) | 1.1.0 | MIT | All mapped files match | [License](third-party-licenses/des.js-1.1.0-LICENSE-from-README.txt) |
| [diffie-hellman](https://registry.npmjs.org/diffie-hellman/-/diffie-hellman-5.0.3.tgz) | 5.0.3 | MIT | All mapped files match | [License](third-party-licenses/diffie-hellman-5.0.3-LICENSE) |
| [elliptic](https://registry.npmjs.org/elliptic/-/elliptic-6.5.4.tgz) | 6.5.4 | MIT | All mapped files match | [License](third-party-licenses/elliptic-6.5.4-LICENSE-from-README.txt) |
| [events](https://registry.npmjs.org/events/-/events-2.1.0.tgz) | 2.1.0 | MIT | All mapped files match | [License](third-party-licenses/events-2.1.0-LICENSE) |
| [evp_bytestokey](https://registry.npmjs.org/evp_bytestokey/-/evp_bytestokey-1.0.3.tgz) | 1.0.3 | MIT | All mapped files match | [License](third-party-licenses/evp_bytestokey-1.0.3-LICENSE) |
| [fast-csv](https://registry.npmjs.org/fast-csv/-/fast-csv-4.3.6.tgz) | 4.3.6 | MIT | Transformed / reference only | [License](third-party-licenses/fast-csv-4.3.6-LICENSE) |
| [hash-base](https://registry.npmjs.org/hash-base/-/hash-base-3.1.0.tgz) | 3.1.0 | MIT | All mapped files match | [License](third-party-licenses/hash-base-3.1.0-LICENSE) |
| [hash.js](https://registry.npmjs.org/hash.js/-/hash.js-1.1.7.tgz) | 1.1.7 | MIT | All mapped files match | [License](third-party-licenses/hash.js-1.1.7-LICENSE-from-README.txt) |
| [hmac-drbg](https://registry.npmjs.org/hmac-drbg/-/hmac-drbg-1.0.1.tgz) | 1.0.1 | MIT | All mapped files match | [License](third-party-licenses/hmac-drbg-1.0.1-LICENSE-from-README.txt) |
| [ieee754](https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz) | 1.2.1 | BSD-3-Clause | All mapped files match | [License](third-party-licenses/ieee754-1.2.1-LICENSE) |
| [immediate](https://registry.npmjs.org/immediate/-/immediate-3.0.6.tgz) | 3.0.6 | MIT | Transformed / reference only | [License](third-party-licenses/immediate-3.0.6-LICENSE.txt) |
| [inherits](https://registry.npmjs.org/inherits/-/inherits-2.0.3.tgz) | 2.0.3 | ISC | All mapped files match | [License](third-party-licenses/inherits-2.0.3-LICENSE) |
| [inherits](https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz) | 2.0.4 | ISC | All mapped files match | [License](third-party-licenses/inherits-2.0.4-LICENSE) |
| [isarray](https://registry.npmjs.org/isarray/-/isarray-2.0.5.tgz) | 2.0.5 | MIT | All mapped files match | [License](third-party-licenses/isarray-2.0.5-LICENSE) |
| [jszip](https://registry.npmjs.org/jszip/-/jszip-3.10.1.tgz) | 3.10.1 | MIT (chosen from MIT OR GPL-3.0-or-later) | All mapped files match | [License](third-party-licenses/jszip-3.10.1-LICENSE-MIT.txt), [Additional notice](third-party-licenses/jszip-3.10.1-lib-license_header.js) |
| [lie](https://registry.npmjs.org/lie/-/lie-3.3.0.tgz) | 3.3.0 | MIT | All mapped files match | [License](third-party-licenses/lie-3.3.0-license.md) |
| [lodash.escaperegexp](https://registry.npmjs.org/lodash.escaperegexp/-/lodash.escaperegexp-4.1.2.tgz) | 4.1.2 | MIT | All mapped files match | [License](third-party-licenses/lodash.escaperegexp-4.1.2-LICENSE) |
| [lodash.groupby](https://registry.npmjs.org/lodash.groupby/-/lodash.groupby-4.6.0.tgz) | 4.6.0 | MIT | All mapped files match | [License](third-party-licenses/lodash.groupby-4.6.0-LICENSE) |
| [lodash.isboolean](https://registry.npmjs.org/lodash.isboolean/-/lodash.isboolean-3.0.3.tgz) | 3.0.3 | MIT | All mapped files match | [License](third-party-licenses/lodash.isboolean-3.0.3-LICENSE) |
| [lodash.isequal](https://registry.npmjs.org/lodash.isequal/-/lodash.isequal-4.5.0.tgz) | 4.5.0 | MIT | All mapped files match | [License](third-party-licenses/lodash.isequal-4.5.0-LICENSE) |
| [lodash.isfunction](https://registry.npmjs.org/lodash.isfunction/-/lodash.isfunction-3.0.9.tgz) | 3.0.9 | MIT | All mapped files match | [License](third-party-licenses/lodash.isfunction-3.0.9-LICENSE) |
| [lodash.isnil](https://registry.npmjs.org/lodash.isnil/-/lodash.isnil-4.0.0.tgz) | 4.0.0 | MIT | All mapped files match | [License](third-party-licenses/lodash.isnil-4.0.0-LICENSE) |
| [lodash.isundefined](https://registry.npmjs.org/lodash.isundefined/-/lodash.isundefined-3.0.1.tgz) | 3.0.1 | MIT | All mapped files match | [License](third-party-licenses/lodash.isundefined-3.0.1-LICENSE.txt) |
| [lodash.uniq](https://registry.npmjs.org/lodash.uniq/-/lodash.uniq-4.5.0.tgz) | 4.5.0 | MIT | All mapped files match | [License](third-party-licenses/lodash.uniq-4.5.0-LICENSE) |
| [md5.js](https://registry.npmjs.org/md5.js/-/md5.js-1.3.5.tgz) | 1.3.5 | MIT | All mapped files match | [License](third-party-licenses/md5.js-1.3.5-LICENSE) |
| [miller-rabin](https://registry.npmjs.org/miller-rabin/-/miller-rabin-4.0.1.tgz) | 4.0.1 | MIT | All mapped files match | [License](third-party-licenses/miller-rabin-4.0.1-LICENSE-from-README.txt) |
| [minimalistic-assert](https://registry.npmjs.org/minimalistic-assert/-/minimalistic-assert-1.0.1.tgz) | 1.0.1 | ISC | All mapped files match | [License](third-party-licenses/minimalistic-assert-1.0.1-LICENSE) |
| [minimalistic-crypto-utils](https://registry.npmjs.org/minimalistic-crypto-utils/-/minimalistic-crypto-utils-1.0.1.tgz) | 1.0.1 | MIT | All mapped files match | [License](third-party-licenses/minimalistic-crypto-utils-1.0.1-LICENSE-from-README.txt) |
| [pako](https://registry.npmjs.org/pako/-/pako-1.0.11.tgz) | 1.0.11 | (MIT AND Zlib) | Transformed / reference only | [License](third-party-licenses/pako-1.0.11-LICENSE), [Additional notice](third-party-licenses/pako-1.0.11-ZLIB-NOTICE.txt) |
| [parse-asn1](https://registry.npmjs.org/parse-asn1/-/parse-asn1-5.1.6.tgz) | 5.1.6 | ISC | All mapped files match | [License](third-party-licenses/parse-asn1-5.1.6-LICENSE) |
| [pbkdf2](https://registry.npmjs.org/pbkdf2/-/pbkdf2-3.1.2.tgz) | 3.1.2 | MIT | All mapped files match | [License](third-party-licenses/pbkdf2-3.1.2-LICENSE) |
| [process](https://registry.npmjs.org/process/-/process-0.11.10.tgz) | 0.11.10 | MIT | All mapped files match | [License](third-party-licenses/process-0.11.10-LICENSE) |
| [process-nextick-args](https://registry.npmjs.org/process-nextick-args/-/process-nextick-args-2.0.1.tgz) | 2.0.1 | MIT | All mapped files match | [License](third-party-licenses/process-nextick-args-2.0.1-license.md) |
| [public-encrypt](https://registry.npmjs.org/public-encrypt/-/public-encrypt-4.0.3.tgz) | 4.0.3 | MIT | All mapped files match | [License](third-party-licenses/public-encrypt-4.0.3-LICENSE) |
| [randombytes](https://registry.npmjs.org/randombytes/-/randombytes-2.1.0.tgz) | 2.1.0 | MIT | All mapped files match | [License](third-party-licenses/randombytes-2.1.0-LICENSE) |
| [randomfill](https://registry.npmjs.org/randomfill/-/randomfill-1.0.4.tgz) | 1.0.4 | MIT | All mapped files match | [License](third-party-licenses/randomfill-1.0.4-LICENSE) |
| [readable-stream](https://registry.npmjs.org/readable-stream/-/readable-stream-2.3.8.tgz) | 2.3.8 | MIT | All mapped files match | [License](third-party-licenses/readable-stream-2.3.8-LICENSE) |
| [readable-stream](https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.2.tgz) | 3.6.2 | MIT | All mapped files match | [License](third-party-licenses/readable-stream-3.6.2-LICENSE) |
| [regenerator-runtime](https://registry.npmjs.org/regenerator-runtime/-/regenerator-runtime-0.13.11.tgz) | 0.13.11 | MIT | All mapped files match | [License](third-party-licenses/regenerator-runtime-0.13.11-LICENSE) |
| [ripemd160](https://registry.npmjs.org/ripemd160/-/ripemd160-2.0.2.tgz) | 2.0.2 | MIT | All mapped files match | [License](third-party-licenses/ripemd160-2.0.2-LICENSE) |
| [safe-buffer](https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.1.2.tgz) | 5.1.2 | MIT | All mapped files match | [License](third-party-licenses/safe-buffer-5.1.2-LICENSE) |
| [safe-buffer](https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz) | 5.2.1 | MIT | All mapped files match | [License](third-party-licenses/safe-buffer-5.2.1-LICENSE) |
| [safer-buffer](https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz) | 2.1.2 | MIT | All mapped files match | [License](third-party-licenses/safer-buffer-2.1.2-LICENSE) |
| [saxes](https://registry.npmjs.org/saxes/-/saxes-5.0.1.tgz) | 5.0.1 | ISC; retained historical MIT notice | Transformed / reference only | [License](third-party-licenses/saxes-5.0.1-LICENSE) |
| [setimmediate](https://registry.npmjs.org/setimmediate/-/setimmediate-1.0.5.tgz) | 1.0.5 | MIT | Transformed / reference only | [License](third-party-licenses/setimmediate-1.0.5-LICENSE.txt) |
| [sha.js](https://registry.npmjs.org/sha.js/-/sha.js-2.4.11.tgz) | 2.4.11 | (MIT AND BSD-3-Clause) | All mapped files match | [License](third-party-licenses/sha.js-2.4.11-LICENSE) |
| [stream-browserify](https://registry.npmjs.org/stream-browserify/-/stream-browserify-2.0.2.tgz) | 2.0.2 | MIT | All mapped files match | [License](third-party-licenses/stream-browserify-2.0.2-LICENSE) |
| [string_decoder](https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz) | 1.3.0 | MIT | All mapped files match | [License](third-party-licenses/string_decoder-1.3.0-LICENSE) |
| [timers-browserify](https://registry.npmjs.org/timers-browserify/-/timers-browserify-1.4.2.tgz) | 1.4.2 | MIT | All mapped files match | [License](third-party-licenses/timers-browserify-1.4.2-LICENSE.md) |
| [util](https://registry.npmjs.org/util/-/util-0.10.4.tgz) | 0.10.4 | MIT | All mapped files match | [License](third-party-licenses/util-0.10.4-LICENSE) |
| [util-deprecate](https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz) | 1.0.2 | MIT | All mapped files match | [License](third-party-licenses/util-deprecate-1.0.2-LICENSE) |
| [uuid](https://registry.npmjs.org/uuid/-/uuid-8.3.2.tgz) | 8.3.2 | MIT | All mapped files match | [License](third-party-licenses/uuid-8.3.2-LICENSE.md) |
| [xmlchars](https://registry.npmjs.org/xmlchars/-/xmlchars-2.2.0.tgz) | 2.2.0 | MIT | Transformed / reference only | [License](third-party-licenses/xmlchars-2.2.0-LICENSE) |

## Development tools

Tests can install **jsdom 30.1.2** ([official npm package](https://www.npmjs.com/package/jsdom/v/30.1.2)), under MIT. Its [complete license](third-party-licenses/jsdom-30.1.2-LICENSE.txt) is retained for attribution. Jsdom and its npm dependency tree are development-only: no `node_modules` directory is redistributed in the app or source archive. When installing or redistributing that tree separately, retain the license files delivered by npm.

Android SDK, platform tools, Java, Node.js and npm are external build tools, installed separately; this project does not redistribute those toolchains.

Default pet artwork is project-authored. Users provide their own spreadsheets and optional custom pet assets, and are responsible for permission to redistribute those inputs. Private input files and signing keys are not part of the public distribution.
