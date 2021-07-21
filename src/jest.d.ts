declare namespace jest {
  interface Matchers<R> {
    toContainIgnoreWS(expected: string): R;
  }
}
