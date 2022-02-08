import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';
import config from '../emli-core/config/mod.ts';
import Document from '../emli-core/types/document.ts';
import { CustomElementCall, CustomElementDef, HTMLComment, NonSelfClosingElement, SelfClosingElement, Text } from '../emli-core/types/elements.ts';
import { ImportMeta, ModificationMeta, PostProcessorMeta, PreProcessorMeta, SetMeta, TitleMeta } from '../emli-core/types/metacodes.ts';

const logger = config.logger('SEMANTICS BUILDER');

export function create(grammar: ohm.Grammar, log = true) {
  if(log)
    logger.info('Defining semantics for EMLI grammar...');

  const sem = grammar.createSemantics().addOperation('toIR', {
    Document: (meta, content, _end) => new Document(meta.toIR(), content.toIR()),
    MetaCodes: (_hash, _space, code) => code.toIR(),

    MetaCode_import: (imp, type, str, _semi) => new ImportMeta(type.sourceString as 'js' | 'css', (str.toIR() as Text).value, imp.source),
    MetaCode_postprocessor: (post, js) => new PostProcessorMeta(js.toIR(), post.source),
    MetaCode_preprocessor: (pre, js) => new PreProcessorMeta(js.toIR(), pre.source),
    MetaCode_modify: (mod, props, _semi) => new ModificationMeta(unfold(props.toIR()), mod.source),
    MetaCode_title: (title, str, _semi) => new TitleMeta((str.toIR() as Text).value, title.source),
    MetaCode_set: (set, iden, _eq, el, _semi) => new SetMeta(iden.toIR(), el.toIR(), set.source),

    Element_unbodied: (iden, props, _semi) => new SelfClosingElement(iden.toIR(), unfold(props.toIR())),
    Element_bodied: (iden, props, body) => new NonSelfClosingElement(iden.toIR(), unfold(props.toIR()), body.toIR()),
    Element_customCall: (custom, _colon, iden, props, _semi) => new CustomElementCall(iden.toIR(), unfold(props.toIR()), custom.source),

    ElemDef: (custom, _colon, iden, _eq, elem) => new CustomElementDef(iden.toIR(), elem.toIR(), custom.source),

    Body: (_lb, elem, _rb) => elem.toIR(),
    Properties: (_lb, propList, _rb) => { // SAME AS CUSTOMPROPS
      let props = {};

      for (const item of propList.toIR())
        props = Object.assign(props, item);
        
      return props;
    },
    CustomProps: (_lb, propList, _rb) => { // SAME AS PROPERTIES
      let props = {};

      for(const item of propList.toIR())
        props = Object.assign(props, item);

      return props;
    },
    Property: (iden, _colon, str) => ({ [iden.sourceString]: (str.toIR() as Text).value }),

    //DefStuff
    
    // deno-lint-ignore no-explicit-any
    ListOf: (list) => list.asIteration().children.map((c: any) => c.toIR()),

    identifier: (iden) => iden.sourceString,

    string: (_q1, text, _q2) => new Text(text.sourceString),

    jsBody: (_lb, contents, _rb) => contents.sourceString,
    comment: (_slashes, _contents, _nl) => null,
    htmlComment: (_slashBang, content, _nl) => new HTMLComment(content.sourceString),

    _iter: (...children) => children.map(c => c.toIR()),
  });

  if(log)
    logger.info('Done!');

  return sem;
}

function unfold(props: [Record<string, string>] | Record<string, string>[] | Record<string, string>): Record<string, string> {
  if(Array.isArray(props))
    if(props.length == 0) return {};
    else return props[0];
  else return props;
}
