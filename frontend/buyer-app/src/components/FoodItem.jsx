import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'

export default function FoodItem({ id, name, description, category, imageUrl, price }) {
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext)
  const qty = quantities[id] || 0
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    increaseQty(id)
    setAdded(true)
    setTimeout(() => setAdded(false), 500)
  }

  return (
    <article className="food-card">
      <div className="food-card-top">
        <span className="food-badge">{category || 'Menu'}</span>
      </div>

      <div className="food-card-body">
        <div className="food-card-title">
          <h5>{name}</h5>
          <span className="food-price">€{price}</span>
        </div>
        <p className="food-description">{description || 'Delicious food to enjoy.'}</p>
      </div>

      <div className="food-card-footer">
        <Link to={`/stores/${id}`} className="btn btn-link p-0 text-decoration-none">View details</Link>
        {qty > 0 ? (
          <div className="qty-control">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => decreaseQty(id)}>-</button>
            <span>{qty}</span>
            <button className="btn btn-danger btn-sm" onClick={handleAdd}>+</button>
          </div>
        ) : (
          <button className={`btn btn-danger btn-sm ${added ? 'btn-added' : ''}`} onClick={handleAdd}>
            Add
          </button>
        )}
      </div>
    </article>
  )
}
