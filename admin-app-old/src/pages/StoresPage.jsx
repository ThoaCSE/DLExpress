import React,{useEffect,useState} from 'react'
import api from '../api/axios'
export default function StoresPage() {
  const [stores,setStores]=useState([]); const [loading,setLoading]=useState(true)
  useEffect(()=>{ api.get('/admin/stores').then(r=>setStores(r.data?.data||[])).finally(()=>setLoading(false)) },[])
  const approve=async id=>{ await api.put(`/admin/stores/${id}/approve`); setStores(stores.map(s=>s.id===id?{...s,approved:true}:s)) }
  const reject=async id=>{ await api.put(`/admin/stores/${id}/reject`); setStores(stores.map(s=>s.id===id?{...s,approved:false}:s)) }
  if(loading) return <div className="text-center py-5"><div className="spinner-border text-dark"/></div>
  return <div>
    <h4 className="mb-4">Stores ({stores.length})</h4>
    <div className="table-responsive"><table className="table table-hover align-middle">
      <thead className="table-dark"><tr><th>Name</th><th>Category</th><th>Owner</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{stores.map(s=><tr key={s.id}>
        <td><strong>{s.name}</strong></td><td>{s.category}</td>
        <td><small className="text-muted">{s.ownerId?.substring(0,10)}</small></td>
        <td><span className={`badge ${s.approved?'bg-success':'bg-warning text-dark'}`}>{s.approved?'Live':'Pending'}</span></td>
        <td className="d-flex gap-1">
          {!s.approved&&<button className="btn btn-success btn-sm" onClick={()=>approve(s.id)}>Approve</button>}
          {s.approved&&<button className="btn btn-outline-danger btn-sm" onClick={()=>reject(s.id)}>Revoke</button>}
        </td>
      </tr>)}</tbody>
    </table></div>
  </div>
}
