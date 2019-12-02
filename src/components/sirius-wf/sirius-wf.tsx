import { Component, Prop, State, h } from "@stencil/core";

import "@stencil/redux";
import { Store } from "@stencil/redux";
import { configureStore } from "../../store";
import { RootState } from "../../store/model/RootState";

@Component({
  tag: "sirius-wf",
  shadow: true
})
export class SiriusWf {
  @State()
  name: RootState["wf"]["name"];

  @Prop({ context: "store" })
  store: Store;

  async componentWillLoad() {
    this.store.setStore(configureStore({}));
    this.store.mapStateToProps(this, (state: RootState) => {
      const {
        app: { name }
      } = state;
      return {
        name
      };
    });
  }

  render() {
    return <div>Hello, my name is {this.name}</div>;
  }
}

/* 
import { Component, State, Prop, h } from '@stencil/core';
import { Store, Unsubscribe } from "@stencil/redux";
import { setAppName } from "../../store/actions/app";
import { RootState } from '../../store/model/RootState';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class MyComponent {
  storeUnsubscribe: Unsubscribe;
  setAppName: typeof setAppName;

  @State()
  name: RootState["app"]["name"];

  @Prop({ context: "store" })
  store: Store;

  componentWillLoad() {
    this.store.mapDispatchToProps(this, { setAppName });
    this.storeUnsubscribe = this.store.mapStateToProps(this, (state: RootState) => {
      const {
        app: { name }
      } = state;

      return {
        name
      };
    });
  }

  componentDidUnload() {
    this.storeUnsubscribe();
  }

  render() {
    return <div>
        <p>{this.name}</p>
        <input
          value={this.name}
          onInput={e => this.setAppName((e.target as any).value)}
        />
      </div>;
  }
}

*/
