import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HOT_DEALS = [
  {
    id: 'hd1',
    title: 'Farm-fresh basket, 30% off today',
    subtitle: 'Salad',
    category: 'Fruits & Vegetables',
    img: '/images/header1.jpg',
    fallbackBg: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
  },
  {
    id: 'hd2',
    title: 'Weekend pizza bundle — great value',
    subtitle: 'Pizza',
    category: 'Snacks & Branded Foods',
    img: '/images/header2.jpg',
    fallbackBg: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
  },
  {
    id: 'hd3',
    title: 'Sweet tooth? Cakes are 20% off',
    subtitle: 'Cake',
    category: 'Bakery, Cakes & Dairy',
    img: '/images/header3.jpg',
    fallbackBg: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
  },
]

const SWIPE_THRESHOLD = 50

export default function Header() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [imgErrors, setImgErrors] = useState({})
  const navigate = useNavigate()
  const trackRef = useRef(null)
  const dragState = useRef({ startX: 0, dragging: false, moved: false })

  useEffect(() => {
    const t = setInterval(
      () => setActiveSlide((s) => (s + 1) % HOT_DEALS.length),
      5000
    )
    return () => clearInterval(t)
  }, [])

  const goToSlide = (i) => setActiveSlide(i)

  const goToDeal = (deal) =>
    navigate(`/explore?category=${encodeURIComponent(deal.category)}`)

  const handleDragStart = (clientX) => {
    dragState.current = { startX: clientX, dragging: true, moved: false }
  }

  const handleDragMove = (clientX) => {
    if (!dragState.current.dragging) return
    if (Math.abs(clientX - dragState.current.startX) > 10)
      dragState.current.moved = true
  }

  const handleDragEnd = (clientX) => {
    if (!dragState.current.dragging) return
    const delta = clientX - dragState.current.startX
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) setActiveSlide((s) => (s + 1) % HOT_DEALS.length)
      else setActiveSlide((s) => (s - 1 + HOT_DEALS.length) % HOT_DEALS.length)
    }
    dragState.current.dragging = false
  }

  const handleSlideClick = (deal, e) => {
    if (dragState.current.moved) { e.preventDefault(); return }
    goToDeal(deal)
  }

  return (
    <section className="header-hot-deals mb-4">
      <div className="hot-deals-label">
        <span className="hd-eyebrow">Hot deals</span>
        <h2>Today&apos;s picks, picked fast</h2>
      </div>

      <div
        className="hd-carousel"
        ref={trackRef}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={(e) => handleDragEnd(e.clientX)}
        onMouseLeave={() => (dragState.current.dragging = false)}
      >
        <div
          className="hd-carousel-track"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {HOT_DEALS.map((deal) => (
            <button
              className="hd-carousel-slide"
              key={deal.id}
              onClick={(e) => handleSlideClick(deal, e)}
              aria-label={`View ${deal.subtitle} deals`}
              style={imgErrors[deal.id] ? { background: deal.fallbackBg } : {}}
            >
              {!imgErrors[deal.id] && (
                <img
                  src={deal.img}
                  alt={deal.title}
                  draggable={false}
                  onError={() =>
                    setImgErrors((prev) => ({ ...prev, [deal.id]: true }))
                  }
                />
              )}
              {imgErrors[deal.id] && (
                <div className="hd-fallback-content">
                  <span className="hd-fallback-tag">{deal.subtitle}</span>
                  <span className="hd-fallback-title">{deal.title}</span>
                </div>
              )}
              {!imgErrors[deal.id] && (
                <div className="hd-carousel-caption">
                  <span className="hd-carousel-tag">{deal.subtitle}</span>
                  <span className="hd-carousel-title">{deal.title}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="hd-dot-trail">
          {HOT_DEALS.map((_, i) => (
            <button
              key={i}
              className={`hd-dot ${i === activeSlide ? 'hd-dot-active' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
