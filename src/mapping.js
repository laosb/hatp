export const makeCodeAt = array => array.map(p => p.charCodeAt());
export const makeCodeAtRecursion = array => array.map(p =>
    (p instanceof Array ? makeCodeAtRecursion(p) : p.charCodeAt()));

export const multiCompare = (array, ...data) => array.some(key => data.every(d => d === key));
export const checkInArray = (data, ...array) => array.some(code => code.some(d => d === data));

export const dots = makeCodeAt(['。', '．']);
export const lts = makeCodeAt(['《', '＜']);
export const gts = makeCodeAt(['》', '＞']);
export const slashs = makeCodeAt(['、', '／']);
export const mults = makeCodeAt(['×', '＊']);
export const modulos = makeCodeAt(['％']);
export const carets = makeCodeAt(['…', '＾']);
export const plus = makeCodeAt(['＋']);
export const minus = makeCodeAt(['－', '—']);
export const eqs = makeCodeAt(['＝']);
export const excls = makeCodeAt(['！']);
export const amps = makeCodeAt(['＆']);
export const pipes = makeCodeAt(['｜']);
export const numbers = makeCodeAtRecursion([
  ['０', '零', '〇'],
  ['１', '壹'],
  ['２', '贰'],
  ['３', '叁'],
  ['４', '肆'],
  ['５', '伍'],
  ['６', '陆'],
  ['７', '柒'],
  ['８', '捌'],
  ['９', '玖'],
]);

export let mergedNumbers = []; // eslint-disable-line import/no-mutable-exports
numbers.forEach((n) => {
  mergedNumbers = mergedNumbers.concat(n);
});
const mapping = (() => {
  const table = {
    '.': dots,
    '<': lts,
    '>': gts,
    '/': slashs,
    '*': mults,
    '%': modulos,
    '^': carets,
    '+': plus,
    '-': minus,
    '=': eqs,
    '!': excls,
    '&': amps,
    '|': pipes,
    /* eslint quote-props: 0 */
    '0': numbers[0],
    '1': numbers[1],
    '2': numbers[2],
    '3': numbers[3],
    '4': numbers[4],
    '5': numbers[5],
    '6': numbers[6],
    '7': numbers[7],
    '8': numbers[8],
    '9': numbers[9],
  };
  const w = {};
  Object.keys(table).forEach((key) => {
    table[key].forEach((d) => {
      w[d] = key;
    });
  });
  return w;
})();
export default mapping;
