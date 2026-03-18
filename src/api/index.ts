import  axios from 'axios'
export const request = axios.create({
    baseURL:import.meta.env.BASE_URL,
    timeout:5000
})
request.interceptors.request.use (async config=>{
    //token 注入 TDOD 
    const token =""
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
    return config
},reject=>{
    return Promise.reject(reject)
})
request.interceptors.response.use(config=>{
    return config
},reject=>{
    return Promise.reject(reject)
})

export default request