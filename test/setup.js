expect.extend({
    toContainIgnoreWS(received, expected) {
        const options = {
            comment: 'string contains ignoring whitespace',
            isNot: this.isNot,
            promise: this.promise,
          };
      
          received = received.replace(/\s/g, '');
          const pass = received.includes(expected);
      
          const message = pass
            ? () =>
                this.utils.matcherHint('toContainIgnoreWS', undefined, undefined, options) +
                '\n\n' +
                `Expected: not ${this.utils.printExpected(expected)}\n` +
                `Received: ${this.utils.printReceived(received)}`
            : () => {
                const diffString = this.utils.diff(expected, received, {
                  expand: this.expand,
                });
                return (
                  this.utils.matcherHint('toContainIgnoreWS', undefined, undefined, options) +
                  '\n\n' +
                  (diffString && diffString.includes('- Expect')
                    ? `Difference:\n\n${diffString}`
                    : `Expected: ${this.utils.printExpected(expected)}\n` +
                      `Received: ${this.utils.printReceived(received)}`)
                );
              };
      
          return {actual: received, message, pass};
    }
}); 