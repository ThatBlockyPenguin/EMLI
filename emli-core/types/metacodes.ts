import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';
import { NoCommentContents } from './elements.ts';
import { IDeprecatable } from './deprecatable.ts';

// deno-lint-ignore no-empty-interface
export interface IMetaCode extends IDeprecatable {}

export class ImportMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;
  public position;

  constructor(public type: 'js' | 'css', public src: string, pos: ohm.Interval) {
    this.position = pos.getLineAndColumnMessage().substring(0, pos.getLineAndColumnMessage().indexOf(':')).toLowerCase();
  }
}

export class PostProcessorMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;
  public position;

  constructor(public js: string, pos: ohm.Interval) {
    this.position = pos.getLineAndColumnMessage().substring(0, pos.getLineAndColumnMessage().indexOf(':')).toLowerCase();
  }
}

export class PreProcessorMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;
  public position;

  constructor(public js: string, pos: ohm.Interval) {
    this.position = pos.getLineAndColumnMessage().substring(0, pos.getLineAndColumnMessage().indexOf(':')).toLowerCase();
  }
}

export class ModificationMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;
  public position;

  constructor(public properties: Record<string, string>, pos: ohm.Interval) {
    this.position = pos.getLineAndColumnMessage().substring(0, pos.getLineAndColumnMessage().indexOf(':')).toLowerCase();
  }
}

export class TitleMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;
  public position;

  constructor(public title: string, pos: ohm.Interval) {
    this.position = pos.getLineAndColumnMessage().substring(0, pos.getLineAndColumnMessage().indexOf(':')).toLowerCase();
  }
}

export class SetMeta implements IMetaCode {
  public trial = false;
  public unstable = true;
  public deprecated = false;
  public position;

  constructor(public id: string, public val: NoCommentContents, pos: ohm.Interval) {
    this.position = pos.getLineAndColumnMessage().substring(0, pos.getLineAndColumnMessage().indexOf(':')).toLowerCase();
  }
}