import request from '@/utils/request'

export function queryUserList(params) {
  return request({
    url: '/pmEmr/cy/queryUserList',
    method: 'post',
    params
  })
}

export function getCaptCha(params) {
  return request({
    url: '/pmEmr/cy/getCaptCha',
    method: 'post',
    params
  })
}

export function cyLogin(params) {
  return request({
    url: '/pmEmr/cy/cyLogin',
    method: 'post',
    data: params
  })
}
