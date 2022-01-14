export default String.raw`
EMLI {
  Document = MetaCodes ListOf<(Element | string | comments), spaces> end
  MetaCodes = (("#" (~nl space)* MetaCode) | "" "" comment)*
  MetaCode = "import" ("js" | "css") string ";"  --import
           | "postprocessor" jsBody              --postprocessor
           | "preprocessor" jsBody               --preprocessor
           | "modify" Properties ";"             --modify
           | "title" string ";"                  --title
  
  Element = BodiedCall | UnbodiedCall
  UnbodiedCall = identifier Properties? ";"
  BodiedCall = identifier Properties? Body

  Body = "{" (Element | string | comments)* "}"
  Properties = "(" ListOf<Property, ","> ")"
  Property = identifier ":" string
  
  identifier = ("-" | alnum)+
  nl (a new line) = "\\n"
  string = "'" (~"'" ~nl any)* "'"
         | "\"" (~"\"" ~nl any)* "\""
         | "${'`'}" (~"${'`'}" any)* "${'`'}"
  
  jsBody = "{" (~"}" any)* "}"
  
  comments = comment | htmlComment
  comment = "//" (~nl any)* nl
  htmlComment = "/!" (~nl any)* nl
}
`;
