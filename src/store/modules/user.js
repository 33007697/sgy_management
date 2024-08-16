import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// 从router路由中引入异步路由，常量路由、任意路由
import { resetRouter,ayncRoutes,randomRoutes,constantRoutes,} from '@/router'
import router from '@/router'


const getDefaultState = () => {
  return {
    // 保存token
    token: getToken(),
    // 保存用户名称
    name: '',
    // 保存用户头像
    avatar: '',
    // 保存用户路由标记
    routes:[],
    // 保存按钮标记
    buttons:[],
    // 保存用户角色
    roles:[],
    // 筛选过后的路由
    filterRoutes:[],
    // 最终组合后的路由
    resultAllRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 保存token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 保存用户信息
  SET_INFO:(state,info) => {
    // 保存用户信息
    state.name = info.name
    state.avatar = info.avatar
    state.buttons = info .buttons
    state.roles = info.roles
    state.routes = info.routes
  },
  // 筛选路由
  SET_FILTER:(state,filterRoute)=>{
    // 保存筛选后的路由
    state.filterRoutes = filterRoute
    console.log(filterRoute)
    // 对路由进行整合
    state.resultAllRoutes = constantRoutes.concat(state.filterRoutes,randomRoutes)
    // 添加到路由列表中
    router.addRoutes(state.resultAllRoutes)
  }
}

// 筛选路由函数
const filterRoutes = (ayncRoutes,routes) =>{
  // 筛选异步路由,并将结果返回
  return ayncRoutes.filter(item => {
    // 判断一下item.name是否存在于routes中
    if(routes.indexOf(item.name) != -1){
      // 存在则进行下一级判断，判断其是否有子路由，并且子路由不能为空
      if(item.children && item.children.length){
        // 存在则将item.children进行递归，将递归后的值重新赋予item.children
        item.children = filterRoutes(item.children,routes)
      }
      // 如果没有则直接返回真
      return true
    }
  })
}

const actions = {
  // 用户登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    // 自己写，使用async和await搭配
    const result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      // 登录成功
      // 提取token给仓库
      commit('SET_TOKEN', result.data.token)
      // 将token保存到存储中
      setToken(result.data.token)
      // 返回成功
      return '成功'
    } else {
      // 登录失败，返回失败结果
      return Promise.reject(new Error(result.message))
    }
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // 将用户数据保存，主要的是name、avatar、buttons按钮标记、roles用户角色、routes路由标记
        // console.log(data)
        commit('SET_INFO',data)
        // 筛选路由,并整合路由
        commit('SET_FILTER',filterRoutes(ayncRoutes,data.routes))

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 清除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

