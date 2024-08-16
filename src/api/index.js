// 将商品管理的接口全部引入，统一暴露出去
import * as trademark from './product/trademark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'
// 引入权限管理的接口,并统一暴露出去
import permission from './acl/permission'
import role from './acl/role'
import * as user from  './acl/user'

// 统一暴露接口
export default {
    trademark,
    attr,
    sku,
    spu,
    permission,
    role,
    user
}