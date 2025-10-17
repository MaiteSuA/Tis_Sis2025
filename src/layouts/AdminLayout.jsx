import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-4 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}

