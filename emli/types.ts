import Logger from 'https://deno.land/x/stick@1.0.0-beta4/mod.ts';
import * as utils from './utils.ts';

const logger = new Logger.Builder().setName('Intermediary Types').build();

// HTML INTERMEDIARY //

export interface HTMLIntermediary {
  type: string,
  toHTML: () => string
}

export class CustomHTMLIntermediary implements HTMLIntermediary {
  public type = 'custom';

  constructor(public data: string) {}

  toHTML() {
    return this.data;
  }
}

export class BaseHTMLIntermediary implements HTMLIntermediary {
  public type = '__BASE__';

  constructor(public meta: MetaDesc[], public value: HTMLIntermediary[]) {}

  toHTML() {
    let result = '';

    for(const value of this.value)
      result += '\n' + value.toHTML();

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

  toHTML() {
    let result = `<${this.type} ${(this.properties !== undefined) ? utils.propertiesToHTML(this.properties) : ''}>`;

    for(const value of this.value)
      result += '\n' + value.toHTML();
    
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

  constructor(public js: string) { }
}

export class PreProcessorMetaDesc implements MetaDesc {
  public type = 'preprocessor';

  constructor(public js: string) { }
}

export class ModifyMetaDesc implements MetaDesc {
  public type = 'modify';

  constructor(public props: Record<string, string>) { }
}

export class TitleMetaDesc implements MetaDesc {
  public type = 'title';

  constructor(public title: string) { }
}