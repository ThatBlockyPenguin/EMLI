import { cheerio } from 'https://deno.land/x/cheerio@1.0.2/mod.ts';
import Document from '../emli-core/types/document.ts';
import config from '../emli-core/config/mod.ts';
import { ImportMeta, ModificationMeta, PostProcessorMeta, PreProcessorMeta, TitleMeta } from '../emli-core/types/metacodes.ts';

const logger = config.logger('COMPILER');

let templateConfig = Object.assign({}, config.template.config);

export function compile(doc: Document, log = true): string {
  if(log) logger.info('Starting Compilation...');

  // LOAD TEMPLATE
  if (log) logger.info('Creating virtual DOM...');
  const $ = cheerio.load(config.template.get());


  /////////////////////////////////////////////////////
  ///            META HANDLING CODE BELOW           ///
  /////////////////////////////////////////////////////

  const imports: ImportMeta[] = [];
  const postprocessors: PostProcessorMeta[] = [];
  const preprocessors: PreProcessorMeta[] = [];
  const mods: ModificationMeta[] = [];
  let title: string | undefined;

  for(const meta of doc.meta) {
    if(meta instanceof ImportMeta) {
      imports.push(meta);

    }else if(meta instanceof PostProcessorMeta) {
      postprocessors.push(meta);
      if(log) logger.warning('Encountered PostProcessor in compilation! Be warned that PostProcessors are not yet implemented and will have no effect!');

    }else if(meta instanceof PreProcessorMeta) {
      preprocessors.push(meta);
      if(log) logger.warning('Encountered PreProcessor in compilation! Be warned that PreProcessors are not yet implemented and will have no effect!');

    }else if(meta instanceof ModificationMeta) {
      mods.push(meta);

    }else if(meta instanceof TitleMeta) {
      title = meta.title;
    }

    // Set Metas are dealt with by the parser

    if(meta.deprecated && log) {
      logger.warning('Deprecated MetaCodes were used in this build! See https://emli.blockypenguin.com/doc/deprecation for more info.');
      logger.warning(`Deprecated MetaCode at ${meta.position}!`);
    }
    
    if(meta.trial && log) {
      logger.warning('Trial-mode MetaCodes were used in this build! See https://emli.blockypenguin.com/doc/trial-mode for more info.');
      logger.warning(`Trial-mode MetaCode at ${meta.position}!`);
    }
    
    if(meta.unstable && log) {
      logger.warning('Unstable MetaCodes were used in this build! See https://emli.blockypenguin.com/doc/unstable for more info.');
      logger.warning(`Unstable MetaCode at ${meta.position}!`);
    }
  }

  /////////////////////////////////////////////////////
  ///          CONFIG HANDLING CODE BELOW           ///
  /////////////////////////////////////////////////////

  // Log config before modification
  if(log) logger.info('Config: ' + JSON.stringify(templateConfig));

  // Set config from `#modify`s
  if(mods.length > 0) {
    if(log)
      logger.info('Modifying Config!');

    for(const mod of mods)
      templateConfig = Object.assign(templateConfig, mod.properties);

    // Log config after modification
    if(log) logger.info('Config: ' + JSON.stringify(templateConfig));
  }


  /////////////////////////////////////////////////////
  ///           HTML TRANSFORM CODE BELOW           ///
  /////////////////////////////////////////////////////

  /* 
   * PREPROCESSOR LOGIC
   *    GOES HERE!
   */

  // Set title if required
  if(title)
    $('title').text(title);
  
  // Add `#import`s
  for(const imp of imports) {
    if(imp.type === 'js')
      $('head').append(`<script defer src="${resolveImp(imp)}"></script>`);
    else if(imp.type === 'css')
      $('head').append(`<link rel="stylesheet" href="${resolveImp(imp)}">`);
  }

  // Get baseLevelElement from config
  let baseLevelElement = $(templateConfig.baseLevelElement);
  
  if(baseLevelElement.length == 0) {
    if(log) logger.error(`ERROR! (baseLevelElement = ${templateConfig.baseLevelElement}) does not exist! Falling back to defaults!`);
    templateConfig.baseLevelElement = config.template.config.baseLevelElement;

    baseLevelElement = $(templateConfig.baseLevelElement);

    if(baseLevelElement.length == 0)
      logger.error(`FATAL ERROR! Default baseLevelElement (${templateConfig.baseLevelElement}) could not be found! Aborting!`, true);
  }

  if(log) logger.info('Config: ' + JSON.stringify(templateConfig));

  // Add html to baseLevelElement
  if(log) logger.info('Adding (baseLevelElement) to Virtual DOM...');
  baseLevelElement.append(doc.toHTML());

  if(log) logger.info('Done!');
  return $.html();
}

function resolveImp(imp: ImportMeta) {
  if(imp.type == 'js')
    if(Object.keys(config.placeholders.js).includes(imp.src))
      return config.placeholders.js[imp.src];
  if(imp.type == 'css')
    if(Object.keys(config.placeholders.css).includes(imp.src))
      return config.placeholders.css[imp.src];
  return imp.src;
}