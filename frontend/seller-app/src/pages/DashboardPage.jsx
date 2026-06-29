import React,{useEffect,useState} from 'react'
import api from '../api/axios'
import {getAuth} from '../utils/auth'

export default function DashboardPage() {
  const auth=getAuth(); const [store,setStore]=useState(null); const [foods,setFoods]=useState([])
  const [form,setForm]=useState({name:'',description:'',category:'',imageUrl:''}); const [foodForm,setFoodForm]=useState({name:'',description:'',price:'',category:'',imageUrl:''})
  const [msg,setMsg]=useState('')

  useEffect(()=>{
    if(!auth?.userId) return
    api.get(`/seller/store/${auth.userId}`).then(r=>{
      const s=r.data?.data; setStore(s)
      if(s?.id) api.get(`/foods/store/${s.id}`).then(r2=>setFoods(r2.data?.data||[]))
    }).catch(()=>{})
  },[auth?.userId])

  const createStore=async e=>{
    e.preventDefault()
    const r=await api.post('/seller/store',{...form,ownerId:auth.userId})
    setStore(r.data?.data); setMsg('Store created! Pending admin approval.')
  }
  const addFood=async e=>{
    e.preventDefault(); if(!store?.id) return
    const r=await api.post('/seller/foods',{...foodForm,price:parseFloat(foodForm.price),storeId:store.id,available:true})
    setFoods([...foods,r.data?.data]); setFoodForm({name:'',description:'',price:'',category:'',imageUrl:''}); setMsg('Food item added!')
  }
  const deleteFood=async id=>{ await api.delete(`/seller/foods/${id}`); setFoods(foods.filter(f=>f.id!==id)) }

  return <div>
    <h4 className="mb-3">Seller Dashboard</h4>
    {msg&&<div className="alert alert-success py-2 small">{msg}</div>}
    {!store ? (
      <div className="card shadow-sm p-4">
        <h5>Create Your Store</h5>
        <form onSubmit={createStore}>
          {[['name','Store Name'],['description','Description'],['category','Category'],['imageUrl','Image URL (optional)']].map(([k,l])=>(
            <div className="mb-2" key={k}><label className="form-label">{l}</label>
              <input className="form-control" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} required={k==='name'}/></div>
          ))}
          <button className="btn btn-success mt-2">Create Store</button>
        </form>
      </div>
    ) : <>
      <div className="card shadow-sm p-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div><h5 className="mb-0">{store.name}</h5><span className="text-muted small">{store.category}</span></div>
          {store.approved?<span className="badge bg-success">Live</span>:<span className="badge bg-warning text-dark">Pending Approval</span>}
        </div>
      </div>
      <div className="card shadow-sm p-4 mb-4">
        <h5>Add Menu Item</h5>
        <form onSubmit={addFood}>
          <div className="row g-2">
            {[['name','Name',6],['price','Price (Rs.)',6],['description','Description',12],['category','Category',6],['imageUrl','Image URL',6]].map(([k,l,c])=>(
              <div className={`col-md-${c}`} key={k}><label className="form-label">{l}</label>
                <input className="form-control" type={k==='price'?'number':'text'} step="0.01" value={foodForm[k]}
                  onChange={e=>setFoodForm({...foodForm,[k]:e.target.value})} required={['name','price'].includes(k)}/></div>
            ))}
          </div>
          <button className="btn btn-success mt-3">Add Item</button>
        </form>
      </div>
      <h5>Menu Items ({foods.length})</h5>
      <div className="row g-3">
        {foods.map(f=><div className="col-md-4" key={f.id}><div className="card shadow-sm h-100">
          {f.imageUrl&&<img src={f.imageUrl} className="card-img-top" alt={f.name} style={{height:110,objectFit:'cover'}}/>}
          <div className="card-body">
            <h6>{f.name}</h6><p className="text-muted small mb-1">{f.description}</p>
            <div className="d-flex justify-content-between align-items-center">
              <strong className="text-success">Rs.{f.price}</strong>
              <button className="btn btn-outline-danger btn-sm" onClick={()=>deleteFood(f.id)}>Delete</button>
            </div>
          </div>
        </div></div>)}
      </div>
    </>}
  </div>
}
