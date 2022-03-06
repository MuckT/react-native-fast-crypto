import { expect } from 'chai'
import { base16, base64 } from 'rfc4648'
import { utf8 } from './utf8'
import { pbkdf2, scrypt } from 'react-native-fast-crypto'

export interface Tests {
  [name: string]: () => Promise<void>
}

export const tests: Tests = {
  'pbkdf2 (ASCII input)': async () => {
    // From https://github.com/trezor/python-mnemonic/blob/master/vectors.json
    const out = await pbkdf2.deriveAsync(
      utf8.parse(
        'scissors invite lock maple supreme raw rapid void congress muscle digital elegant little brisk hair mango congress clump'
      ),
      utf8.parse('mnemonicTREZOR'),
      2048,
      64,
      'sha512'
    )

    expect(base16.stringify(out).toLowerCase()).equals(
      '7b4a10be9d98e6cba265566db7f136718e1398c71cb581e1b2f464cac1ceedf4f3e274dc270003c670ad8d02c4558b2f8e39edea2775c9e232c7cb798b069e88'
    )
  },

  'pbkdf2 (Japanese UTF-8 input)': async () => {
    // From https://github.com/bip32JP/bip32JP.github.io/blob/master/test_JP_BIP39.json
    const out = await pbkdf2.deriveAsync(
      utf8.parse(
        'うりきれ さいせい じゆう むろん とどける ぐうたら はいれつ ひけつ いずれ うちあわせ おさめる おたく'
      ),
      utf8.parse(
        'mnemonicメートルガバヴァぱばぐゞちぢ十人十色'
      ),
      2048,
      64,
      'sha512'
    )

    expect(base16.stringify(out).toLowerCase()).equals(
      '3d711f075ee44d8b535bb4561ad76d7d5350ea0b1f5d2eac054e869ff7963cdce9581097a477d697a2a9433a0c6884bea10a2193647677977c9820dd0921cbde'
    )
  },

  scrypt: async () => {
    // Edge username hash:
    const out = await scrypt(
      utf8.parse('william test1'),
      base16.parse(
        'b5865ffb9fa7b3bfe4b2384d47ce831ee22a4a9d5c34c7ef7d21467cc758f81b'
      ),
      16384,
      1,
      1,
      32
    )

    expect(base64.stringify(out)).deep.equals(
      'EE+tBb5wM63qwCDVidzwUQThH9ekCSfpUuTQYujSmY8='
    )
  }
}
