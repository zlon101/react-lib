const Color = {
  info: 'color: #fff',
  debug: 'color: #0af4f4',
  warn: 'color: #f4f40a',
  error: 'color: red',
} as const;
type IType = keyof (typeof Color);

export const log = (label: string | number, data: any, type: IType = 'debug' ) => {
  const msg = ['undefined', 'object'].includes(typeof data) ? JSON.stringify(data, null, 2) : data;
  if (data === undefined) {
    console.debug(`\n%c${label}`, Color[type]);
  } else {
    console.debug(`\n%c${label}:\n${msg}`, Color[type]);
  }
};
