import logger from '../util/logger';
import { handler } from './hello';

let spy: jest.SpyInstance;

beforeAll(() => {
  spy = jest.spyOn(logger, 'info').mockImplementation();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('hello handler', () => {
  it('should say hello', async () => {
    const result = await handler();
    expect(result).toMatchSnapshot();
  });
  it('should log to winston when called', async () => {
    await handler();
    expect(spy).toMatchSnapshot();
  });
});
