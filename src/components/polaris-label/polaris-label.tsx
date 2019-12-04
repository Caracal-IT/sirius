import { Component, h, Prop, State } from "@stencil/core";
import { Unsubscribe } from "redux";
import { RootState } from "../../redux/state/Root.state";
import { Store } from "@stencil/redux";

@Component({
  tag: "polaris-label",
  shadow: true
})
export class PolarisLabel {
    storeUnsubscribe: Unsubscribe;
  
    @State() firstName: RootState["wf"]["model"]["registration"]["firstName"];
    @Prop({ context: "store" })store: Store;

    async componentWillLoad() {
      
        this.storeUnsubscribe = this.store.mapStateToProps(this, (state: RootState) => {
          let firstName = "";

          if(state && state.wf && state.wf.model && state.wf.model.registration) {
            firstName = state.wf.model.registration.firstName;
          }
            this.firstName
         
          return { firstName };   
        });
  }
  
  componentDidUnload() {
    this.storeUnsubscribe();
  }

  render() {
    return <div>FirstName {this.firstName}</div>;
  }
}