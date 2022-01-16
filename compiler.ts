import { cheerio } from 'https://deno.land/x/cheerio@1.0.2/mod.ts';
import * as utils from './utils.ts';
import { BaseHTMLIntermediary, ImportMetaDesc, MetaDesc, ModifyMetaDesc, PostProcessorMetaDesc, PreProcessorMetaDesc, SetMetaDesc, TitleMetaDesc } from './types.ts';
import Logger from 'https://deno.land/x/stick@1.0.0-beta5/mod.ts';
import defaultConfig from './config/template-config.ts';
import template from './config/template.ts';

// Create Logger
const logger = new Logger.Builder().setName('COMPILER').build();

logger.info('Getting template config...');
let templateConfig = Object.assign({}, defaultConfig);

logger.info('Config: ' + JSON.stringify(templateConfig));

export function compile(intermediary: BaseHTMLIntermediary): string {
  const css: string[] = [];
  const js: string[] = [];
  const vars: SetMetaDesc[] = [];
  const unstables: MetaDesc[] = [];
  const deprecateds: MetaDesc[] = [];
  
  logger.info('Creating virtual DOM...');
  const $ = cheerio.load(template);

  logger.info('Converting Intermediary representation of MetaCodes to HTML...');
  // Convert Intermediary Meta to HTML
  for(const meta of intermediary.meta) {
    if(meta.unstable)
      unstables.push(meta);
    
    if(meta.deprecated)
      deprecateds.push(meta);

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
  
  // Add html to baseLevelElement
  logger.info('Adding (baseLevelElement) to Virtual DOM...');
  
  baseLevelElement.append(intermediary.toHTML(vars));
  
  if(unstables.length > 0) {
    logger.warning('Unstable MetaCodes were used in this build - be warned that unstable features may become deprecated, removed, or non-functional at any time.');
    logger.warning('The unstable MetaCodes are:');

    for(const unstable of unstables)
      logger.warning(`#${unstable.type} on ${unstable.positionMsg.substring(0, unstable.positionMsg.indexOf(':')).toLocaleLowerCase()}`);
  }

  if(deprecateds.length > 0) {
    logger.warning('Deprecated MetaCodes were used in this build - be warned that deprecated features are likely to be removed in a future update.');
    logger.warning('The deprecated MetaCodes are:');

    for(const deprecated of deprecateds)
      logger.warning(`#${deprecated.type} on ${deprecated.positionMsg.substring(0, deprecated.positionMsg.indexOf(':')).toLocaleLowerCase()}`);
  }

  logger.info('Compiled Successfully!');
  return $.html();
}