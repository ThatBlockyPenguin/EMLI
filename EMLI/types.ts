// deno-lint-ignore-file no-explicit-any
import Logger from 'https://deno.land/x/stick@1.0.0-beta4/mod.ts';
import * as utils from './utils.ts';

const logger = new Logger.Builder().setName('INTERMEDIARY TYPES').build();

// HTML INTERMEDIARY //

export interface HTMLIntermediary {
  type: string,
  toHTML: (x?: any) => string
}

export class CustomHTMLIntermediary implements HTMLIntermediary {
  public type = 'custom';

  constructor(public data: string) {}

  toHTML() {
    return this.data;
  }
}

export class TextHTMLIntermediary implements HTMLIntermediary {
  public type = 'text';

  constructor(public data: string) {}

  toHTML(vars: SetMetaDesc[]) {
    if(vars.length === 0)
      return this.data;

    let data = this.data;

    for(const set of vars) {
      if(data.includes(`$${set.id}$`))
        data = data.replaceAll(`$${set.id}$`, set.value.toHTML(vars));
    }

    return data;
  }
}

export class BaseHTMLIntermediary implements HTMLIntermediary {
  public type = '__BASE__';

  constructor(public meta: MetaDesc[], public value: HTMLIntermediary[]) {}

  toHTML(x?: any) {
    let result = '';
    
    for(const value of this.value)
      result += '\n' + value.toHTML(x);

    return result;
  }
}

export class UnBodiedHTMLIntermediary implements HTMLIntermediary {
  constructor(public type: string, public properties?: Record<string, HTMLIntermediary>[][]) {}

  toHTML() {
    return `<${this.type} ${(this.properties !== undefined) ? utils.propertiesToHTML(this.properties) : ''}>`
  }
}

export class BodiedHTMLIntermediary implements HTMLIntermediary {
  constructor(public type: string, public value: HTMLIntermediary[], public properties?: Record<string, HTMLIntermediary>[][]) {}

  toHTML(x?: any) {
    let result = `<${this.type} ${(this.properties !== undefined) ? utils.propertiesToHTML(this.properties) : ''}>`;

    for(const value of this.value)
      result += '\n' + value.toHTML(x);
    
    result += `\n</${this.type}>`

    return result;
  }
}

// META DESC //

export interface MetaDesc {
  type: string
}

export class ImportMetaDesc implements MetaDesc {
  public type = 'import';
  public importType: 'js'|'css' | undefined;

  constructor(importType: string, public data: string) {
    if(importType !== 'js' && importType !== 'css')
      logger.error(new Error('Import Meta Intermediary type does not meet type requirements.'));
    else
      this.importType = importType;
  }
}

export class PostProcessorMetaDesc implements MetaDesc {
  public type = 'postprocessor';

  constructor(public js: string) {}
}

export class PreProcessorMetaDesc implements MetaDesc {
  public type = 'preprocessor';

  constructor(public js: string) {}
}

export class ModifyMetaDesc implements MetaDesc {
  public type = 'modify';

  constructor(public props: Record<string, string>) {}
}

export class TitleMetaDesc implements MetaDesc {
  public type = 'title';

  constructor(public title: string) {}
}

export class SetMetaDesc implements MetaDesc {
  public type = 'set';

  constructor(public id: string, public value: HTMLIntermediary) {}
}