export class Document {
  public vars: Record<string, IElement | Text>[] = [];
  constructor(public meta: MetaCode[], public contents: (IElement | Text | Comment)[]) {

  }
}

export interface MetaCode {
  trial?: boolean,
  unstable?: boolean,
  deprecated?: boolean,
}