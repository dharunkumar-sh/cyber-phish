import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#020617] text-slate-50 overflow-hidden relative">
      {/* Background grid pattern isolated so it doesn't mask text and components */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth pb-24">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
