import { isCompliant } from '../src/app';

describe('Unit tests', () => {
  it('can test compliance', () => {
    let policies = [['a', 'b'], ['c', 'd'], ['a, b']];
    let keywords = ['a', 'b', 'a, b'];
    let results = [true, false, true];

    for (const [index, policy] of policies.entries()) {
      expect(isCompliant(policy, keywords[index])).toEqual(results[index]);
    }
  });
});
