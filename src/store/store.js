import Vue from "vue"
import VueX from "vuex"
Vue.use(VueX);

function getCartsFromLocalStrorage(){
    var carts = localStorage.getItem("cartinfo");
    carts = carts ? JSON.parse(carts) : []
    return carts;
}

function saveToLocalStorage(carts){
    localStorage.setItem("cartinfo", JSON.stringify(carts))
}

export default new VueX.Store({
    //数据
    state: {
        carts: getCartsFromLocalStrorage()
    },
    //操作数据的方法
    mutations: {
        addToCarts(state, cart){
            //在将数据存储到购物车中的时候，需要判断之前是否已经存储过这个商品了
            //如果有，就更新他的count
            var temp = state.carts.filter(v => v.id == cart.id);
            if(temp.length > 0){
                temp[0].count += cart.count;
            }else{
                //如果没有,就将对象直接push进去
                state.carts.push(cart);
            }     

            //将数据重新存储到localstorage中
            saveToLocalStorage(state.carts);
        }
    },
    //获取数据的方法
    getters: {
        totalCount(state){
            var result = 0;
            state.carts.forEach(v => {
                result += v.count
            })
            return result;
        },
        getIds(state){
            return state.carts.map(v => v.id).join(",");
        },
        getCountById: (state, getters) => (id) => {
            var temp = state.carts.filter(v => v.id == id);
            if(temp.length > 0){
                return temp[0].count;
            }else{
                return 0;
            }
        },
        updateCarts: (state, getters) => (carts) => {
            state.carts = carts.map(v => {
                return {id: v.id, count: v.count}
            })

            saveToLocalStorage(state.carts);
        }
    }
});
