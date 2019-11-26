import { useState } from "react";

export default function useLoading() {
  const [isLoading, setState] = useState(false);
  const load = aPromise => {
    setState(true);
    return aPromise
      .then((...args) => {
        setState(false);
        return Promise.resolve(...args);
      })
      .catch((...args) => {
        setState(false);
        return Promise.reject(...args);
      });
  };
  return [isLoading, load];
}
