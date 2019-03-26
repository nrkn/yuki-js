export interface YukiDeclarationHeader {
  consts: YukiConst[]
  lets: YukiLet[]
}

export type YukiValueType = 'number' | 'array'

export interface YukiValue {
  name: string
  valueType: 'const' | 'let'
  type: YukiValueType
}

export type YukiConst = YukiConstNumber | YukiConstArray

export interface YukiConstNumber extends YukiValue {
  valueType: 'const'
  type: 'number'
  value: number
}

export interface YukiConstArray extends YukiValue {
  valueType: 'const'
  type: 'array'
  value: number[]
}

export type YukiLet = YukiNumber | YukiArray

export interface YukiNumber extends YukiValue {
  valueType: 'let'
  type: 'number'
  bitLength: number
  signed: boolean
}

export interface YukiArray extends YukiValue {
  valueType: 'let'
  type: 'array'
  bitLength: number
  length: number
  signed: boolean
}
