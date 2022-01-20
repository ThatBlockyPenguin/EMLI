export default {
  baseLevelElement: 'html > body'
} as TemplateConfig;

interface TemplateConfig {
  baseLevelElement: string,
  [x: string]: string;
}