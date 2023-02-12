export const debug = {
  log: (message?: any, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV === "development") {
      if (optionalParams.length) console.log(message, optionalParams);
      else console.log(message);
    }
  },
};
