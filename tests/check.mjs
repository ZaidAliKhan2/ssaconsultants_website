// Lightweight static/code checks only. No server or browser is launched.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';

const pages = new Map();
const componentSource = readFileSync('js/components.js', 'utf8').replace(/^export /gm, '');
for (const filename of readdirSync('.').filter(name => name.endsWith('.html'))) {
  const source = readFileSync(filename, 'utf8');
  const page = source.match(/<body\b[^>]*\bdata-page="([^"]+)"/)?.[1] || 'home';
  const registry = new Map();
  runInNewContext(componentSource, {
    document: { body: { dataset: { page } } },
    HTMLElement: class { constructor() { this.dataset = {}; this.innerHTML = ''; } },
    customElements: { get: name => registry.get(name), define: (name, component) => registry.set(name, component) }
  });
  let html = source;
  for (const [name, Component] of registry) {
    const component = new Component();
    component.connectedCallback();
    html = html.replace(`<${name}></${name}>`, component.innerHTML);
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${filename}: duplicate IDs`);
  const currentLinks = [...html.matchAll(/<a\b[^>]*aria-current="page"[^>]*>([^<]+)<\/a>/g)];
  const expectedLabel = { home: 'Home', services: 'Services', about: 'About', why: 'Why SSA', contact: 'Contact' }[page];
  assert.ok(expectedLabel || ['privacy', 'terms'].includes(page), `${filename}: recognized page`);
  assert.equal(currentLinks.length, expectedLabel ? 2 : 0, `${filename}: current page in desktop and mobile navigation`);
  currentLinks.forEach(match => assert.equal(match[1], expectedLabel, `${filename}: active navigation label`));
  pages.set(resolve(filename), { html, ids: new Set(ids) });
}
const local = value => !/^(https?:|mailto:|tel:|data:)/.test(value);
for (const [filename, { html }] of pages) {
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (!local(match[1])) continue;
    const [path, hash] = match[1].split('#');
    const target = path ? resolve(dirname(filename), path.split('?')[0]) : filename;
    assert.ok(existsSync(target), `${filename}: missing file ${match[1]}`);
    if (hash && pages.has(target)) assert.ok(pages.get(target).ids.has(decodeURIComponent(hash)), `${filename}: missing anchor ${match[1]}`);
  }
  for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const file = candidate.trim().split(/\s+/)[0];
      if (local(file)) assert.ok(existsSync(resolve(dirname(filename), file)), `Missing image: ${file}`);
    }
  }
}
for (const name of readdirSync('js').filter(name => name.endsWith('.js'))) {
  const file = resolve('js', name);
  execFileSync(process.execPath, ['--check', file]);
  for (const match of readFileSync(file, 'utf8').matchAll(/(?:from\s+|import\s*)["'](\.\.?\/[^"']+)["']/g)) {
    assert.ok(existsSync(resolve(dirname(file), match[1])), `Missing import: ${match[1]}`);
  }
}
console.log(`${pages.size} pages checked: shared components, local links and anchors, assets, JavaScript syntax and imports. No browser used.`);
