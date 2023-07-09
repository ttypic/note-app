interface Diff {
  startSelection: number;
  endSelection: number;
  replacement: string;
}

export const calculateDiff = (value: string, nextValue: string): Diff => {
  let startSelection = 0;
  let endSelection = 1;

  while (value[startSelection] === nextValue[startSelection] && nextValue[startSelection] && value[startSelection]) startSelection++;
  while (value[value.length - endSelection] === nextValue[nextValue.length - endSelection] && nextValue[nextValue.length - endSelection] && value[value.length - endSelection]) endSelection++;

  return {
    startSelection,
    endSelection: value.length - endSelection + 1,
    replacement: nextValue.slice(startSelection, nextValue.length - endSelection + 1),
  };
};
