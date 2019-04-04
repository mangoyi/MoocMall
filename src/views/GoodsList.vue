<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                <span class="sortby">Sort by:</span>
                <a href="javascript:void(0)" class="default cur">Default</a>
                <a href="javascript:void(0)" class="price" @click="sortGoods">
                    Price 
                    <svg class="icon icon-arrow-short" v-bind:class="{'sort-up': !sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg>
                </a>
                <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
                </div>
                <div class="accessory-result">
                <!-- filter -->
                <div class="filter stopPop" id="filter" :class="{'filterby-show': filterby }">
                    <dl class="filter-price">
                    <dt>Price:</dt>
                    <dd>
                        <a href="javascript:void(0)"  :class="{'cur': priceChecked === 'all'}" @click="setPriceFilter('all')">All</a>
                    </dd>
                    <dd v-for="(price, index) in priceFilter" :key="index">
                        <a href="javascript:void(0)" :class="{'cur': priceChecked === index}" @click="setPriceFilter(index)" >{{ price.startPrice }} - {{ price.endPrice }}</a>
                    </dd>
                    </dl>
                </div>

                <!-- search result accessories list -->
                <div class="accessory-list-wrap">
                    <div class="accessory-list col-4">
                        <ul>
                            <li v-for="(item, index) in goodsList" :key="index">
                                <div class="pic">
                                    <!-- <a href="#"><img :src="'../static/' + item.productImg" alt=""></a> -->
                                    <a href="#"><img v-lazy="'../static/' + item.productImage" alt=""></a>
                                </div>
                                <div class="main">
                                    <div class="name">{{ item.productName }}</div>
                                    <div class="price">{{ item.salePrice}}</div>
                                    <div class="btn-area">
                                    <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                            <img src="../assets/svg/loading-spinning-bubbles.svg" alt="error" v-show="loading">
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
            <p slot="message">
                请先登录，否则无法加入购物车
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:void(0)" @click="mdShow = false">关闭</a>
            </div>
        </modal>
        <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
            <p slot="message">
                加入购物车成功
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:void(0)" @click="mdShowCart = false">继续购物</a>
                <router-link class="btn btn--m" href="javascript:void(0)" to="/cart">查看购物车</router-link>
            </div>
        </modal>
        <nav-footer></nav-footer> 
    </div>
</template>

<script>
import NavHeader from './NavHeader'
import NavFooter from './NavFooter'
import NavBread from './NavBread'
import Modal from '../components/Modal'
import axios from 'axios'

export default {
    components: {
        NavHeader,
        NavFooter,
        NavBread,
        Modal
    },
    data() {
        return {
            goodsList: [],
            priceFilter: [
                {
                    startPrice: '0.00',
                    endPrice: '100.00'
                },
                {
                    startPrice: '100.00',
                    endPrice: '500.00'
                },
                {
                    startPrice: '500.00',
                    endPrice: '1000.00'
                },
                { 
                    startPrice: '1000.00',
                    endPrice: '5000.00'
                }
            ],
            priceChecked: 'all',
            filterby: false,
            overLayFlag: false,
            sortFlag: true ,
            page: 1,
            pageSize: 8,
            busy: false,
            loading: false,
            mdShow: false,
            mdShowCart: false
        }
    },
    mounted () {
        // 初始化
        this.getGoodsList();
    },
    methods: {
        getGoodsList(flag) {
            let param = {
                page: this.page,
                pageSize: this.pageSize,
                sort: this.sortFlag ? 1 : -1,
                priceLevel: this.priceChecked
            }
            this.loading = true;
            axios.get('/goods/list', {
                params: param
            }).then(resp => {
                let res = resp.data;
                this.loading = false;
                if (res.status === 0) {
                    if(flag) {
                        // 分页拼接数据
                        this.goodsList = this.goodsList.concat(res.result.list);
                        if (res.result.count === 0) {
                            // 禁用滚动条(最后一页数据)
                            this.busy = true;
                        } else {
                            this.busy = false;
                        }
                    } else {
                        this.goodsList = res.result.list;
                        this.busy = false;
                    }
                }
            })
        },
        showFilterPop() {
            this.filterby = true;
            this.overLayFlag = true;
        },
        closePop() {
            this.filterby = false;
            this.overLayFlag = false;
        },
        setPriceFilter(index) {
            this.priceChecked = index;
            this.closePop();
            this.page = 1;
            this.getGoodsList()
        },
        sortGoods() {
            // 排序  sortFlag = true升序 false降序
            this.sortFlag = !this.sortFlag;
            this.page = 1;
            this.getGoodsList();
        },
        loadMore( ) {
            // 再次滚动就停止发送请求
            this.busy = true;
            setTimeout(() => {
                this.page++;
                this.getGoodsList(true);
            }, 500);
        },
        addCart(productId) {
            axios.post("/goods/addCart", {
                productId: productId
            }).then((res) => {
                let data = res.data;
                if (data.status == 0) {
                    this.mdShowCart = true;
                    this.$store.commit('SETCARTCOUNT', 1);
                } else {
                    this.mdShow = true;
                }
            }).catch(err => {
                // todoes
            })
        },
        closeModal() {
            this.mdShow = false;
            this.mdShowCart = false;
        }
    }
}
</script>

<style>
@import url('../assets/css/base.css');
@import url('../assets/css/product.css');
.sort-up {
    transform:rotate(180deg);
    transition: all .3s ease-out;
}
.icon-arrow-short {
    transition: all .3s ease-out;
}
.btn:hover {
    background-color: #ffe5e6;
    transition: all .3s ease-out;
}
</style>
