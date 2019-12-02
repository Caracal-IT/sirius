import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "my-component",
  styleUrl: "my-component.css",
  shadow: true
})
export class MyComponent {
  @Prop()
  first: string;

  @Prop()
  middle: string;

  @Prop()
  last: string;

  render() {
    return (
      <div>
        Hello, World! I'm {this.first}
        {this.middle ? " " + this.middle : ""}
        {this.last ? " " + this.last : ""}
      </div>
    );
  }
}
