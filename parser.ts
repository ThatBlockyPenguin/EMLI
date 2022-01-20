import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';
import config from './emli-core/config/mod.ts';
import * as semantics from './semantics.ts';
import Document from './emli-core/types/document.ts';
import { SetMeta } from './emli-core/types/metacodes.ts';

// Create parser
const logger = config.logger('PARSER');

// Create grammar and semantics
const grammar = ohm.grammar(config.grammar);
const sem = semantics.create(grammar);

// Export `parse` function to parse EMLI
export function parse(input: string, log = true): Document | undefined {
  // Match input to `Document` rule
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

// Strip all `null`s
function refineIntermediary(doc: Document): Document {
  doc.contents = doc.contents.filter(el => el !== null);
  doc.meta = doc.meta.filter(m => m !== null);

  for(const meta of doc.meta) {
    if(meta instanceof SetMeta)
      doc.vars = Object.assign(doc.vars, { [meta.id]: meta.val });
  }

  return doc;
}
