import type { ReactNode, SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  title?: string;
  size?: number;
}

export default function Info({
  width,
  height,
  title = "info icon",
  size = 24,
  fill = "none",
  ...rest
}: IconProps): ReactNode {
  return (
    <svg
      {...rest}
      width={width || size}
      height={height || size}
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <circle cx="12" cy="12" r="10" stroke="CurrentColor" strokeWidth="2" />
      <path stroke="CurrentColor" strokeWidth="2" strokeLinecap="round" d="M12 7H12.01" />
      <path
        stroke="CurrentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 11H12V16"
      />
      <path
        stroke="CurrentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 16H14"
      />
    </svg>
  );
}
