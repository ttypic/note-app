import { calculateDiff } from './calculateDiff';

describe('calculateDiff testcases', function() {
  it('should work with selected text add', function() {
    const diff = calculateDiff('aba', 'abab', { start: 3, end: 3 }, { start: 4, end: 4 });
    expect(diff).toEqual({ startSelection: 3, endSelection: 3, replacement: 'b' });
  });

  it('should work with selected text deletion', function() {
    const diff = calculateDiff('aba', 'aa', { start: 2, end: 2 }, { start: 1, end: 1 });
    expect(diff).toEqual({ startSelection: 1, endSelection: 2, replacement: '' });
  });

  it('should work with selected text replacement', function() {
    const diff = calculateDiff('aba', 'x', { start: 0, end: 3 }, { start: 1, end: 1 });
    expect(diff).toEqual({ startSelection: 0, endSelection: 3, replacement: 'x' });
  });
});
