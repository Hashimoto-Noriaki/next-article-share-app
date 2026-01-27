import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export const getApiDocs = (): Record<string, unknown> => {
  const filePath = path.join(process.cwd(), '.docs', 'api', 'openapi.yaml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const spec = yaml.load(fileContents) as Record<string, unknown>;
  return spec;
};
