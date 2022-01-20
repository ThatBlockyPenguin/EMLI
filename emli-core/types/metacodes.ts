import { NoCommentContents } from './elements.ts';

export interface IMetaCode {
  trial?: boolean,
  unstable?: boolean,
  deprecated?: boolean,
}

export class ImportMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;

  constructor(public type: 'js' | 'css', public src: string) {}
}

export class PostProcessorMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;

  constructor(public js: string) {}
}

export class PreProcessorMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;

  constructor(public js: string) {}
}

export class ModificationMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;

  constructor(public properties: Record<string, string>) {}
}

export class TitleMeta implements IMetaCode {
  public trial = false;
  public unstable = false;
  public deprecated = false;

  constructor(public title: string) {}
}

export class SetMeta implements IMetaCode {
  public trial = false;
  public unstable = true;
  public deprecated = false;

  constructor(public id: string, public val: NoCommentContents) {}
}