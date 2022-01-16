// Imports
import Logger from 'https://deno.land/x/stick@1.0.0-beta5/mod.ts';
import ohm from 'https://cdn.jsdelivr.net/npm/ohm-js/dist/ohm.esm.js';
import * as utils from './utils.ts';
import { BaseHTMLIntermediary, BodiedHTMLIntermediary, CustomHTMLIntermediary, ImportMetaDesc, ModifyMetaDesc, PostProcessorMetaDesc, PreProcessorMetaDesc, SetMetaDesc, TextHTMLIntermediary, TitleMetaDesc, UnBodiedHTMLIntermediary } from './types.ts';
import grammarSrc from './config/grammar.ts';

// Logger "PARSER"
const logger = new Logger.Builder().setName('PARSER').build();

// Read grammar.ohm
logger.info('Creating EMLI grammar...');
const grammar = ohm.grammar(grammarSrc);

// Create "toIntermediate"
logger.info(`Creating 'toIntermediate' semantics for EMLI grammar...`);
const semantics = grammar.createSemantics().addOperation('toIntermediate', {
  Document: (meta, elements, _end) => new BaseHTMLIntermediary(meta.toIntermediate(), utils.toArray(elements)),
  MetaCodes: (_hash, _space, code) => code.toIntermediate(),
  MetaCode_import: (imp, type, string, _semi) => new ImportMetaDesc(type.sourceString, string.toIntermediate().data, imp.source.getLineAndColumnMessage()),
  MetaCode_postprocessor: (postprocessor, body) => new PostProcessorMetaDesc(body.toIntermediate(), postprocessor.source.getLineAndColumnMessage()),
  MetaCode_preprocessor: (preprocessor, body) => new PreProcessorMetaDesc(body.toIntermediate(), preprocessor.source.getLineAndColumnMessage()),
  MetaCode_modify: (modify, properties, _semi) => new ModifyMetaDesc(utils.arrToObj(properties.toIntermediate()), modify.source.getLineAndColumnMessage()),
  MetaCode_title: (title, string, _semi) => new TitleMetaDesc(string.toIntermediate().data, title.source.getLineAndColumnMessage()),
  MetaCode_set: (set, iden, _eq, element, _semi) => new SetMetaDesc(iden.sourceString, element.toIntermediate(), set.source.getLineAndColumnMessage()),

  UnbodiedCall: (iden, props, _semi) => new UnBodiedHTMLIntermediary(iden.sourceString, props.toIntermediate()),
  BodiedCall: (iden, props, body) => new BodiedHTMLIntermediary(iden.sourceString, body.toIntermediate(), props.toIntermediate()),

  Body: (_lb, elem, _rb) => elem.toIntermediate(),

  Properties: (_lp, props, _rp) => utils.toArray(props),
  Property: (id, _c, val) => ({ [id.sourceString]: val.toIntermediate() }),


  string: (_q1, text, _q2) => new TextHTMLIntermediary(text.sourceString),

  comment: (_slash, _text, _nl) => null,
  htmlComment: (_slashBang, text, _nl) => new CustomHTMLIntermediary(`<!-- ${text.sourceString.trim()} -->`),

  jsBody: (_lb, body, _rb) => body.sourceString.trim(),

  _iter: (...values) => {
    const result = [];

    for (const value of values)
      result.push(value.toIntermediate())

    return result;
  },
});

export function parse(data: string): BaseHTMLIntermediary | undefined {
  const match = grammar.match(data);

  if(match.succeeded()) {
    logger.info('Parsed successfully.');
    return utils.refineIntermediary(
      semantics(match).toIntermediate()
    );
  }else {
    logger.error('Error parsing!')
    logger.warning(match.message ?? 'Error getting parse error message!');
  }
}