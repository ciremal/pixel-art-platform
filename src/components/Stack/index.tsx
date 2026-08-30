import type { ReactNode, CSSProperties } from "react";

type StackProps = {
  justifyContent?: CSSProperties["justifyContent"];
  gap?: number
  children?: ReactNode;
};

const Stack = ({ justifyContent = 'normal', gap = 0, children }: StackProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: justifyContent,
        rowGap: `${gap}rem`
      }}
    >
      {children}
    </div>
  );
};

export default Stack