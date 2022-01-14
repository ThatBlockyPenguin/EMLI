import Logger from 'https://deno.land/x/stick@1.0.0-beta4/mod.ts';
import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';
import * as path from 'https://deno.land/std/path/mod.ts';
import { BaseHTMLIntermediary, HTMLIntermediary } from './types.ts';

// Create Logger
const logger = new Logger.Builder().setName('EMLI compiler | UTILS').build();

logger.info('Reading import placeholders...');
const placeholders: Placeholders = JSON.parse(read('imports.json'));

export function toArray(node: ohm.Node): [] {
  return node.asIteration().children.map((p: ohm.Node) => p.toIntermediate())
}

export function refineIntermediary(data: BaseHTMLIntermediary): BaseHTMLIntermediary {
  data.value = data.value.filter(v => v !== null);
  return data;
}

export function resolveImportCss(data: string) {
  const url: string | undefined = placeholders.css[data];

  if(url !== undefined)
    return url;
  else
    return data;
}

export function resolveImportJs(data: string) {
  const url: string | undefined = placeholders.js[data];

  if (url !== undefined)
    return url;
  else
    return data;
}

interface Placeholders {
  js: Record<string, string>,
  css: Record<string, string>,
}

export function propertiesToHTML(properties: Record<string,HTMLIntermediary>[][]) {
  let result = '';

  for(const key in properties) {
    const pair = arrToObj(properties[key]);
    
    for(const k in pair) {
      result += `${k}="${pair[k]}" `;
    }
  }

  return result.substring(0, result.length);
}

export function arrToObj(arr: Record<string, HTMLIntermediary>[]): Record<string, string> {
  let obj = {};

  for(const pair of arr) {
    const keys = Object.keys(pair);

    for(let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = pair[key];
      
      // @ts-ignore: This works ¯\_(ツ)_/¯
      obj = Object.assign(obj, { [key]: value.data });
    }
  }

  return obj;
}
                                                                          // Start of string > one or more "/"
export function read(file: string): string {                              // Or end of string > one or more "/"
  return Deno.readTextFileSync(path.dirname(import.meta.url).replace('file:', '').replace(/^\/+|\/+$/g, '') + '/' + file);
}
