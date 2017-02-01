const makeCodeAt = array => array.map(p => p.charCodeAt());
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
