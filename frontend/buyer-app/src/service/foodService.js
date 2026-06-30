import axios from 'axios'

export const fetchFoodList = async () => {
  try {
    const response = await axios.get('/api/foods')
    return response.data?.data || []
  } catch {
    return []
  }
}

export const fetchFoodById = async (id) => {
  try {
    const response = await axios.get(`/api/foods/${id}`)
    return response.data?.data || null
  } catch {
    return null
  }
}
