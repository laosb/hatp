import { plugins } from 'acorn';
import readToken from './readToken';
import readString from './readString';

plugins.halang = function halangPlugin(parser) {
  parser.extend('readToken', readToken);
  parser.extend('readString', readString);
};
