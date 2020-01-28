import { Config } from "@stencil/core";

export const config: Config = {
  namespace: "sirius",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader"
    },
    {
      type: "docs-readme"
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers
      copy: [
        { src: 'workflow', dest: 'wf' },
        { src: 'demo', dest: 'demo' }
      ]
    }/*
    ,
    {
      type: 'www',
      dir: 'docs',
      serviceWorker: null,
      copy: [
        { src: '../www', dest: '' },
        { src: 'workflow', dest: 'wf' },
        { src: 'demo', dest: 'demo' }
      ]
    }
  */
  ]
};
