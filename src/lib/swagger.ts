import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

export const getApiDocs = () => {
  const filePath = path.join(process.cwd(), '.docs', 'api', 'openapi.yaml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const spec = yaml.load(fileContents);
  return spec;
};
