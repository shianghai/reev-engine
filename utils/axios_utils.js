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