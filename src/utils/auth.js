// import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'


// 不用Cookie，是因为electron中不支持Cookie，但是也不会报错，所以登录成功之后
// 登录后读写Cookie的操作都会失败，但是不会报错
// 因此需要使用本地缓存loaclStorage解决
export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return localStorage.setItem(TokenKey,token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return localStorage.removeItem(TokenKey)
}
