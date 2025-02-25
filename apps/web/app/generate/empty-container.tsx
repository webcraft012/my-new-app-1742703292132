import React from "react";

export const EmptyContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full">{children}</div>;
};
