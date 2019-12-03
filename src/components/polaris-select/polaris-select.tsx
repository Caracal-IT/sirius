import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "polaris-select",
  shadow: true
})
export class polarisSelect {
  @Prop()
  value;

  render() {
    return (
      <div>
        <select onInput={e => (this.value = e.target["value"])}>
          <option value="-1">Select An Option</option>
          <option value="1" selected = {this.value === "1"}>One</option>
          <option value="2" selected = {this.value === "2"}>Two</option>
          <option value="3"selected = {this.value === "3"}>Three</option>
        </select>
      </div>
    );
  }
}
