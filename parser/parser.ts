import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';
import config from '../emli-core/config/mod.ts';
import * as semantics from './semantics.ts';
import Document from '../emli-core/types/document.ts';
import { SetMeta } from '../emli-core/types/metacodes.ts';

// Create parser
const logger = config.logger('PARSER');

// Create grammar
const grammar = ohm.grammar(config.grammar);

// Export `parse` function to parse EMLI
export function parse(input: string, log = true): Document | undefined {
  // Create semantics
  const sem = semantics.create(grammar, log);

  // Match input to `Document` rule
  if(log)
    logger.info('Starting Parse...');
  const match = grammar.match(input, 'Document');

  if(match.succeeded()) {
    if(log)
      logger.info('Parsed successfully.');

    return refineIntermediary(
      sem(match).toIR()
    );
  }else if(log) {
    logger.error('Error parsing!')
    logger.warning(match.message as string);
  }
}

// Strip all `null`s and add vars
function refineIntermediary(doc: Document, log = true): Document {
  if(log)
    logger.info('Refining IR...');
  
  doc.contents = doc.contents.filter(el => el !== null);
  doc.meta = doc.meta.filter(m => m !== null);

  for(const meta of doc.meta) {
    if(meta instanceof SetMeta)
      doc.vars = Object.assign(doc.vars, { [meta.id]: meta.val });
  }

  if(log)
    logger.info('Done!');

  return doc;
}
