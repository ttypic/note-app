import { calculateDiff } from './calculateDiff';

describe('calculateDiff', () => {
  it('should point to last index when add last char', () => {
    const diff = calculateDiff('aba', 'abac');
    expect(diff.startSelection).toBe(3);
    expect(diff.endSelection).toBe(3);
    expect(diff.replacement).toBe('c');
  });
  it('should point right when add in the middle', () => {
    const diff = calculateDiff('aa', 'aba');
    expect(diff.startSelection).toBe(1);
    expect(diff.endSelection).toBe(1);
    expect(diff.replacement).toBe('b');
  });
  it('should point right when delete', () => {
    const diff = calculateDiff('aba', 'aa');
    expect(diff.startSelection).toBe(1);
    expect(diff.endSelection).toBe(2);
    expect(diff.replacement).toBe('');
  });
});
