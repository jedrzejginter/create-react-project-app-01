import { forwardRef, memo, Ref } from "react";

const spinnerData = [
  { rotateX: 0, begin: -1 },
  { rotateX: 40, begin: -8 / 9 },
  { rotateX: 80, begin: -7 / 9 },
  { rotateX: 120, begin: -6 / 9 },
  { rotateX: 160, begin: -5 / 9 },
  { rotateX: 200, begin: -4 / 9 },
  { rotateX: 240, begin: -3 / 9 },
  { rotateX: 280, begin: -2 / 9 },
  { rotateX: 320, begin: -1 / 9 },
];

type Props = JSX.IntrinsicElements["svg"] & {
  size: number;
};

function Spinner({ size, ...props }: Props, ref?: Ref<SVGSVGElement>) {
  return (
    <svg {...props} height={size} width={size} ref={ref} viewBox="10 10 80 80">
      {spinnerData.map(({ rotateX, begin }) => (
        <rect
          className="fill-current"
          height="20"
          key={rotateX}
          rx="5"
          ry="5"
          transform={`rotate(${rotateX} 50 50) translate(0 -30)`}
          width="8"
          x="46"
          y="40"
        >
          <animate
            attributeName="opacity"
            begin={`${begin}s`}
            dur="0.8s"
            from="1"
            repeatCount="indefinite"
            to="0"
          />
        </rect>
      ))}
    </svg>
  );
}

export default memo(forwardRef(Spinner));
