# Photoswipe Module

## Install

```bash
npm install --save @ribajs/photoswipe
```

## Regist

To regist the module include `import photoswipeModule from '@ribajs/photoswipe';` in your `main.ts` file and regist the module with `riba.module.regist(photoswipeModule);`:

```ts
import { Riba, coreModule } from '@ribajs/core';
import { photoswipeModule } from '@ribajs/photoswipe';
import { ready } from '@ribajs/utils/src/dom';
const riba = new Riba();
const model = {};
riba.module.regist(coreModule);
riba.module.regist(photoswipeModule);
ready(() => {
  riba.bind(document.body, model);
});
```
