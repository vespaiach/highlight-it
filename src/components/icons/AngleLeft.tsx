import type { ReactNode, SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  title?: string;
  size?: number;
}

export default function AngleLeft({
  width,
  height,
  title = "angle left icon",
  size = 24,
  fill = "currentColor",
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
      <path d="M11.29,12l3.54-3.54a1,1,0,0,0,0-1.41,1,1,0,0,0-1.42,0L9.17,11.29a1,1,0,0,0,0,1.42L13.41,17a1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41Z" />
    </svg>
  );
}
