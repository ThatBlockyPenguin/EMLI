import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';
import config from './config/mod.ts';
import * as semantics from './semantics.ts';

const logger = config.logger('PARSER');

const grammar = ohm.grammar(config.grammar);
const sem = semantics.create(grammar);

export function parse(input: string) {
  const match = grammar.match(input);

  if(match.succeeded()) {
    logger.info('Parsed Successfully!');
  }else {
    logger.error(match.message as string);
  }
}