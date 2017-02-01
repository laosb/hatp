const makeCodeAt = array => array.map(p => p.charCodeAt());
const makeCodeAtRecursion = array => array.map(p =>
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
  ['０', '零'],
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
