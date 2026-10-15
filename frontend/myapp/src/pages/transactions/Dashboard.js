import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { StatCard, Card, Badge, Spinner, Icon } from "../../components/UI";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, c] = await Promise.all([
          api.get("/complaints/dashboard"),
          api.get("/complaints")
        ]);
        setStats(s.data.data);
        setRecent(c.data.data.slice(0, 6));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();

    // Refresh when user comes back to this tab
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  if (loading) return <Spinner />;

  const statCards = [
    { label:"Total Complaints", value:stats?.total    ??0, color:"var(--accent)",  icon:"complaint" },
    { label:"Pending",          value:stats?.pending  ??0, color:"var(--warn)",    icon:"alert"     },
    { label:"Assigned",         value:stats?.assigned ??0, color:"var(--info)",    icon:"assign"    },
    { label:"Completed",        value:stats?.completed??0, color:"var(--success)", icon:"status"    },
  ];

  const statusBars = [
    ["Pending",     "var(--warn)",    stats?.pending],
    ["Assigned",    "var(--info)",    stats?.assigned],
    ["In-Progress", "#a78bfa",        stats?.inProgress],
    ["On-Hold",     "var(--danger)",  stats?.onHold],
    ["Completed",   "var(--success)", stats?.completed],
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:36, animation:"fadeUp 0.35s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
          <h1 style={{ margin:0, fontSize:26, fontWeight:800, color:"var(--text)", fontFamily:"var(--font2)", letterSpacing:-0.5 }}>Dashboard</h1>
          <div style={{ padding:"3px 10px", background:"rgba(99,210,190,0.1)", border:"1px solid rgba(99,210,190,0.2)", borderRadius:99, fontSize:11, color:"var(--accent)", fontWeight:700, fontFamily:"var(--font2)" }}>LIVE</div>
        </div>
        <p style={{ margin:0, color:"var(--text2)", fontSize:14 }}>
          Good day, <span style={{ color:"var(--accent)", fontWeight:600 }}>{user?.name}</span> · {user?.role?.name}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
        {statCards.map((s, i) => (
          <div key={s.label} style={{ animation:`fadeUp 0.4s ease ${i * 0.07}s both` }}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:20 }}>
        {/* Status Breakdown */}
        <Card>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
            <Icon name="report" size={17} />
            <h3 style={{ margin:0, fontSize:14, fontWeight:700, color:"var(--text)", fontFamily:"var(--font2)" }}>Status Breakdown</h3>
          </div>
          {statusBars.map(([l, c, v]) => (
            <div key={l} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7, fontSize:12 }}>
                <span style={{ color:"var(--text2)", fontWeight:500 }}>{l}</span>
                <span style={{ color:c, fontWeight:700, fontFamily:"var(--font2)" }}>{v ?? 0}</span>
              </div>
              <div style={{ height:6, borderRadius:99, background:"var(--surface2)" }}>
                <div style={{ height:"100%", borderRadius:99, background:c, width: stats?.total ? `${((v??0)/stats.total)*100}%` : "0%", transition:"width 1s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 8px ${c}66` }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Recent Complaints */}
        <Card>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Icon name="complaint" size={17} />
              <h3 style={{ margin:0, fontSize:14, fontWeight:700, color:"var(--text)", fontFamily:"var(--font2)" }}>Recent Complaints</h3>
            </div>
            <span style={{ fontSize:11, color:"var(--text3)" }}>{recent.length} latest</span>
          </div>
          {recent.length === 0
            ? <div style={{ textAlign:"center", padding:"32px 0", color:"var(--text3)" }}>
                <Icon name="complaint" size={32} color="var(--text3)" />
                <p style={{ marginTop:10, fontSize:13 }}>No complaints yet</p>
              </div>
            : recent.map((c, i) => (
              <div key={c._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${i === recent.length-1 ? "transparent" : "var(--border)"}`, animation:`fadeUp 0.3s ease ${i*0.05}s both` }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:"rgba(99,210,190,0.08)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name="ticket" size={14} />
                  </div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, color:"var(--text)", fontFamily:"var(--font2)" }}>{c.ticketId}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{c.type} · {c.block?.name}</div>
                  </div>
                </div>
                <Badge status={c.status} />
              </div>
            ))}
        </Card>
      </div>
    </div>
  );
}