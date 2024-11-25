export const debugLog = (...args) => {
  if (process.env.REACT_APP_DEVELOP_MODE == 1) {
    console.log(...args);
  }
}