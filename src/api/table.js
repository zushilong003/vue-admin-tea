import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/pmEmr/table/list',
    method: 'get',
    params
  })
}
