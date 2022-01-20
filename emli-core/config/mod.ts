import grammar from './grammar.ts';
import placeholders from './placeholders.ts';
import template from './template.ts';
import templateconfig from './template-config.ts';
import Logger from 'https://deno.land/x/stick@1.0.0-beta5/mod.ts';

export default {
  grammar,
  placeholders,
  template: Object.assign(template, {config: templateconfig}),
  logger: (name: string) => new Logger.Builder().setLabel(Logger.Labels.HH_MM_SS).setName(name).build(),
}