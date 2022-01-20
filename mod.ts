import { parse } from './parser/parser.ts';
import { compile } from './compiler/compiler.ts';
import config from './emli-core/config/mod.ts';
import * as path from 'https://deno.land/std/path/mod.ts'
import jsonifyargs from 'https://gist.githubusercontent.com/ThatBlockyPenguin/f4da483d9884072197dea76c89282941/raw/3940ee575b53a863c65f2ddcb48ef70367be9445/mod.ts';
import Document from "./emli-core/types/document.ts";

const args = jsonifyargs();
const inFile = path.resolve((args.file ?? args[0] ?? './index.emli').toString());
const outFile = path.resolve((args.out ?? args[1] ?? './' + path.basename(inFile, path.extname(inFile)) + '.html').toString());

const logger = config.logger('MAIN');

if(Deno.lstatSync(inFile).isDirectory) {
  logger.info(`Directory input detected! Scanning ${inFile} for '*.emli' files...`);
  const files: string[] = [];

  for(const file of Deno.readDirSync(inFile)) {
    if(!file.isFile) continue;

    if(file.name.endsWith('.emli')) {
      files.push(path.resolve(inFile, file.name));
      logger.info(`Found '${file.name}'!`);
    }
  }

  for(const file of files) {
    console.log();
    run(file, path.basename(file, path.extname(file)) + '.html');
  }
}else run(inFile, outFile);


function run(inputFile: string, outputFile: string) {
  // Check `emliIn` file exists
  try {
    if (!Deno.lstatSync(inputFile).isFile)
      logger.error(`File '${inputFile}' could not be found.`, true);
  } catch (e: unknown) {
    if (e instanceof Deno.errors.NotFound)
      logger.error(`File '${inputFile}' could not be found.`, true);
    else
      throw e;
  }

  // Read `emliIn`
  logger.info(`Reading '${inputFile}'...`);
  const input = Deno.readTextFileSync(inputFile);

  const ir = parse(input);

  if (!ir)
    logger.error('Parsing failed! Aborting...', true);

  const html = compile(ir as Document);

  logger.info(`Writing HTML to ${outputFile}...`);
  Deno.writeTextFileSync(outputFile, html);
  logger.info('Done!');
}