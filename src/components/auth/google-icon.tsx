import type { SVGProps } from "react";

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden
      {...props}
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.45-1.71 4.25-5.5 4.25-3.31 0-6.01-2.74-6.01-6.12 0-3.38 2.7-6.12 6.01-6.12 1.88 0 3.15.8 3.87 1.49l2.64-2.55C16.84 3.6 14.65 2.7 12 2.7 6.92 2.7 2.8 6.83 2.8 12.23S6.92 21.76 12 21.76c6.93 0 9.2-4.86 9.2-7.36 0-.5-.05-.86-.13-1.2H12z"
      />
    </svg>
  );
}
