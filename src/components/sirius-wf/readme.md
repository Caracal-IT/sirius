# app-root



<!-- Auto Generated Below -->


## Events

| Event     | Description | Type               |
| --------- | ----------- | ------------------ |
| `wfError` |             | `CustomEvent<any>` |


## Methods

### `addActivity(type: string, create: any) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `goto(activity: string) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `loadProcess(process: Process) => Promise<void>`



#### Returns

Type: `Promise<void>`



### `parse(processDef: string) => Promise<Process>`



#### Returns

Type: `Promise<Process>`




## Dependencies

### Depends on

- [sirius-page](../sirius-page)

### Graph
```mermaid
graph TD;
  sirius-wf --> sirius-page
  style sirius-wf fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
