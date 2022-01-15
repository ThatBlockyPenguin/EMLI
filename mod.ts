// Imports
import * as path from 'https://deno.land/std/path/mod.ts'
import Logger from 'https://deno.land/x/stick@1.0.0-beta4/mod.ts';
import jsonifyargs from 'https://gist.githubusercontent.com/ThatBlockyPenguin/f4da483d9884072197dea76c89282941/raw/3940ee575b53a863c65f2ddcb48ef70367be9445/mod.ts';
import * as parser from './parser.ts';
import * as compiler from './compiler.ts';

// Create Logger
const logger = new Logger.Builder().setName('MAIN').build();

// Get args
const args = jsonifyargs();
const emliIn = path.resolve((args.file ?? args[0] ?? './index.emli').toString());
const htmlOut = path.resolve((args.out ?? args[1] ?? './' + path.basename(emliIn, path.extname(emliIn)) + '.html').toString());

// Pre-create "not found" error
const noFileErr = new Error(`File '${emliIn}' could not be found.`);

// Check `emliIn` file exists
try {
  if(!Deno.lstatSync(emliIn).isFile)
    logger.error(noFileErr);
}catch(e: unknown) {
  if(e instanceof Deno.errors.NotFound)
    logger.error(noFileErr);
  else
    throw e;
}

// Read `emliIn`
logger.info(`Reading '${emliIn}'...`);
const data = Deno.readTextFileSync(emliIn);

// Parse inputted data to intermediary
logger.info('Starting parse to intermediary...');
const intermediary = parser.parse(data);

// If parsing failed, exit
if(!intermediary)
  Deno.exit();

// Otherwise, compile intermediary to html
logger.info('Starting compile to html...');
const html = compiler.compile(intermediary);

logger.info('Compiled sucessfully!');

// Then write html to output
logger.info(`Writing '${htmlOut}'...`);
Deno.writeTextFileSync(htmlOut, html);

console.log();
logger.info('DONE!');