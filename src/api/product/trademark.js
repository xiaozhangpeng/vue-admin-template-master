// 这个模块是获取品牌管理的数据的模块
import request from "@/utils/request"

// 获取品牌列表的接口 地址是:/admin/product/baseTrademark/{page}/{limit} 请求方式:get
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 处理添加品牌的接口 地址是:/admin/product/baseTrademark/save 请求方式post
// 需要携带两个参数：品牌名称和品牌LOGO
// 切记：对于新增的品牌，给服务器传递数据。不需要传递ID，ID是由服务器生成的

// 修改品牌 地址是:/admin/product/baseTrademark/update 请求方式put
// 需要携带三个参数：id,品牌名称和品牌LOGO
// 切记：对于修改某一品牌的操作，前端携带的参数需要携带Id，告诉服务器是哪一个品牌

export const reqAddOrUpdateTradeMark = (tradeMark) => {
    // 带给服务器数据携带ID
    // 修改品牌
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        // 新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }

}

// 删除品牌 地址是:/admin/product/baseTradeMark/remove/{id} 请求方式delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })