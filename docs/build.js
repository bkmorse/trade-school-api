/**
 * Build script to combine modular OpenAPI spec files into a single openapi.json
 * Run this script whenever you update any of the module files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read base configuration
const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'base.json'), 'utf-8'));

// Combine all path files
const pathsDir = path.join(__dirname, 'paths');
const pathFiles = fs.readdirSync(pathsDir).filter(file => file.endsWith('.json'));
const paths = {};

for (const file of pathFiles) {
  const pathData = JSON.parse(fs.readFileSync(path.join(pathsDir, file), 'utf-8'));
  Object.assign(paths, pathData);
}

// Combine all schema files
const schemasDir = path.join(__dirname, 'schemas');
const schemaFiles = fs.readdirSync(schemasDir).filter(file => file.endsWith('.json'));
const schemas = {};

for (const file of schemaFiles) {
  const schemaData = JSON.parse(fs.readFileSync(path.join(schemasDir, file), 'utf-8'));
  Object.assign(schemas, schemaData);
}

// Build final OpenAPI spec
const openapi = {
  ...base,
  paths,
  components: {
    schemas
  }
};

// Write combined spec
const outputPath = path.join(__dirname, 'openapi.json');
fs.writeFileSync(outputPath, JSON.stringify(openapi, null, 2));

console.log('✅ OpenAPI spec built successfully!');
console.log(`   - Combined ${pathFiles.length} path file(s)`);
console.log(`   - Combined ${schemaFiles.length} schema file(s)`);
console.log(`   - Output: ${outputPath}`);

