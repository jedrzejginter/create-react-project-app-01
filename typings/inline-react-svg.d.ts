// Typings for SVG files imports.
// Such files are handled by babel-plugin-inline-react-svg.
// (see: babel.config.js)
declare module "*.svg" {
  import type { FunctionComponent, SVGProps } from "react";

  const content: FunctionComponent<SVGProps<SVGElement>>;
  export default content;
}
