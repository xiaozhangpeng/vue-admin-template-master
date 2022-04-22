// Spu数据接口
import request from "@/utils/request"


// 获取Spu列表数据的接口 地址是:/admin/product/{page}/{limit} 请求方式是get 必须携带的参数:page limit category3Id
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id: category3Id } })

// 获取某个Spu信息的接口 地址是:/admin/product/getSpuById/{spuId} 请求方式get
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

//获取品牌的信息 地址是:/admin/product/baseTrademark/getTrademarkList 请求方式:get
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// 获取Spu图片的接口 地址是:/admin/product/spuImageList/{spuId} 请求方式get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取平台全部的销售属性--------属性最多有3个 地址是:/amdin/product/baseSaleAttrList 请求方式:get
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// 修改spu|添加spu----看书是否有id来区分 地址是:/admin/product/upadteSpuInfo 请求方式:posy
export const reqAddOrUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
    }
    // 添加spu 地址是:/admin/product/saveSpuInfo 请求方式:post
    else {
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
}

// 删除Spu 地址是:/admin/product/deleteSpu/{spuId} 请求方式:Delete
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 获取图片数据的接口 地址是:/admin/product/spuImageList/{spuId} 请求方式：get
export const reqSpuImageList2 = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性的接口 地址是:/admin/product/spuSaleAttrList/{spuId} 请求方式:get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })

// 获取属性信息的接口 地址是:/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} 请求方式:get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加SKU 地址是:/admin/product/saveSkuInfo 请求方式:post
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })

// 获取SKU列表数据的接口 地址是:/admin/product/findBySpuId/{spuId} 请求方式:get
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })