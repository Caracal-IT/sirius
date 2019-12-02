import { newE2EPage } from "@stencil/core/testing";

describe("sirius-wf", () => {
  it("renders", async () => {
    const page = await newE2EPage();

    await page.setContent("<sirius-wf></sirius-wf>");
    const element = await page.find("sirius-wf");

    expect(element).toHaveClass("hydrated");
  });

  it("renders changes to the name data", async () => {
    const page = await newE2EPage();

    await page.setContent("<sirius-wf></sirius-wf>");
    const component = await page.find("sirius-wf");
    const element = await page.find("sirius-wf >>> div");
    expect(element.textContent).toEqual(`Hello, my name is Sirius Workflow`);
  });
});
