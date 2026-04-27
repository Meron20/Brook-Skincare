import {
    CalendarCheck,
    Users,
    BookOpen,
    TrendingUp,
  } from "lucide-react";
  
  const stats = [
    {
      label: "Total Bookings",
      value: "0",
      icon: CalendarCheck,
      change: "No bookings yet",
      color: "[#1E1548]",
    },
    {
      label: "Total Clients",
      value: "0",
      icon: Users,
      change: "No clients yet",
      color: "linear-gradient(180deg, #1E1548 0%, #0f0b2e 100%)",
    },
    {
      label: "Journal Entries",
      value: "0",
      icon: BookOpen,
      change: "No entries yet",
      color: "linear-gradient(180deg, #1E1548 0%, #0f0b2e 100%)"
    },
    {
      label: "This Month",
      value: "0",
      icon: TrendingUp,
      change: "No data yet",
      color: "linear-gradient(180deg, #1E1548 0%, #0f0b2e 100%)",
    },
  ];
  
  export default function AdminDashboard() {
    return (
      <div className="space-y-8 text-black">
  
   
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">Dashboard</h1>
          <p style={{ color: "#C9A96E" }} className="text-sm">
            Welcome back — here's your clinic overview
          </p>
        </div>
  
     
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map(({ label, value, icon: Icon, change, color }) => (
            <div
              key={label}
              className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
              style={{
                color: "linear-gradient(180deg, #1E1548 0%, #0f0b2e 100%)",
                background: "linear-gradient(135deg, #C9A96E, #1E1548)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              
              <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20"
                style={{ backgroundColor: color }}
              />
  
        
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
  
            
              <div>
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-[#1E1548] mt-1">{label}</p>
              </div>
  
              
              <p className="text-xs" style={{ color: "white", }}>
                {change}
              </p>
            </div>
          ))}
        </div>
  
       
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor:"rgba(201,169,110,0.08)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2 className="text-lg font-semibold text-[#1E1548] mb-6">
            Recent Bookings
          </h2>
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <CalendarCheck size={40} style={{ color: "rgba(201,169,110,0.3)" }} />
            <p className="text-gray-600 text-sm">No bookings yet</p>
            <p className="text-gray-700 text-xs">
              Bookings will appear here once customers start scheduling
            </p>
          </div>
        </div>
  
      </div>
    );
  }