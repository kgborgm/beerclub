/**
 * Using Cancelable Promise Code from Rajesh Naroth, see blog post: 
 * https://rajeshnaroth.medium.com/writing-a-react-hook-to-cancel-promises-when-a-component-unmounts-526efabf251f
*/

import { useRef, useEffect } from "react";

export function makeCancelable(promise) {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then((val) => (isCanceled ? reject({ isCanceled }) : resolve(val)))
      .catch((error) => (isCanceled ? reject({ isCanceled }) : reject(error)));
  });

  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    }
  };
}

export function useCancellablePromise(cancelable = makeCancelable) {
  const emptyPromise = Promise.resolve(true);

  // test if the input argument is a cancelable promise generator
  if (cancelable(emptyPromise).cancel === undefined) {
    throw new Error(
      "promise wrapper argument must provide a cancel() function"
    );
  }

  const promises = useRef();

  useEffect(() => {
    promises.current = promises.current || [];
    return function cancel() {
      promises.current.forEach((p) => p.cancel());
      promises.current = [];
    };
  }, []);

  function cancellablePromise(p) {
    const cPromise = cancelable(p);
    promises.current.push(cPromise);
    return cPromise.promise;
  }

  return { cancellablePromise };
}
