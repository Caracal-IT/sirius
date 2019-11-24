import { Component, Prop, State, h } from "@stencil/core";

import "@stencil/redux";
import { Store } from "@stencil/redux";
import { configureStore } from "../../store";
import { RootState } from "../../store/model/RootState";

@Component({
    tag: "polaris-wf"
})
export class PolarisWf {
    @State()
    name: RootState["app"]["name"];

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
        return (
          <div>
            Hello, my name is {this.name}
            <my-component/>
          </div>
        );
    }
}