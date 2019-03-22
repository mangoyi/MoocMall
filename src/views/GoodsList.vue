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
                    <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg>
                </a>
                <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
                </div>
                <div class="accessory-result">
                <!-- filter -->
                <div class="filter stopPop" id="filter" :class="{'filterby-show': filterby }">
                    <dl class="filter-price">
                    <dt>Price:</dt>
                    <dd>
                        <a href="javascript:void(0)"  :class="{'cur': priceChecked === 'all'}" @click="priceChecked = 'all'">All</a>
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
                                    <a href="javascript:;" class="btn btn--m">加入购物车</a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                            加载中...
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag"  @click="closePop" ></div>
        <nav-footer></nav-footer> 
    </div>
</template>

<script>
import NavHeader from './NavHeader'
import NavFooter from './NavFooter'
import NavBread from './NavBread'
import axios from 'axios'

export default {
    components: {
        NavHeader,
        NavFooter,
        NavBread
    },
    data() {
        return {
            goodsList: [],
            priceFilter: [
                {
                    startPrice: '0.00',
                    endPrice: '500.00'
                },
                {
                    startPrice: '500.00',
                    endPrice: '1000.00'
                },
                { 
                    startPrice: '1000.00',
                    endPrice: '2000.00'
                }
            ],
            priceChecked: 'all',
            filterby: false,
            overLayFlag: false,
            sortFlag: true ,
            page: 1,
            pageSize: 8,
            busy: false
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
                sort: this.sortFlag ? 1 : -1
            }
            axios.get('/goods', {
                params: param
            }).then(resp => {
                let res = resp.data;
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
        }
    }
}
</script>

<style>
@import url('../assets/css/base.css');
@import url('../assets/css/product.css');

</style>
