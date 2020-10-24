import { memo } from "react";

type Props = JSX.IntrinsicElements["div"];

function FormError({ style, ...props }: Props) {
  return <div style={{ color: "red", ...style }} {...props} />;
}

export default memo(FormError);
