import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { Configuration } from 'webpack';
import { yamlParse } from 'yaml-cfn';

/** Interface for AWS SAM Function */
interface ISamFunction {
  Type: string;
  Properties: {
    AssumeRolePolicyDocument?: JSON;
    AutoPublishAlias?: string;
    AutoPublishCodeSha256?: string;
    CodeUri?: string;
    Description?: string;
    Environment?: {
      Variables: {
        [key: string]: string;
      };
    };
    Events?: EventSource;
    FunctionName?: string;
    Handler: string;
    Layers?: { [Ref: string]: string }[];
    Runtime: string;
    Timeout?: number;
    Tracing?: string;
    VersionDescription?: string;
  };
}

// Grab Globals and Resources as objects from template yaml
const { Globals, Resources } = yamlParse(readFileSync(join(__dirname, 'template.yaml'), 'utf-8'));

// We use globals as a fallback, so make sure that object exists.
const GlobalFunction = Globals?.Function ?? {};

// Where my function source lives
const handlerPath = './src/handlers';

const entries = Object.values(Resources)
  // Take only the Lambda function resources
  .filter((resource: ISamFunction) => resource.Type === 'AWS::Serverless::Function')
  // Only nodejs Lambda functions
  .filter((resource: ISamFunction) => (resource.Properties?.Runtime ?? GlobalFunction.Runtime).startsWith('nodejs'))
  // Get filename for each function and output directory (if desired)
  .map((resource: ISamFunction) => ({
    filename: resource.Properties.Handler.split('.')[0],
    entryPath: resource.Properties.CodeUri.split('/').splice(1).join('/'),
  }))
  // Create hashmap of filename to file path
  .reduce(
    (resources, resource) =>
      Object.assign(resources, {
        [`${resource.entryPath}/${resource.filename}`]: `${handlerPath}/${resource.filename}.ts`,
      }),
    {},
  );
// Alternately just hardcode the entries
// e.g `entry: { ['hello/hello']: './src/handlers/hello.ts', ['goodbye/goodbye']: './src/handlers/goodbye.ts' },`

const config: Configuration = {
  entry: entries,
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: resolve(__dirname, 'build'),
  },
  mode: process.env.NODE_ENV === 'dev' ? 'development' : 'production',
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  target: 'node',
};

export default config;
