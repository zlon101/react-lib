export function getType(val: any, expectType?: string): string | boolean {
  const reaType = Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
  if (expectType) {
    return expectType.toLowerCase() === reaType;
  }
  return reaType;
}

export function createRegExp(searchText: string, param?: {isAllMatch: boolean; isCase: boolean}) {
  if (!searchText) return null;
  let isRegMode = false
  let reg = null;
  if (/^\//.test(searchText)) {
    isRegMode = true;
    const regModifier = /\/(\w*)$/;
    let modifier = regModifier.exec(searchText)![1];
    !modifier.includes('g') && (modifier += 'g');
    regModifier.lastIndex = 0;
    reg = new RegExp(searchText.slice(1).replace(regModifier, ''), modifier);
  } else {
    searchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (param?.isAllMatch) {
      searchText = `\\b${searchText}\\b`;
    }
    reg = new RegExp(searchText, param?.isCase ? 'gm' : 'gmi');
  }
  return [reg, isRegMode];
}


