import { NavBar } from "../../../components/NavBar";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div className="flex flex-col h-screen">
      <NavBar />

      {/* Main Content Area */}
      <div className="flex flex-grow h-full">
        {children}
      </div>
    </div>
  );
}
