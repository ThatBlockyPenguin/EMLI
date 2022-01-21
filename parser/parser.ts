import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';
import config from '../emli-core/config/mod.ts';
import * as semantics from './semantics.ts';
import Document from '../emli-core/types/document.ts';
import { SetMeta } from '../emli-core/types/metacodes.ts';
import { CustomElementDef } from "../emli-core/types/elements.ts";
import { IDeprecatable, isIDep } from "../emli-core/types/deprecatable.ts";

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
  let reRefine = false;

  if(log)
    logger.info('Refining IR...');
  
  doc.contents = doc.contents.filter(el => el !== null);
  doc.meta = doc.meta.filter(m => m !== null);

  for(const meta of doc.meta) {
    if(meta instanceof SetMeta) {
      if(log) checkDep(meta);
      doc.vars = Object.assign(doc.vars, { [meta.id]: meta.val });
    }
  }

  for(const key in doc.contents) {
    const content = doc.contents[key];

    if(isIDep(content)) {
      if(log) checkDep(content);

      // CustomElementDef implements IDeprecatable
      if(content instanceof CustomElementDef) {
        doc.customs = Object.assign(doc.customs, { [content.identifier]: content });
        //@ts-ignore: Trust me, TS
        doc.contents[key] = null;
        reRefine = true;
      }
    }
  }

  if(reRefine) {
    if(log) logger.info('Re-refining IR...');
    refineIntermediary(doc, false)
    if(log) logger.info('Done!');
  }

  if(log) logger.info('Refining complete!');
  return doc;
}

function checkDep(item: IDeprecatable) {
  if(item.deprecated) {
    logger.warning('Deprecated features were used in this build! See https://emli.blockypenguin.com/doc/deprecation for more info.');
    logger.warning(`Deprecated feature at ${item.position}!`);
  }

  if(item.trial) {
    logger.warning('Trial-mode features were used in this build! See https://emli.blockypenguin.com/doc/trial-mode for more info.');
    logger.warning(`Trial-mode features at ${item.position}!`);
  }

  if(item.unstable) {
    logger.warning('Unstable features were used in this build! See https://emli.blockypenguin.com/doc/unstable for more info.');
    logger.warning(`Unstable features at ${item.position}!`);
  }
}
