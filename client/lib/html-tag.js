export function html(strings, ...vars) {
  let result = '';
  strings.forEach((str, i) => {
    result += `${str}${i === strings.length - 1 ? '' : vars[i]}`;
  });
  return result;
}
export function css(e) {
  return e[0];
}
