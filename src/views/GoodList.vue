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
          <span class="default">Default</span>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd @click="setPriceFilter('all')">
                <a href="javascript:void(0)" :class="{'cur':priceChecked==='all'}">All</a>
              </dd>
              <dd v-for="(item,index) in priceFilter" :key="index" @click="setPriceFilter(index)">
                <a href="javascript:void(0)" :class="{'cur':priceChecked===index}">{{item.startPrice}}-{{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodList" :key="index" class="item">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                <img src="../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closeProp"></div>
    <nav-footer></nav-footer>
  </div>
</template>
<script type="text/ecmascript-6">
import '../assets/css/base.css'
import '../assets/css/product.css'
import '../assets/css/login.css'
import NavHeader from '../components/header'
import NavFooter from '../components/footer'
import NavBread from '../components/bread'
import axios from 'axios'
export default {
  data() {
    return {
      goodList: [],
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      loading: false,
      priceFilter: [
        {
          startPrice: '0',
          endPrice: '100'
        },
        {
          startPrice: '100',
          endPrice: '500'
        },
        {
          startPrice: '500',
          endPrice: '1000'
        },
        {
          startPrice: '1000',
          endPrice: '5000'
        }
      ],
      priceChecked: 'all',
      filterBy: false,
      overLayFlag: false
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  mounted() {
    this.getGoodsList()
  },
  methods: {
    getGoodsList(flag) {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLeval: this.priceChecked
      }
      this.loading = true
      axios.get('/goods', {
        params: params
      }).then((result) => {
        var res = result.data
        this.loading = false
        if (res.status === '0') {
          if (flag) {
            this.goodList = this.goodList.concat(res.result.list)
            if (res.result.count < this.pageSize) {
              this.busy = true
            } else {
              this.busy = false
            }
          } else {
            this.goodList = res.result.list
            this.busy = false
          }
        } else {
          this.goodList = []
        }
      })
    },
    sortGoods() {
      this.sortFlag = !this.sortFlag
      console.log(this.sortFlag)
      this.page = 1
      this.getGoodsList()
    },
    setPriceFilter(index) {
      this.priceChecked = index
      this.page = 1
      this.getGoodsList()
      this.closeProp()
    },
    loadMore() {
      this.busy = true
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 500)
    },
    showFilterPop() {
      this.filterBy = true
      this.overLayFlag = true
    },
    closeProp() {
      this.filterBy = false
      this.overLayFlag = false
    }
  }
}
</script>
