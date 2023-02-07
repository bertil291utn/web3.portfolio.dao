export interface HandleError {
  error: any
  txHashKeyName: string
}

export interface FinishTX {
  txHashKeyName: string
  path: string
  reload?: boolean
}