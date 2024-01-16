const originalWarn = console.error;
console.error = function (message?: any, ...optionalParams: any[]) {
  if (message.includes("defaultProps")) {
    return;
  }
  originalWarn.apply(console, [message, ...optionalParams]);
};
