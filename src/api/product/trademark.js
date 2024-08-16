// trademark品牌管理页面接口
// 引入request请求模块
import request from '@/utils/request'

// 获取品牌列表
// 接口：/admin/product/baseTrademark/{page}/{limit}   get请求，参数page当前页和limit每页显示条数

export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })


// 添加品牌的请求
// 接口：/admin/product/baseTrademark/save  post请求，参数tmName和logoUrl
// 上传图片的请求
// /dev-api/admin/product/fileUpload
// 修改品牌的信息的请求
// 接口：/admin/product/baseTrademark/update   put请求，参数id，tmName和logoUrl

// 可以使用同一个api，通过对id的判断，来区分是添加还是修改
export const reqAddOrUpdateTradeMark = (trademark) => {
    // 判断一下是否有id，有则是修改，没有则是添加
    if (trademark.id) {
        // 这里是有id，是修改
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: trademark })
    } else {
        // 这里是没有id，是添加
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: trademark })
    }
}


// 删除品牌接口
// 接口：/admin/product/baseTrademark/remove/{id}   method：delete 参数：品牌id
export const reqDeleteTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})