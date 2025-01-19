export const Container = ({ children }: { children: React.ReactNode }) => {
  return <main className="flex-grow bg-gray-100 p-6">
    {children}
  </main>;
};
