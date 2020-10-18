import { render } from "@testing-library/react";

import Home from "../Home";

describe("Home", () => {
  it("renders without errors", () => {
    expect(() => render(<Home />)).not.toThrow();
  });
});
