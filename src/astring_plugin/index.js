import astring from 'astring';

// Create a custom generator that inherits from Astring's default generator
const customGenerator = Object.assign({}, astring.defaultGenerator, {
  Literal(node, state) {
    if (node.raw != null && node.raw === node.value) {
      state.output.write(node.raw);
    } else if (node.regex != null) {
      this.RegExpLiteral(node, state);
    } else {
      const stred = JSON.stringify(node.value);
      if (`"${node.value}"` === stred) {
        state.output.write(node.value);
      } else {
        state.output.write(stred);
      }
    }
  },
});

export default customGenerator;
