import type { SVGProps } from "react";

export const Icons = {
  CrystalBall: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 2a10 10 0 0 0-10 10" />
      <path d="M12 22a10 10 0 0 0 10-10" />
      <path d="M12 22A10 10 0 1 1 2 12" />
      <path d="M2 12h20" />
      <path d="M12 2v20" />
      <path d="m5 12 2.5-4" />
      <path d="M16.5 16 19 12" />
    </svg>
  ),
};
