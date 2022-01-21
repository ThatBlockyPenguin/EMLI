import { IMetaCode } from './metacodes.ts';
import { Contents, NoCommentContents } from './elements.ts';

export default class Document {
  public vars: Record<string, NoCommentContents> = {};
  public customs: Record<string, NoCommentContents> = {};
  constructor(public meta: IMetaCode[], public contents: Contents[]) {}

  toHTML() {
    let result = '';

    for(const content of this.contents)
      result += content.toHTML(this);
    
    return result;
  }
}