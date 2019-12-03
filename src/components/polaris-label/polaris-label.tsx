import { Component, h, Prop, State } from "@stencil/core";
import { Unsubscribe } from "redux";
import { RootState } from "../../store/model/RootState";
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
          const {        
            wf: {
              model: {
                registration: {
                  firstName: firstName
                }
              }
            }
          } = state;
          return {
            firstName
          };
        });
      }
    
      componentDidUnload() {
        this.storeUnsubscribe();
      }

  render() {
    return <div>FirstName {this.firstName}</div>;
  }
}