import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';
import config from './config/mod.ts';
import { Document } from './semtypes.ts';

const logger = config.logger('SEMANTICS BUILDER');

export function create(grammar: ohm.Grammar) {
  logger.info('Defining semantics for EMLI grammar...');

  const sem = grammar.createSemantics().addOperation('toIR', {
    Document: (meta, content, _end) => new Document(meta.toIR(), content.toIR())
  });

  logger.info('Done!');

  return sem;
}