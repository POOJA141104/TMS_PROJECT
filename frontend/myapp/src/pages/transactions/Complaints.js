import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Card, Table, TR, TD, Badge, Btn, Modal, Select, PageHeader, Spinner, Icon } from "../../components/UI";

const STATUSES = ["Pending","Assigned","In-Progress","On-Hold","Completed"];
const TYPES    = ["PC Hardware","PC Software","Application Issues","Network","Electronics","Plumbing","Electrician","Other"];

export default function Complaints() {
  const { user, isSuperAdmin, isStaff } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState({ status:"", type:"" });
  const [viewModal, setViewModal]   = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [assignTo, setAssignTo]     = useState("");
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus]   = useState("");
  const [note, setNote]             = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.type)   params.append("type", filter.type);
      const { data } = await api.get(`/complaints?${params}`);
      setComplaints(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);
  useEffect(() => {
    if (isSuperAdmin()) api.get("/users/staff").then(r => setStaffList(r.data.data)).catch(() => {});
  }, []);

  const handleAssign = async () => {
    if (!assignTo) return alert("Select a staff member");
    try { await api.put(`/complaints/${assignModal._id}/assign`, { assignedTo:assignTo }); setAssignModal(null); setAssignTo(""); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return alert("Select a status");
    try { await api.put(`/complaints/${statusModal._id}/status`, { status:newStatus, note }); setStatusModal(null); setNewStatus(""); setNote(""); load(); }
    catch (e) { alert(e.response?.data?.message || "Failed"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Complaints" subtitle={`${complaints.length} complaint${complaints.length!==1?"s":""} found`} icon="complaint" />

      {/* Filters */}
      <Card style={{ marginBottom:20, padding:"16px 20px" }}>
        <div style={{ display:"flex", gap:16, alignItems:"flex-end", flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, color:"var(--accent)", marginRight:4 }}>
            <Icon name="filter" size={14} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", fontFamily:"var(--font2)" }}>Filter</span>
          </div>
          <div style={{ minWidth:160 }}>
            <Select label="Status" value={filter.status} onChange={e => setFilter({...filter,status:e.target.value})}>
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <div style={{ minWidth:180 }}>
            <Select label="Type" value={filter.type} onChange={e => setFilter({...filter,type:e.target.value})}>
              <option value="">All Types</option>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
          </div>
          {(filter.status || filter.type) && (
            <Btn variant="ghost" size="sm" onClick={() => setFilter({status:"",type:""})} style={{ marginBottom:16 }}>
              <Icon name="close" size={12} color="var(--accent)" /> Clear
            </Btn>
          )}
        </div>
      </Card>

      <Card style={{ padding:0 }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="complaint" size={16} />
          <span style={{ fontWeight:700, fontSize:14, color:"var(--text)", fontFamily:"var(--font2)" }}>Complaint Records</span>
        </div>
        <div style={{ padding:"0 4px" }}>
          <Table cols={["Ticket","Type","Location","Status","Raised By","Assigned To","Date","Actions"]}>
            {complaints.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign:"center", padding:"48px 0", color:"var(--text3)" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                  <Icon name="complaint" size={36} color="var(--text3)" />
                  <span style={{ fontSize:13 }}>No complaints found</span>
                </div>
              </td></tr>
            )}
            {complaints.map(c => (
              <TR key={c._id}>
                <TD>
                  <span style={{ fontFamily:"var(--font2)", fontWeight:700, color:"var(--accent)", fontSize:12 }}>{c.ticketId}</span>
                </TD>
                <TD><span style={{ fontSize:12, color:"var(--text)" }}>{c.type}</span></TD>
                <TD><span style={{ fontSize:11, color:"var(--text3)" }}>{c.block?.name} / {c.room?.number}</span></TD>
                <TD><Badge status={c.status} /></TD>
                <TD><span style={{ fontSize:12 }}>{c.raisedBy?.name}</span></TD>
                <TD>
                  {c.assignedTo?.name
                    ? <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:20, height:20, borderRadius:6, background:"rgba(99,210,190,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"var(--accent)", fontWeight:800 }}>{c.assignedTo.name[0]}</div>
                        <span style={{ fontSize:12 }}>{c.assignedTo.name}</span>
                      </div>
                    : <span style={{ fontSize:11, color:"var(--text3)" }}>— Unassigned</span>}
                </TD>
                <TD><span style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font2)" }}>{c.createdAt?.slice(0,10)}</span></TD>
                <TD>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn size="sm" variant="outline" onClick={() => setViewModal(c)}>
                      <Icon name="search" size={11} color="var(--text2)" /> View
                    </Btn>
                    {isSuperAdmin() && c.status !== "Completed" && (
                      <Btn size="sm" variant="ghost" onClick={() => { setAssignModal(c); setAssignTo(c.assignedTo?._id||""); }}>
                        <Icon name="assign" size={11} /> Assign
                      </Btn>
                    )}
                    {isStaff() && c.assignedTo?._id === user._id && c.status !== "Completed" && (
                      <Btn size="sm" variant="success" onClick={() => { setStatusModal(c); setNewStatus(""); }}>
                        <Icon name="status" size={11} color="var(--success)" /> Update
                      </Btn>
                    )}
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
        </div>
      </Card>

      {/* View Modal */}
      {viewModal && (
        <Modal title={`Complaint Details`} onClose={() => setViewModal(null)}>
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", background:"var(--surface2)", borderRadius:10, marginBottom:20, border:"1px solid var(--border)" }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"rgba(99,210,190,0.08)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="ticket" size={18} />
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:16, color:"var(--accent)", fontFamily:"var(--font2)" }}>{viewModal.ticketId}</div>
              <div style={{ fontSize:12, color:"var(--text3)" }}>{viewModal.type}</div>
            </div>
            <div style={{ marginLeft:"auto" }}><Badge status={viewModal.status} /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {[["Block",viewModal.block?.name],["Room",viewModal.room?.number],["Department",viewModal.department?.shortName],["Date",viewModal.createdAt?.slice(0,10)],["Raised By",viewModal.raisedBy?.name],["Assigned To",viewModal.assignedTo?.name||"Unassigned"]].map(([k,v]) => (
              <div key={k} style={{ background:"var(--surface2)", borderRadius:9, padding:"11px 14px", border:"1px solid var(--border)" }}>
                <div style={{ fontSize:10, color:"var(--text3)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4, fontFamily:"var(--font2)" }}>{k}</div>
                <div style={{ fontWeight:600, color:"var(--text)", fontSize:13 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:"var(--surface2)", borderRadius:9, padding:"12px 14px", border:"1px solid var(--border)", marginBottom:20 }}>
            <div style={{ fontSize:10, color:"var(--text3)", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:6, fontFamily:"var(--font2)" }}>Remarks</div>
            <p style={{ margin:0, color:"var(--text2)", fontSize:13, lineHeight:1.7 }}>{viewModal.remarks}</p>
          </div>
          <div style={{ textAlign:"right" }}><Btn onClick={() => setViewModal(null)}>Close</Btn></div>
        </Modal>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <Modal title={`Assign Complaint`} onClose={() => setAssignModal(null)}>
          <div style={{ padding:"10px 14px", background:"var(--surface2)", borderRadius:9, border:"1px solid var(--border)", marginBottom:20, fontSize:13, color:"var(--text2)" }}>
            Ticket: <strong style={{ color:"var(--accent)", fontFamily:"var(--font2)" }}>{assignModal.ticketId}</strong> · {assignModal.type}
          </div>
          <Select label="Assign To Staff Member" value={assignTo} onChange={e => setAssignTo(e.target.value)}>
            <option value="">Select staff member</option>
            {staffList.map(s => <option key={s._id} value={s._id}>{s.name} — {s.role?.name}</option>)}
          </Select>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setAssignModal(null)}>Cancel</Btn>
            <Btn onClick={handleAssign}><Icon name="assign" size={14} color="#071210" /> Assign</Btn>
          </div>
        </Modal>
      )}

      {/* Status Modal */}
      {statusModal && (
        <Modal title="Update Status" onClose={() => setStatusModal(null)}>
          <div style={{ padding:"10px 14px", background:"var(--surface2)", borderRadius:9, border:"1px solid var(--border)", marginBottom:20, fontSize:13, color:"var(--text2)" }}>
            Ticket: <strong style={{ color:"var(--accent)", fontFamily:"var(--font2)" }}>{statusModal.ticketId}</strong> · Current: <Badge status={statusModal.status} />
          </div>
          <Select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            <option value="">Select new status</option>
            {["In-Progress","On-Hold","Completed"].map(s => <option key={s}>{s}</option>)}
          </Select>
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:"var(--accent)", letterSpacing:1.5, textTransform:"uppercase", marginBottom:8, fontFamily:"var(--font2)" }}>Note (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about this status update…"
              style={{ width:"100%", padding:"10px 14px", background:"var(--surface2)", border:"1.5px solid var(--border)", borderRadius:9, fontSize:13, fontFamily:"var(--font)", color:"var(--text)", outline:"none", resize:"vertical", minHeight:70, boxSizing:"border-box" }} />
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setStatusModal(null)}>Cancel</Btn>
            <Btn variant="success" onClick={handleStatusUpdate}><Icon name="status" size={14} color="var(--success)" /> Update</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}