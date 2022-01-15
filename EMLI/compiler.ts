import { cheerio } from 'https://deno.land/x/cheerio@1.0.2/mod.ts';
import * as utils from './utils.ts';
import { BaseHTMLIntermediary, ImportMetaDesc, ModifyMetaDesc, PostProcessorMetaDesc, PreProcessorMetaDesc, SetMetaDesc, TitleMetaDesc } from './types.ts';
import Logger from "https://deno.land/x/stick@1.0.0-beta4/mod.ts";
import defaultConfig from './template-config.ts';
import template from './template.ts';

// Create Logger
const logger = new Logger.Builder().setName('COMPILER').build();

logger.info('Getting template config...');
let templateConfig = Object.assign({}, defaultConfig);

logger.info('Config: ' + JSON.stringify(templateConfig));

export function compile(intermediary: BaseHTMLIntermediary): string {
  const css: string[] = [];
  const js: string[] = [];
  const vars: SetMetaDesc[] = [];
  
  logger.info('Creating virtual DOM...');
  const $ = cheerio.load(template);

  logger.info('Converting Intermediary representation of MetaCodes to HTML...');
  // Convert Intermediary Meta to HTML
  for(const meta of intermediary.meta) {
    if(meta instanceof ImportMetaDesc) {
      if(meta.importType == 'css') // CSS
        css.push(utils.resolveImportCss(meta.data));
      else if (meta.importType == 'js') // JS   TODO: Module suport
        js.push(utils.resolveImportJs(meta.data));
    }else if(meta instanceof ModifyMetaDesc) { // MODIFY
      templateConfig = Object.assign(templateConfig, meta.props);
    }else if(meta instanceof PostProcessorMetaDesc) { // POST
      //STILL TODO -- JS EVAL
      logger.warning('PostProcessing is not yet implemented!');
    }else if(meta instanceof PreProcessorMetaDesc) { // PRE
      //STILL TODO -- JS EVAL
      logger.warning('PreProcessing is not yet implemented!');
    }else if(meta instanceof TitleMetaDesc) { // TITLE
      $('title').text(meta.title);
    }else if(meta instanceof SetMetaDesc) { // SET
      vars.push(meta);
    }
  }

  logger.info('Config: ' + JSON.stringify(templateConfig));

  logger.info('Adding MetaCode CSS to document...');
  // Add CSS to HTML
  for(const sheet of css) {
    const head = $('head');
    head.append(`<link rel="stylesheet" href="${sheet}">`);
  }

  logger.info('Adding MetaCode JS to document...');
  // Add JS to HTML
  for(const script of js) {
    const head = $('head');
    head.append(`<script defer src="${script}"></script>`);
  }

  logger.info('Converting Intermediary representation of (baseLevelElement) to HTML...');
  // Convert Intermediary to HTML
  let baseLevelElement = $(templateConfig.baseLevelElement);

  if(baseLevelElement.length == 0) {
    logger.error(`ERROR! (baseLevelElement = ${templateConfig.baseLevelElement}) does not exist! Falling back to defaults!`);
    templateConfig.baseLevelElement = defaultConfig.baseLevelElement;

    baseLevelElement = $(templateConfig.baseLevelElement);
  }

  logger.info('Config: ' + JSON.stringify(templateConfig));
  
  // Add html to ble
  logger.info('Adding (baseLevelElement) to Virtual DOM...');
  
  baseLevelElement!.append(intermediary.toHTML(vars));

  return $.html();
}