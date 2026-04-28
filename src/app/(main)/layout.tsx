import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// import AuthGuard from "@/components/auth/AuthGuard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <AuthGuard>
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header currentSection="Dashboard" />

        {/* Main Content with ScrollArea */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-8">{children}</div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
    // </AuthGuard>
  );
}
