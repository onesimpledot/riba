# Leaflet Map Module

## Install

```bash
npm install --save @ribajs/leaflet-map
```

## Regist

To regist the module include `import leafletModule from '@ribajs/leaflet-map';` in your `main.ts` file and regist the module with `riba.module.regist(leafletModule);`:

```ts
import { Riba, coreModule } from '@ribajs/core';
import { leafletModule } from '@ribajs/leaflet-map';
import { ready } from '@ribajs/utils/src/dom';
const riba = new Riba();
const model = {};
riba.module.regist(coreModule);
riba.module.regist(leafletModule);
ready(() => {
  riba.bind(document.body, model);
});
```
