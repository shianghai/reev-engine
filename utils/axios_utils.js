/**
 * Reruns a function a specified number of increasing time
 * @param {Function} fn The function to run
 * @param {int} retries The number of times to run the function
 * @param {int} delay The number of  seconds to delay before re running the function
 * @returns A promise which resolves to revoking itself if fn producess an error if it has been run
 */
function retryWithBackoff(fn, retries = 5, delay = 1000) {
    return fn().catch((error) => {
      if (retries === 0) {
        throw error;
      }
      const newDelay = delay * 2;
      return new Promise((resolve) => {
        setTimeout(resolve, newDelay);
      }).then(() => retryWithBackoff(fn, retries - 1, newDelay));
    });
  }

  export default retryWithBackoff;