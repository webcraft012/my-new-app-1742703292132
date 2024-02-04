"use client";

import type { ReactNode } from "react";
import React from "react";

interface HolderProps {
  children?: ReactNode;
}

const Holder: React.FC<HolderProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default Holder;
