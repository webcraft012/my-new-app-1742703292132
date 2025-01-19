import React from "react";

export const Sidebar: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <aside className="w-64 bg-white border-l shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="space-y-2 flex flex-col gap-2">{children}</ul>
    </aside>
  );
};
