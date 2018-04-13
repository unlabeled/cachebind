declare module "cachebind" {
  function bind(context: any, f: Function, ...args: any[]): Function
  function bindArgs(f: Function, ...args: any[]): Function
}
