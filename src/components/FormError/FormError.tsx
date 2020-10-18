import type { JSXComponentProps } from "@/types/react";

type Props = JSXComponentProps<"div">;

export default function FormError({ style, ...props }: Props) {
  return <div style={{ color: "red", ...style }} {...props} />;
}
