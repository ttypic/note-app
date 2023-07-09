export interface Diff {
  startSelection: number;
  endSelection: number;
  replacement: string;
}

export interface SelectionRange {
  start: number;
  end: number;
}


/**
 * ab|c - 2 -> abx|c - 3 -> Diff(start=2, end=2,'x')
 * ab|c - 2 -> a|c - 1 -> Diff(start=1, end=2,'')
 */
export const calculateDiff = (value: string, nextValue: string, prevPosition: SelectionRange, nextPosition: SelectionRange): Diff => {
  const startPrev = prevPosition.start;
  const endNext = nextPosition.start;
  const unchangedEnd = nextValue.length - endNext;
  const endPrev = value.length - unchangedEnd;

  if (startPrev > endNext) {
    return {
      startSelection: endNext,
      endSelection: endPrev,
      replacement: nextValue.slice(startPrev, endNext),
    };
  } else {
    return {
      startSelection: startPrev,
      endSelection: endPrev,
      replacement: nextValue.slice(startPrev, endNext),
    };
  }
};
