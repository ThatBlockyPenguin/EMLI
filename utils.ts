import ohm from 'https://cdn.jsdelivr.net/npm/ohm-js/dist/ohm.esm.js';
import placeholders from './config/imports.ts';
import { BaseHTMLIntermediary, HTMLIntermediary } from './types.ts';

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