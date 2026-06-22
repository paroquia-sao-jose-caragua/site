import * as React from "react";

export function WaveSeparator(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={1537}
      height={298}
      viewBox="0 0 1537 298"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1536 248H725.127v-71.02c21.646.105 43.541-.044 65.645-.463C1147.95 169.743 1447.46 95.499 1536 .49V248z"
        fill="#C59640"
      />
      <path
        d="M0 247.51h810.873v-71.02c-21.646.105-43.541-.044-65.645-.464C388.054 169.253 88.542 95.009 0 0v247.51z"
        fill="#C59640"
      />
      <path
        d="M1536.13 297.206H.127V28.987c88.02 85.814 398.272 149.219 767.5 149.219 370.643 0 681.853-63.892 768.503-150.206v269.206z"
        fill="#2A3A1F"
      />
    </svg>
  );
}
