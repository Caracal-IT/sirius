import { p as patchBrowser, g as globals, b as bootstrapLazy } from './core-714f54fe.js';

patchBrowser().then(options => {
  globals();
  return bootstrapLazy([["sirius-page",[[1,"sirius-page",{"page":[16],"modelService":[16]}]]],["sirius-wf",[[1,"sirius-wf",{"context":[32],"page":[32],"addActivity":[64],"goto":[64],"loadProcess":[64],"parse":[64]}]]]], options);
});
