import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen bg-[#F7F2EA] flex overflow-hidden">
      {/* Sidebar */}
      <div className="shrink-0">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          {/* blob 1 */}
          <div
            className="absolute top-[10%] right-[8%] w-[450px] h-[450px] rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(circle, rgba(208,138,90,0.22) 0%, rgba(208,138,90,0) 70%)",
              filter: "blur(40px)",
              animation: "floatOne 8s ease-in-out infinite",
            }}
          />

          {/* blob 2 */}
          <div
            className="absolute bottom-[8%] left-[8%] w-[350px] h-[350px] rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(194,122,80,0.18) 0%, rgba(194,122,80,0) 70%)",
              filter: "blur(35px)",
              animation: "floatTwo 11s ease-in-out infinite",
            }}
          />

          {/* blob 3 */}
          <div
            className="absolute top-[42%] left-[38%] w-[260px] h-[260px] rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(231,209,187,0.4) 0%, rgba(231,209,187,0) 70%)",
              filter: "blur(30px)",
              animation: "floatThree 9s ease-in-out infinite",
            }}
          />
        </div>

        {/* Scrollable Content */}
        <main
          className="
          relative
          z-10
          flex-1
          overflow-y-auto
          p-6
          bg-[#F7F2EA]/70
        "
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
