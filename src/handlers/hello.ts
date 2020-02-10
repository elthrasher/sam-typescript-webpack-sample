import { APIGatewayProxyResult } from 'aws-lambda';

import logger from '../util/logger';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  logger.info(`time to say 'hello'`);
  return { body: JSON.stringify({ message: 'hello' }), statusCode: 200 };
};
