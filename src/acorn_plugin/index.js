import { plugins } from 'acorn'
import * as readTokens from './readTokens'
import readToken from './readToken'
import readString from './readString'
import * as readNumbers from './readNumbers'
import readWord from './readWord'
import parseStatement from './parseStatement'
import parseFromImport from './parseFromImport'
import finishOp from './finishOp'
import skipBlockComment from './skipBlockComment'
import skipSpace from './skipSpace'

plugins.halang = function halangPlugin (parser) {
  parser.extend('finishOp', finishOp)
  parser.extend('readToken', readToken)
  parser.extend('readString', readString)
  parser.extend('readWord', readWord)
  parser.extend('parseStatement', parseStatement)
  parser.extend('parseFromImport', parseFromImport)
  parser.extend('readFullTokenCaret', readTokens.readTokenCaret)
  parser.extend('readFullTokenDot', readTokens.readTokenDot)
  parser.extend('readFullTokenEqExcl', readTokens.readTokenEqExcl)
  parser.extend('readFullTokenLtGt', readTokens.readTokenLtGt)
  parser.extend('readFullTokenMultModuloExp', readTokens.readTokenMultModuloExp)
  parser.extend('readFullTokenPipeAmp', readTokens.readTokenPipeAmp)
  parser.extend('readFullTokenPlusMin', readTokens.readTokenPlusMin)
  parser.extend('readFullTokenSlash', readTokens.readTokenSlash)
  parser.extend('readInt', readNumbers.readInt)
  parser.extend('readNumber', readNumbers.readNumber)
  // parser.extend('readFullRadixNumber', readNumbers.readRadixNumber);
  parser.extend('skipBlockComment', skipBlockComment)
  parser.extend('skipSpace', skipSpace)
}
