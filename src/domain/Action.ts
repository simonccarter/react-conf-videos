export type Action<T> = {
  type: string
  payload?: T
  error?: boolean
  meta?: Object
}