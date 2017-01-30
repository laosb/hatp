import astring from 'astring';

// Create a custom generator that inherits from Astring's default generator
const customGenerator = Object.assign({}, astring.defaultGenerator, {
  Literal(node, state) {
    if (node.raw != null) {
      const first = node.raw.charAt(0);
      const last = node.raw.charAt(node.raw.length - 1);
      if (first === last) { // Not HaLang-specific string literals
        state.output.write(node.raw);
      } else { // HaLang-specific string literals
        state.output.write(node.value);
      }
    } else if (node.regex != null) {
      this.RegExpLiteral(node, state);
    } else {
      state.output.write(JSON.stringify(node.value));
    }
  },
});

export default customGenerator;
