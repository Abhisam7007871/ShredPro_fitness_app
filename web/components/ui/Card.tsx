import React from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: Props) {
  return (
    <div className={clsx("glass rounded-3xl", className)}>
      {children}
    </div>
  );
}

