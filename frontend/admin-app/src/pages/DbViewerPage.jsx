import React,{useEffect,useState} from 'react'
import api from '../api/axios'

const COLLECTIONS=[
  {key:'users',label:'Users',endpoint:'/admin/users',color:'primary'},
  {key:'stores',label:'Stores',endpoint:'/admin/stores',color:'success'},
  {key:'orders',label:'Orders',endpoint:'/admin/orders',color:'warning'},
  {key:'payments',label:'Payments',endpoint:'/admin/db/payments',color:'info'},
  {key:'notifications',label:'Notifications',endpoint:'/admin/db/notifications',color:'secondary'},
]

export default function DbViewerPage() {
  const [active,setActive]=useState('users'); const [data,setData]=useState({}); const [loading,setLoading]=useState(false)
  const [search,setSearch]=useState('')

  const load=async key=>{
    setActive(key); if(data[key]) return
    setLoading(true)
    try {
      const col=COLLECTIONS.find(c=>c.key===key)
      const r=await api.get(col.endpoint); setData(d=>({...d,[key]:r.data?.data||[]}))
    } catch(e){ setData(d=>({...d,[key]:[]})) } finally{setLoading(false)}
  }

  useEffect(()=>{ load('users') },[])

  const rows=data[active]||[]
  const filtered=!search.trim()?rows:rows.filter(r=>JSON.stringify(r).toLowerCase().includes(search.toLowerCase()))

  const col=COLLECTIONS.find(c=>c.key===active)

  return <div>
    <h4 className="mb-1"><i className="bi bi-database me-2"/>Database Viewer</h4>
    <p className="text-muted small mb-3">MongoDB → foodie_db</p>

    <div className="d-flex gap-2 mb-3 flex-wrap">
      {COLLECTIONS.map(c=><button key={c.key} className={`btn btn-sm ${active===c.key?`btn-${c.color}`:`btn-outline-${c.color}`}`} onClick={()=>load(c.key)}>
        {c.label} {data[c.key]?<span className="badge bg-light text-dark ms-1">{data[c.key].length}</span>:''}
      </button>)}
    </div>

    <div className="mb-3">
      <input className="form-control form-control-sm" style={{maxWidth:300}} placeholder="Search in collection..." value={search} onChange={e=>setSearch(e.target.value)}/>
    </div>

    {loading?<div className="text-center py-4"><div className="spinner-border text-dark"/></div>:
    <div className="table-responsive" style={{maxHeight:600}}>
      {filtered.length===0?<p className="text-muted">No records found.</p>:
      <table className="table table-sm table-hover align-top" style={{fontSize:'0.8rem'}}>
        <thead className="table-dark sticky-top">
          <tr>{filtered[0]&&Object.keys(filtered[0]).filter(k=>k!=='password').map(k=><th key={k}>{k}</th>)}</tr>
        </thead>
        <tbody>{filtered.slice(0,200).map((row,i)=><tr key={i}>
          {Object.entries(row).filter(([k])=>k!=='password').map(([k,v])=>(
            <td key={k} style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {typeof v==='object'&&v!==null?<code style={{fontSize:'0.7rem'}}>{JSON.stringify(v).substring(0,60)}</code>:String(v||'')}
            </td>
          ))}
        </tr>)}</tbody>
      </table>}
      {filtered.length>200&&<p className="text-muted small">Showing first 200 of {filtered.length} records.</p>}
    </div>}
  </div>
}
