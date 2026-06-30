import React,{useEffect,useState} from 'react'
import api from '../api/axios'
export default function UsersPage() {
  const [users,setUsers]=useState([]); const [loading,setLoading]=useState(true)
  useEffect(()=>{ api.get('/admin/users').then(r=>setUsers(r.data?.data||[])).finally(()=>setLoading(false)) },[])
  const toggle=async u=>{ await api.put(`/admin/users/${u.id}/active?active=${!u.active}`); setUsers(users.map(x=>x.id===u.id?{...x,active:!x.active}:x)) }
  const hardDelete = async (u) => {
    const ok = window.confirm(`Permanently delete ${u.fullName} and related data from MongoDB?`)
    if (!ok) return
    await api.delete(`/admin/users/${u.id}/hard`)
    setUsers((prev) => prev.filter((x) => x.id !== u.id))
  }
  if(loading) return <div className="text-center py-5"><div className="spinner-border text-dark"/></div>
  return <div>
    <h4 className="mb-4">Users ({users.length})</h4>
    <div className="table-responsive"><table className="table table-hover align-middle">
      <thead className="table-dark"><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Action</th></tr></thead>
      <tbody>{users.map(u=><tr key={u.id}>
        <td>{u.fullName}</td><td>{u.email}</td>
        <td><span className={`badge ${u.role==='ADMIN'?'bg-danger':u.role==='SELLER'?'bg-success':'bg-primary'}`}>{u.role}</span></td>
        <td><span className={`badge ${u.active?'bg-success':'bg-secondary'}`}>{u.active?'Active':'Locked'}</span>
          {u.deletionRequested&&<span className="badge bg-warning text-dark ms-1">Del Pending</span>}</td>
        <td><small className="text-muted">{u.lastLogin?new Date(u.lastLogin).toLocaleDateString():'Never'}</small></td>
        <td>
          {u.role!=='ADMIN'&&(
            <div className="d-flex gap-2">
              <button className={`btn btn-sm ${u.active?'btn-outline-danger':'btn-outline-success'}`} onClick={()=>toggle(u)}>{u.active?'Lock':'Unlock'}</button>
              <button className="btn btn-sm btn-danger" onClick={() => hardDelete(u)}>Delete Permanently</button>
            </div>
          )}
        </td>
      </tr>)}</tbody>
    </table></div>
  </div>
}
