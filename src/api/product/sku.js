import request from "@/utils/request"

//sku列表的接口 地址是:/admin/product/list/{page}/{limit}  请求方式:get
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })

// 上架 地址是:/admin/product/onSale/{skuId} 请求方式:get
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

// 下架 地址是:/admin/product/cancelSale/{skuId} 请求方式:get
export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })

// 获取sku详情的接口 地址:/admin/product/getSkuById/{skuId} 请求方式:get
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })