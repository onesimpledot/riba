# Content-Slider Module

## Install

```bash
npm install --save @ribajs/content-slider
```

## Regist

To regist the module include `import contentSlider from '@ribajs/content-slider';` in your `main.ts` file and regist the module with `riba.module.regist(contentSlider);`:

```ts
import { Riba, coreModule } from '@ribajs/core';
import { ready } from '@ribajs/utils/src/dom';
import { bs4Module } from "@ribajs/bs4";
import { extrasModule } from "@ribajs/extras";c
import { contentSlider } from '@ribajs/content-slider';
const riba = new Riba();
const model = {};
riba.module.regist(coreModule);
riba.module.regist(bs4Module);
riba.module.regist(extrasModule);
riba.module.regist(contentSlider);
ready(() => {
  riba.bind(document.body, model);
});
```
