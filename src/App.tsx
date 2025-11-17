import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Travel } from "@/components/Travel";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("travel");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const renderMainContent = () => {
    switch (activeMenu) {
      case "travel":
        return <Travel />;
      case "home":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Home</h2>
              <p className="text-neutral-600">Home page content will go here</p>
            </div>
          </div>
        );
      case "insights":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Insights</h2>
              <p className="text-neutral-600">
                Insights page content will go here
              </p>
            </div>
          </div>
        );
      case "manage-spend":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Manage Spend</h2>
              <p className="text-neutral-600">
                Manage spend page content will go here
              </p>
            </div>
          </div>
        );
      case "expenses":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Expenses</h2>
              <p className="text-neutral-600">
                Expenses page content will go here
              </p>
            </div>
          </div>
        );
      case "bill-pay":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Bill Pay</h2>
              <p className="text-neutral-600">
                Bill pay page content will go here
              </p>
            </div>
          </div>
        );
      case "financial-accounts":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Financial Accounts
              </h2>
              <p className="text-neutral-600">
                Financial accounts page content will go here
              </p>
            </div>
          </div>
        );
      case "accounting":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Accounting</h2>
              <p className="text-neutral-600">
                Accounting page content will go here
              </p>
            </div>
          </div>
        );
      case "vendors":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Vendors</h2>
              <p className="text-neutral-600">
                Vendors page content will go here
              </p>
            </div>
          </div>
        );
      case "policy":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Policy</h2>
              <p className="text-neutral-600">
                Policy page content will go here
              </p>
            </div>
          </div>
        );
      case "company":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Company</h2>
              <p className="text-neutral-600">
                Company page content will go here
              </p>
            </div>
          </div>
        );
      default:
        return <Travel />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeMenu={activeMenu}
        onMenuClick={(menu) => {
          setActiveMenu(menu);
          if (isMobile) setIsSidebarOpen(false);
        }}
        isMobile={isMobile}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          activeMenu={activeMenu}
        />
        <main className="flex-1 overflow-hidden">{renderMainContent()}</main>
      </div>
    </div>
  );
}

export default App;
