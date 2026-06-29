import axios from 'axios'

export const fetchFoodList = async () => {
  try {
    const response = await axios.get('/api/foods')
    return response.data?.data || []
  } catch {
    return []
  }
}
