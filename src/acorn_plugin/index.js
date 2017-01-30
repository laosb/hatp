import { plugins } from 'acorn';
import readToken from './readToken';
import readString from './readString';
import parseStatement from './parseStatement';
import parseFromImport from './parseFromImport';

plugins.halang = function halangPlugin(parser) {
  parser.extend('readToken', readToken);
  parser.extend('readString', readString);
  parser.extend('parseStatement', parseStatement);
  parser.extend('parseFromImport', parseFromImport);
};
