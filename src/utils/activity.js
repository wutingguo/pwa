export function prefix(location, ...prefixes) {
  return prefixes.some(prefix => location.href.indexOf(`${location.origin}/${prefix}`) !== -1);
}

export function navbar(location) {
  return true;
}

export function designer(location) {
  return prefix(location, 'designer');
}

export function software(location) {
  return prefix(location, 'software');
}

export function testFunc() {
  console.log('test func11');
}
