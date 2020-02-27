import request from '@/utils/request'

export function getInfo(token) {
  return request({
    url: '/pmEmr/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/pmEmr/user/logout',
    method: 'post'
  })
}
