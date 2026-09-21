import { onRejected } from "./rejected";
import { onFulfilled } from "./fulfilled";


export const responseInterceptor = {
  onFulfilled: onFulfilled,
  onRejected: onRejected
};
