import type { ReactNode, SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  title?: string;
  size?: number;
}

export default function Refresh({
  width,
  height,
  title = "refresh cw icon",
  size = 24,
  stroke = "currentColor",
  fill = "none",
  ...rest
}: IconProps): ReactNode {
  return (
    <svg
      {...rest}
      fill={fill}
      width={width || size}
      height={height || size}
      viewBox="0 0 24 24"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <title>{title}</title>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}
