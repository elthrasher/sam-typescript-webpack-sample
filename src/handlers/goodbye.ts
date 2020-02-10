import { APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  return { body: JSON.stringify({ message: 'goodbye' }), statusCode: 200 };
};
