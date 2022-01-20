export type Contents = NoCommentContents | HTMLComment;
export type NoCommentContents = IElement | Text;

export class Text {
  constructor(public value: string) { }

  toHTML(vars: Record<string, NoCommentContents>) {
    for(const id in vars)
      if(this.value.includes(`$${id}$`))
        this.value = this.value.replaceAll(`$${id}$`, vars[id].toHTML(vars));
    
    return this.value;
  }
}

export class HTMLComment {
  constructor(public value: string) { }

  toHTML(_vars: Record<string, NoCommentContents>) {
    return `<!-- ${this.value.trim()} -->`;
  }
}

export interface IElement {
  name: string,
  attributes: Record<string, string>,
  contents?: Contents[],
  selfClosing: boolean
  toHTML: (vars: Record<string, NoCommentContents>) => string;
}

export class SelfClosingElement implements IElement {
  public selfClosing = true;

  constructor(public name: string, public attributes: Record<string, string>) {}

  toHTML(_vars: Record<string, NoCommentContents>) {
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

  toHTML(vars: Record<string, NoCommentContents>) {
    let result = `<${this.name}`;

    for(const att in this.attributes)
      result += ` ${att}="${this.attributes[att]}"`;

    result += '>';

    for(const content of this.contents)
      result += content.toHTML(vars);
    
    result += `</${this.name}>`
    return result;
  }
}