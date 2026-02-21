import type { ReactNode, SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  title?: string;
  size?: number;
}

export default function MoonBold({
  width,
  height,
  title = "moon bold icon",
  size = 24,
  stroke = "currentColor",
  ...rest
}: IconProps): ReactNode {
  return (
    <svg {...rest} width={width || size} height={height || size} viewBox="0 0 256 256">
      <title>{title}</title>
      <rect width="256" height="256" fill="none" />
      <path
        fill="none"
        stroke="CurrentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
        d="M108.11,28.11A96.09,96.09,0,0,0,227.89,147.89,96,96,0,1,1,108.11,28.11Z"
      />
    </svg>
  );
}
