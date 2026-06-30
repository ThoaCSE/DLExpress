import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import ExploreMenu from '../components/ExploreMenu'
import DealsForToday from '../components/DealsForToday'

const CATEGORY_MAP = {
  All: 'All',
  Fruits: 'Fruits',
  Vegetables: 'Vegetables',
  Dairy: 'Dairy',
  Bakery: 'Bakery',
  Snacks: 'Snacks',
  Drinks: 'Drinks',
}

export default function StoresPage() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [searchText, setSearchText] = useState('')
  const [promotions, setPromotions] = useState([])
  const [promoPopupClosed, setPromoPopupClosed] = useState(false)

  useEffect(() => {
    axios.get('/api/stores')
      .then((res) => setStores(res.data?.data || []))
      .catch(() => setStores([]))
      .finally(() => setLoading(false))

    axios.get('/api/promotions')
      .then((res) => setPromotions(res.data?.data || []))
      .catch(() => setPromotions([]))
  }, [])

  const filteredStores = stores.filter((store) => {
    const matchesCategory = category === 'All' || store.category === CATEGORY_MAP[category]
    const matchesSearch = store.name.toLowerCase().includes(searchText.toLowerCase()) || (store.category || '').toLowerCase().includes(searchText.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} searchText={searchText} setSearchText={setSearchText} />

      {!promoPopupClosed && promotions.length > 0 && (
        <div className="promo-popup shadow">
          <button className="btn-close promo-popup-close" onClick={() => setPromoPopupClosed(true)} aria-label="Close" />
          <div className="small text-uppercase fw-bold text-danger mb-2">Seller Advertisement</div>
          <h5 className="mb-1">{promotions[0].title}</h5>
          <p className="text-muted small mb-3">{promotions[0].subtitle}</p>
          <Link className="btn btn-danger btn-sm" to={`/stores/${promotions[0].storeId}`}>Visit Shop</Link>
        </div>
      )}

      <section className="store-grid mb-4">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-danger" /></div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-5 text-muted">No stores found.</div>
        ) : (
          <div className="row g-4">
            {filteredStores.map((store) => (
              <div className="col-md-4" key={store.id}>
                <div className="store-card p-4 shadow-sm">
                  <h5>{store.name}</h5>
                  <p className="text-muted mb-3">{store.category || 'General'}</p>
                  <p className="mb-3">{store.description || 'Shop fresh groceries and meals from this store.'}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link className="btn btn-danger btn-sm" to={`/stores/${store.id}`}>
                      Visit Store
                    </Link>
                    <span className="text-muted">{store.location || 'Nearby'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <DealsForToday promotions={promotions} />
    </>
  )
}
