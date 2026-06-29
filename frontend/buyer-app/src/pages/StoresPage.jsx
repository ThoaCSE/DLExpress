import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function StoresPage() {
  const [stores, setStores] = useState([]); const [loading, setLoading] = useState(true)
  useEffect(()=>{ axios.get('/api/stores').then(r=>setStores(r.data?.data||[])).finally(()=>setLoading(false)) },[])
  if(loading) return <div className="text-center py-5"><div className="spinner-border text-danger"/></div>
  return <div>
    <h4 className="mb-4">Available Restaurants</h4>
    {!stores.length ? <p className="text-muted">No stores open yet.</p> :
    <div className="row g-3">{stores.map(s=>(
      <div className="col-md-4" key={s.id}>
        <div className="card h-100 shadow-sm">
          {s.imageUrl && <img src={s.imageUrl} className="card-img-top" alt={s.name} style={{height:160,objectFit:'cover'}}/>}
          <div className="card-body">
            <h5 className="card-title">{s.name}</h5>
            <p className="card-text text-muted small">{s.category}</p>
            <Link to={`/stores/${s.id}`} className="btn btn-danger btn-sm">Order Now</Link>
          </div>
        </div>
      </div>
    ))}</div>}
  </div>
}
