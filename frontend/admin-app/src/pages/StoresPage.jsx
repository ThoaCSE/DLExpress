import React,{useEffect,useState} from 'react'
import api from '../api/axios'
export default function StoresPage() {
  const [stores,setStores]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(null)
  const fetchStores=()=>{
    setLoading(true); setError(null)
    api.get('/admin/stores')
      .then(r=>setStores(r.data?.data||[]))
      .catch(e=>{
        const s=e.response?.status
        setError(s===403?'Access denied (403) — please re-login.':e.code==='ERR_NETWORK'?'Cannot reach backend on port 8080.':`Error ${s||''}: ${e.response?.data?.message||e.message}`)
      })
      .finally(()=>setLoading(false))
  }
  useEffect(()=>{ fetchStores() },[])
  const approve=async id=>{ try{ await api.put(`/admin/stores/${id}/approve`); setStores(prev=>prev.map(s=>s.id===id?{...s,approved:true}:s)) }catch(e){alert(e.response?.data?.message||e.message)} }
  const reject=async id=>{ try{ await api.put(`/admin/stores/${id}/reject`); setStores(prev=>prev.map(s=>s.id===id?{...s,approved:false}:s)) }catch(e){alert(e.response?.data?.message||e.message)} }
  if(loading) return <div className="text-center py-5"><div className="spinner-border text-dark"/></div>
  return <div>
    <div className="d-flex align-items-center justify-content-between mb-4">
      <h4 className="mb-0">Stores ({stores.length})</h4>
      <button className="btn btn-outline-secondary btn-sm" onClick={fetchStores}><i className="bi bi-arrow-clockwise me-1"/>Refresh</button>
    </div>
    {error&&<div className="alert alert-danger d-flex gap-2"><i className="bi bi-exclamation-triangle-fill"/><div>{error}</div><button className="btn btn-sm btn-outline-danger ms-auto" onClick={fetchStores}>Retry</button></div>}
    <div className="table-responsive"><table className="table table-hover align-middle">
      <thead className="table-dark"><tr><th>Name</th><th>Category</th><th>Owner ID</th><th>Status</th><th>Actions</th></tr></thead>
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
