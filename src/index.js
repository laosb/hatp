import { parse } from 'acorn'; // Should be replaced with our own version of acorn.
import { attachComments } from 'astravel';
import astring from 'astring';
import './acorn_plugin';

function convert(code, opts) {
  // Parse it into an AST and retrieve the list of comments
  const comments = [];
  const ast = parse(code, {
    ecmaVersion: 6,
    /* Should also have a halangVersion option in our acorn. */
    locations: true,
    onComment: comments,
    plugins: { halang: opts },
  });
  // Attach comments to AST nodes
  attachComments(ast, comments);
  // Format it into a code string
  const formattedCode = astring(ast, {
    indent: '  ',
    lineEnd: '\n',
    comments: true,
  });
  return formattedCode;
}

export default convert;
