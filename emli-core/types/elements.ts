import Document from './document.ts';
import config from '../config/mod.ts';
import { IDeprecatable } from "./deprecatable.ts";
import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';

const logger = config.logger('INTERMEDIARY TYPES');

export type Contents = NoCommentContents | HTMLComment;
export type NoCommentContents = IElement | CustomElementCall | Text;

export class Text {
  constructor(public value: string) { }

  toHTML(doc: Document) {
    let value = this.value;

    for(const id in doc.vars)
      if(this.value.includes(`$${id}$`))
        value = value.replaceAll(`$${id}$`, doc.vars[id].toHTML(doc));
    
    return value;
  }
}

export class HTMLComment {
  constructor(public value: string) { }

  toHTML(_doc: Document) {
    return `<!-- ${this.value.trim()} -->`;
  }
}

export interface IElement {
  name: string,
  attributes: Record<string, string>,
  contents?: Contents[],
  selfClosing: boolean
  toHTML: (doc: Document) => string;
}

export class SelfClosingElement implements IElement {
  public selfClosing = true;

  constructor(public name: string, public attributes: Record<string, string>) {}

  toHTML(_doc: Document) {
    let result = `<${this.name}`;

    for(const att in this.attributes)
      result += ` ${att}="${this.attributes[att]}"`;
    
    result += '>';
    return result;
  }
}

export class NonSelfClosingElement implements IElement {
  public selfClosing = false;

  constructor(public name: string, public attributes: Record<string, string>, public contents: Contents[]) { }

  toHTML(doc: Document) {
    let result = `<${this.name}`;

    for(const att in this.attributes)
      result += ` ${att}="${this.attributes[att]}"`;

    result += '>';

    for(const content of this.contents)
      result += content.toHTML(doc);
    
    result += `</${this.name}>`
    return result;
  }
}

export class CustomElementCall implements IDeprecatable {
  public trial = true;
  public unstable = false;
  public deprecated = false;
  public position;

  constructor(public identifier: string, public properties: Record<string, string>, pos: ohm.Interval) {
    this.position = pos.getLineAndColumnMessage().substring(0, pos.getLineAndColumnMessage().indexOf(':')).toLowerCase();
  }

  toHTML(doc: Document): string {
    const elem = doc.customs[this.identifier];

    if(!elem)
      logger.error(`No custom element found with identifier: '${this.identifier}'!`, true);
    
    return elem.toHTML(
      Object.assign(
        {},
        doc,
        { vars: stringRecordToTextRecord(this.properties) }
      )
    );
  }
}

export class CustomElementDef implements IDeprecatable {
  public trial = true;
  public unstable = false;
  public deprecated = false;
  public position;

  constructor(public identifier: string, public elem: NoCommentContents, pos: ohm.Interval) {
    this.position = pos.getLineAndColumnMessage().substring(0, pos.getLineAndColumnMessage().indexOf(':')).toLowerCase();
  }

  toHTML(doc: Document): string {
    return this.elem.toHTML(doc);
  }
}

function stringRecordToTextRecord(recIn: Record<string, string>): Record<string, Text> {
  const recOut: Record<string, Text> = {};

  for(const key in recIn)
    recOut[key] = new Text(recIn[key])
  
  return recOut;
}
