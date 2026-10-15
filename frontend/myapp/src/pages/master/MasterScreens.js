import { useState, useEffect } from "react";
import api from "../../utils/api";
import { Card, Table, TR, TD, Btn, Modal, Input, Select, PageHeader, Spinner, Icon } from "../../components/UI";

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
export function Departments() {
  const [data, setData]       = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEdit]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ name:"", shortName:"" });

  const load = () => {
    setLoading(true);
    api.get("/departments")
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item ? { name:item.name, shortName:item.shortName } : { name:"", shortName:"" });
    setModal(true);
  };

  const save = async () => {
    if (!form.name || !form.shortName) return alert("All fields required");
    try {
      editing
        ? await api.put(`/departments/${editing._id}`, form)
        : await api.post("/departments", form);
      setModal(false); load();
    } catch (e) { alert(e.response?.data?.message || "Error saving"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try { await api.delete(`/departments/${id}`); load(); }
    catch { alert("Error deleting"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Departments" subtitle="Manage academic departments" icon="dept"
        action={<Btn onClick={() => open()}><Icon name="raise" size={14} color="#071210" />Add Department</Btn>} />
      <Card style={{ padding:0 }}>
        <Table cols={["#", "Department Name", "Short Name", "Actions"]}>
          {data.length === 0 && (
            <tr><td colSpan={4} style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>No departments yet</td></tr>
          )}
          {data.map((d, i) => (
            <TR key={d._id}>
              <TD><span style={{ color:"var(--text3)", fontFamily:"var(--font2)", fontSize:12 }}>{i + 1}</span></TD>
              <TD><span style={{ fontWeight:600, color:"var(--text)" }}>{d.name}</span></TD>
              <TD>
                <span style={{ background:"rgba(99,210,190,0.1)", color:"var(--accent)", padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:700, fontFamily:"var(--font2)" }}>
                  {d.shortName}
                </span>
              </TD>
              <TD>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn size="sm" variant="ghost" onClick={() => open(d)}><Icon name="edit" size={11} />Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => del(d._id)}><Icon name="trash" size={11} color="var(--danger)" />Del</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </Card>
      {modal && (
        <Modal title={editing ? "Edit Department" : "Add Department"} onClose={() => setModal(false)}>
          <Input label="Department Name *" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Computer Science & Engineering" />
          <Input label="Short Name *" value={form.shortName} onChange={e => setForm({...form, shortName:e.target.value})} placeholder="e.g. CSE" />
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PROGRAMMES ───────────────────────────────────────────────────────────────
export function Programmes() {
  const [data, setData]       = useState([]);
  const [depts, setDepts]     = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEdit]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ department:"", name:"", shortName:"" });

  const load = () => {
    setLoading(true);
    api.get("/programmes")
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    load();
    api.get("/departments").then(r => setDepts(r.data.data));
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item
      ? { department:item.department?._id, name:item.name, shortName:item.shortName }
      : { department:"", name:"", shortName:"" });
    setModal(true);
  };

  const save = async () => {
    if (!form.department || !form.name || !form.shortName) return alert("All fields required");
    try {
      editing
        ? await api.put(`/programmes/${editing._id}`, form)
        : await api.post("/programmes", form);
      setModal(false); load();
    } catch (e) { alert(e.response?.data?.message || "Error saving"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this programme?")) return;
    try { await api.delete(`/programmes/${id}`); load(); }
    catch { alert("Error deleting"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Programmes" subtitle="Manage academic programmes" icon="programme"
        action={<Btn onClick={() => open()}><Icon name="raise" size={14} color="#071210" />Add Programme</Btn>} />
      <Card style={{ padding:0 }}>
        <Table cols={["#", "Department", "Programme", "Short Name", "Actions"]}>
          {data.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>No programmes yet</td></tr>
          )}
          {data.map((p, i) => (
            <TR key={p._id}>
              <TD><span style={{ color:"var(--text3)", fontFamily:"var(--font2)", fontSize:12 }}>{i + 1}</span></TD>
              <TD>
                <span style={{ background:"rgba(99,210,190,0.08)", color:"var(--accent)", padding:"2px 8px", borderRadius:5, fontSize:11, fontWeight:600 }}>
                  {p.department?.shortName}
                </span>
              </TD>
              <TD><span style={{ fontWeight:600, color:"var(--text)" }}>{p.name}</span></TD>
              <TD><span style={{ color:"var(--text2)", fontSize:12 }}>{p.shortName}</span></TD>
              <TD>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn size="sm" variant="ghost" onClick={() => open(p)}><Icon name="edit" size={11} />Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => del(p._id)}><Icon name="trash" size={11} color="var(--danger)" />Del</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </Card>
      {modal && (
        <Modal title={editing ? "Edit Programme" : "Add Programme"} onClose={() => setModal(false)}>
          <Select label="Department *" value={form.department} onChange={e => setForm({...form, department:e.target.value})}>
            <option value="">Select Department</option>
            {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </Select>
          <Input label="Programme Name *" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Bachelor of Technology" />
          <Input label="Short Name *" value={form.shortName} onChange={e => setForm({...form, shortName:e.target.value})} placeholder="e.g. B.Tech" />
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── BLOCKS ───────────────────────────────────────────────────────────────────
export function Blocks() {
  const [data, setData]       = useState([]);
  const [depts, setDepts]     = useState([]);
  const [progs, setProgs]     = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEdit]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ department:"", programme:"", name:"" });

  const load = () => {
    setLoading(true);
    api.get("/blocks")
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    load();
    api.get("/departments").then(r => setDepts(r.data.data));
    api.get("/programmes").then(r => setProgs(r.data.data));
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item
      ? { department:item.department?._id, programme:item.programme?._id, name:item.name }
      : { department:"", programme:"", name:"" });
    setModal(true);
  };

  const save = async () => {
    if (!form.department || !form.programme || !form.name) return alert("All fields required");
    try {
      editing
        ? await api.put(`/blocks/${editing._id}`, form)
        : await api.post("/blocks", form);
      setModal(false); load();
    } catch (e) { alert(e.response?.data?.message || "Error saving"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this block?")) return;
    try { await api.delete(`/blocks/${id}`); load(); }
    catch { alert("Error deleting"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Blocks" subtitle="Manage building blocks" icon="block"
        action={<Btn onClick={() => open()}><Icon name="raise" size={14} color="#071210" />Add Block</Btn>} />
      <Card style={{ padding:0 }}>
        <Table cols={["#", "Department", "Programme", "Block Name", "Actions"]}>
          {data.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>No blocks yet</td></tr>
          )}
          {data.map((b, i) => (
            <TR key={b._id}>
              <TD><span style={{ color:"var(--text3)", fontFamily:"var(--font2)", fontSize:12 }}>{i + 1}</span></TD>
              <TD>
                <span style={{ background:"rgba(99,210,190,0.08)", color:"var(--accent)", padding:"2px 8px", borderRadius:5, fontSize:11, fontWeight:600 }}>
                  {b.department?.shortName}
                </span>
              </TD>
              <TD><span style={{ color:"var(--text2)", fontSize:12 }}>{b.programme?.shortName}</span></TD>
              <TD><span style={{ fontWeight:600, color:"var(--text)" }}>{b.name}</span></TD>
              <TD>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn size="sm" variant="ghost" onClick={() => open(b)}><Icon name="edit" size={11} />Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => del(b._id)}><Icon name="trash" size={11} color="var(--danger)" />Del</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </Card>
      {modal && (
        <Modal title={editing ? "Edit Block" : "Add Block"} onClose={() => setModal(false)}>
          <Select label="Department *" value={form.department} onChange={e => setForm({...form, department:e.target.value, programme:""})}>
            <option value="">Select Department</option>
            {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </Select>
          <Select label="Programme *" value={form.programme} onChange={e => setForm({...form, programme:e.target.value})}>
            <option value="">Select Programme</option>
            {progs
              .filter(p => !form.department || p.department?._id === form.department)
              .map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </Select>
          <Input label="Block Name *" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Block A" />
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ROOMS ────────────────────────────────────────────────────────────────────
export function Rooms() {
  const [data, setData]       = useState([]);
  const [depts, setDepts]     = useState([]);
  const [progs, setProgs]     = useState([]);
  const [blocks, setBlocks]   = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEdit]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ department:"", programme:"", block:"", number:"" });

  const load = () => {
    setLoading(true);
    api.get("/rooms")
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    load();
    api.get("/departments").then(r => setDepts(r.data.data));
    api.get("/programmes").then(r => setProgs(r.data.data));
    api.get("/blocks").then(r => setBlocks(r.data.data));
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item
      ? { department:item.department?._id, programme:item.programme?._id, block:item.block?._id, number:item.number }
      : { department:"", programme:"", block:"", number:"" });
    setModal(true);
  };

  const save = async () => {
    if (!form.department || !form.programme || !form.block || !form.number) return alert("All fields required");
    try {
      editing
        ? await api.put(`/rooms/${editing._id}`, form)
        : await api.post("/rooms", form);
      setModal(false); load();
    } catch (e) { alert(e.response?.data?.message || "Error saving"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try { await api.delete(`/rooms/${id}`); load(); }
    catch { alert("Error deleting"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Room Numbers" subtitle="Manage rooms and locations" icon="room"
        action={<Btn onClick={() => open()}><Icon name="raise" size={14} color="#071210" />Add Room</Btn>} />
      <Card style={{ padding:0 }}>
        <Table cols={["#", "Department", "Programme", "Block", "Room No.", "Actions"]}>
          {data.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>No rooms yet</td></tr>
          )}
          {data.map((r, i) => (
            <TR key={r._id}>
              <TD><span style={{ color:"var(--text3)", fontFamily:"var(--font2)", fontSize:12 }}>{i + 1}</span></TD>
              <TD>
                <span style={{ background:"rgba(99,210,190,0.08)", color:"var(--accent)", padding:"2px 8px", borderRadius:5, fontSize:11, fontWeight:600 }}>
                  {r.department?.shortName}
                </span>
              </TD>
              <TD><span style={{ color:"var(--text2)", fontSize:12 }}>{r.programme?.shortName}</span></TD>
              <TD><span style={{ color:"var(--text2)", fontSize:12 }}>{r.block?.name}</span></TD>
              <TD><span style={{ fontWeight:700, color:"var(--text)", fontFamily:"var(--font2)" }}>{r.number}</span></TD>
              <TD>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn size="sm" variant="ghost" onClick={() => open(r)}><Icon name="edit" size={11} />Edit</Btn>
                  <Btn size="sm" variant="danger" onClick={() => del(r._id)}><Icon name="trash" size={11} color="var(--danger)" />Del</Btn>
                </div>
              </TD>
            </TR>
          ))}
        </Table>
      </Card>
      {modal && (
        <Modal title={editing ? "Edit Room" : "Add Room"} onClose={() => setModal(false)}>
          <Select label="Department *" value={form.department} onChange={e => setForm({...form, department:e.target.value, block:""})}>
            <option value="">Select Department</option>
            {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </Select>
          <Select label="Programme *" value={form.programme} onChange={e => setForm({...form, programme:e.target.value})}>
            <option value="">Select Programme</option>
            {progs.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </Select>
          <Select label="Block *" value={form.block} onChange={e => setForm({...form, block:e.target.value})}>
            <option value="">Select Block</option>
            {blocks
              .filter(b => !form.department || b.department?._id === form.department)
              .map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </Select>
          <Input label="Room Number *" value={form.number} onChange={e => setForm({...form, number:e.target.value})} placeholder="e.g. 101" />
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ROLE CARD — separate component so useState works correctly ───────────────
function RoleCard({ r, onEdit, onDelete }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:"var(--surface)", borderRadius:12, padding:"16px 18px",
        border:`1px solid ${hov ? "rgba(99,210,190,0.25)" : "var(--border)"}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
        transition:"all 0.2s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.2)" : "none",
      }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:9, background:"rgba(99,210,190,0.08)", border:"1px solid rgba(99,210,190,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="role" size={16} />
        </div>
        <span style={{ fontWeight:600, color:"var(--text)", fontSize:13 }}>{r.name}</span>
      </div>
      <div style={{ display:"flex", gap:6 }}>
        <button onClick={() => onEdit(r)}
          style={{ border:"none", background:"none", cursor:"pointer", padding:6, borderRadius:6, transition:"background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(99,210,190,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background="none"}>
          <Icon name="edit" size={14} />
        </button>
        <button onClick={() => onDelete(r._id)}
          style={{ border:"none", background:"none", cursor:"pointer", padding:6, borderRadius:6, transition:"background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(248,113,113,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background="none"}>
          <Icon name="trash" size={14} color="var(--danger)" />
        </button>
      </div>
    </div>
  );
}

// ─── ROLES ────────────────────────────────────────────────────────────────────
export function Roles() {
  const [data, setData]       = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEdit]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ name:"" });

  const load = () => {
    setLoading(true);
    api.get("/roles")
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item ? { name:item.name } : { name:"" });
    setModal(true);
  };

  const save = async () => {
    if (!form.name) return alert("Role name required");
    try {
      editing
        ? await api.put(`/roles/${editing._id}`, form)
        : await api.post("/roles", form);
      setModal(false); load();
    } catch (e) { alert(e.response?.data?.message || "Error"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    try { await api.delete(`/roles/${id}`); load(); }
    catch { alert("Error"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Roles" subtitle="Manage system roles and permissions" icon="role"
        action={<Btn onClick={() => open()}><Icon name="raise" size={14} color="#071210" />Add Role</Btn>} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
        {data.length === 0 && (
          <p style={{ color:"var(--text3)", gridColumn:"1/-1", textAlign:"center", padding:40 }}>No roles yet</p>
        )}
        {data.map((r, i) => (
          <div key={r._id} style={{ animation:`fadeUp 0.3s ease ${i * 0.05}s both` }}>
            <RoleCard r={r} onEdit={open} onDelete={del} />
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={editing ? "Edit Role" : "Add Role"} onClose={() => setModal(false)}>
          <Input label="Role Name *" value={form.name} onChange={e => setForm({ name:e.target.value })} placeholder="e.g. Networking Staff" />
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── USER ROW — separate component so useState works correctly ────────────────
const ROLE_COLORS = {
  "SuperAdmin":        "var(--accent)",
  "User":              "var(--info)",
  "Networking Staff":  "#a78bfa",
  "Electrician":       "var(--warn)",
  "Plumber":           "#fb923c",
  "Software Developer":"var(--success)",
};

function UserRow({ u, i, onEdit, onDelete }) {
  const color = ROLE_COLORS[u.role?.name] || "var(--text2)";
  return (
    <TR>
      <TD><span style={{ color:"var(--text3)", fontFamily:"var(--font2)", fontSize:12 }}>{i + 1}</span></TD>
      <TD>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:"linear-gradient(135deg,var(--accent3),var(--accent2))", display:"flex", alignItems:"center", justifyContent:"center", color:"#071210", fontWeight:800, fontSize:13, fontFamily:"var(--font2)", flexShrink:0 }}>
            {u.name?.[0]}
          </div>
          <div>
            <div style={{ fontWeight:600, color:"var(--text)", fontSize:13 }}>{u.name}</div>
            <div style={{ fontSize:10, color:"var(--text3)" }}>@{u.username}</div>
          </div>
        </div>
      </TD>
      <TD><span style={{ fontSize:12 }}>{u.email}</span></TD>
      <TD><span style={{ fontSize:12, fontFamily:"var(--font2)" }}>{u.phone}</span></TD>
      <TD>
        <span style={{ background:`${color}18`, color, padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:700, fontFamily:"var(--font2)" }}>
          {u.role?.name}
        </span>
      </TD>
      <TD><span style={{ fontSize:12, color:"var(--text2)" }}>{u.department?.shortName}</span></TD>
      <TD>
        <div style={{ display:"flex", gap:8 }}>
          <Btn size="sm" variant="ghost" onClick={() => onEdit(u)}><Icon name="edit" size={11} />Edit</Btn>
          <Btn size="sm" variant="danger" onClick={() => onDelete(u._id)}><Icon name="trash" size={11} color="var(--danger)" />Del</Btn>
        </div>
      </TD>
    </TR>
  );
}

// ─── USERS ────────────────────────────────────────────────────────────────────
export function Users() {
  const [data, setData]       = useState([]);
  const [roles, setRoles]     = useState([]);
  const [depts, setDepts]     = useState([]);
  const [progs, setProgs]     = useState([]);
  const [modal, setModal]     = useState(false);
  const [editing, setEdit]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ name:"", username:"", email:"", phone:"", password:"", role:"", department:"", programme:"" });

  const load = () => {
    setLoading(true);
    api.get("/users")
      .then(r => { setData(r.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    load();
    api.get("/roles").then(r => setRoles(r.data.data));
    api.get("/departments").then(r => setDepts(r.data.data));
    api.get("/programmes").then(r => setProgs(r.data.data));
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item
      ? { name:item.name, username:item.username, email:item.email, phone:item.phone, password:"", role:item.role?._id, department:item.department?._id, programme:item.programme?._id || "" }
      : { name:"", username:"", email:"", phone:"", password:"", role:"", department:"", programme:"" });
    setModal(true);
  };

  const save = async () => {
    if (!form.name || !form.email || !form.role) return alert("Name, email and role are required");
    if (!editing && !form.password) return alert("Password is required for new users");
    try {
      const payload = { ...form };
      if (editing && !payload.password) delete payload.password;
      editing
        ? await api.put(`/users/${editing._id}`, payload)
        : await api.post("/users", payload);
      setModal(false); load();
    } catch (e) { alert(e.response?.data?.message || "Error saving"); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await api.delete(`/users/${id}`); load(); }
    catch { alert("Error deleting"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage system users and access" icon="users"
        action={<Btn onClick={() => open()}><Icon name="raise" size={14} color="#071210" />Add User</Btn>} />
      <Card style={{ padding:0 }}>
        <Table cols={["#", "User", "Email", "Phone", "Role", "Department", "Actions"]}>
          {data.length === 0 && (
            <tr><td colSpan={7} style={{ textAlign:"center", padding:40, color:"var(--text3)" }}>No users yet</td></tr>
          )}
          {data.map((u, i) => (
            <UserRow key={u._id} u={u} i={i} onEdit={open} onDelete={del} />
          ))}
        </Table>
      </Card>

      {modal && (
        <Modal title={editing ? "Edit User" : "Add User"} onClose={() => setModal(false)} width={600}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
            <Input label="Full Name *" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="John Doe" />
            <Input label="Username *" value={form.username} onChange={e => setForm({...form, username:e.target.value})} placeholder="johndoe" />
            <div style={{ gridColumn:"1/-1" }}>
              <Input label="Email *" type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="john@university.edu" />
            </div>
            <Input label="Phone *" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="9876543210" />
            <Input label={editing ? "New Password (blank = keep)" : "Password *"} type="password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="••••••••" />
            <Select label="Role *" value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
              <option value="">Select Role</option>
              {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </Select>
            <Select label="Department" value={form.department} onChange={e => setForm({...form, department:e.target.value})}>
              <option value="">Select Department</option>
              {depts.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </Select>
            <div style={{ gridColumn:"1/-1" }}>
              <Select label="Programme" value={form.programme} onChange={e => setForm({...form, programme:e.target.value})}>
                <option value="">Select Programme</option>
                {progs
                  .filter(p => !form.department || p.department?._id === form.department)
                  .map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </Select>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={save}>Save User</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}