// home首页数据仓库
// 引入请求方法
import mockRequest from '@/utils/mockRequest'
const state = {
    // 保存数据
    list:{}
}
const mutations = {
    // GETDATA处理数据
    GETDATA(state,list){
        state.list = list
    }
}
const actions = {
    // 发送请求获取mock模拟数据
    async getData({commit}){
      let result =  await mockRequest.get('/home/list')
    //   判断一下数据是否请求成功
    if(result.code == 20000){
        // 请求成功，将数据提交到mutations中
        commit('GETDATA',result.data)
    }
    }
}
const getters = {}

export default{
    state,
    mutations,
    actions,
    getters
}