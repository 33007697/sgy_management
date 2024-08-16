import request from '@/utils/request'

// 登录的API
// 更换为真实的API，不再是mock的API
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}
// 获取用户信息的API
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}
// 退出登录的API
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
