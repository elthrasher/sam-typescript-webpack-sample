import logger from './logger';

describe('winston logger', () => {
  test('create the logger and return it', () => {
    expect(logger).toMatchSnapshot();
  });
});
