import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'https://catholicportal.net/',
    // timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  })
  
  axiosInstance.interceptors.request.use(
    function (config) {
    //   const session = getSessionData() 
      // Retrieve auth token from sessionStorage
  
    //   if (session) {
    //     const token = session.tokens.access_token
    //     config.headers.Authorization = `Bearer ${token}`
    //   }
      return config
    },
  
    function (error) {
      return Promise.reject(error)
    }
  )
  
  export default axiosInstance