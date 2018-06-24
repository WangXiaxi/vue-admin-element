import Vue from 'vue'
import Vuex from 'vuex'
import {setStore, getStore} from '@/config/mUtils'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const state = {
  adminInfo: getStore('UseId'),
  adminName: getStore('UseName'),
  Token: getStore('Token')
}

const mutations = {
  changelogin (state, infoArr) {
    state.adminInfo= infoArr.UseId
    state.adminName= infoArr.UseName
    state.Token= infoArr.Token
    setStore("UseId", infoArr.UseId)
    setStore("UseName", infoArr.UseName)
    setStore("Token", infoArr.Token)
  }
}
const actions = {
  changelogin({commit}, data){
    commit('changelogin', {UseId: data.useidinfo, UseName: data.UseName, Token: data.Token})
  }
}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	state,
	actions,
	mutations,
  plugins: debug ? [createLogger()] : []
})
