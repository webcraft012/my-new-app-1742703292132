export const Navbar = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return <nav className="bg-gray-800 text-white shadow-md">
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      <div className="text-lg font-bold">Navbar</div>
      <div className="space-x-4">{children}</div>
    </div>
  </nav>;
};
