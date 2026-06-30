const cartKey = 'dlexpress_cart'

export const getCart = () => {
  try {
    return JSON.parse(sessionStorage.getItem(cartKey) || '[]')
  } catch {
    return []
  }
}

const persist = (cart) => {
  sessionStorage.setItem(cartKey, JSON.stringify(cart))
  window.dispatchEvent(new Event('dlexpress-cart-changed'))
}

export const addCartItem = (item) => {
  const cart = getCart()
  const idx = cart.findIndex((x) => x.foodItemId === item.foodItemId)
  if (idx === -1) {
    cart.push(item)
  } else {
    cart[idx] = { ...cart[idx], quantity: (cart[idx].quantity || 0) + (item.quantity || 1) }
  }
  persist(cart)
}

export const setCartItemQuantity = (foodItemId, quantity) => {
  const cart = getCart()
    .map((item) => item.foodItemId === foodItemId ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0)
  persist(cart)
}

export const removeCartItem = (foodItemId) => {
  const cart = getCart().filter((item) => item.foodItemId !== foodItemId)
  persist(cart)
}

export const clearCart = () => {
  sessionStorage.removeItem(cartKey)
  window.dispatchEvent(new Event('dlexpress-cart-changed'))
}

export const getCartItemCount = () => getCart().reduce((sum, item) => sum + (item.quantity || 0), 0)
