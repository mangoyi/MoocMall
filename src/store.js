import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        nickName: '',
        cartCount: 0
    },
    mutations: {
        SETUSER(state, nickName) {
            state.nickName = nickName;
        },
        SETCARTCOUNT(state, cartCount) {
            state.cartCount += cartCount;
        },
        INITCARTCOUNT(state, cartCount) {
            state.cartCount = cartCount;
        }
    }
});

export default store