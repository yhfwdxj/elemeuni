<template>
  <view class="container">
    <view class="shop-container" v-if="curWindowWidth>20">
      <view class="shop-info">
        <view class="name-time">
          <view class="name">{{res.name}}</view>
          <view class="time">
            <text style="color: rgb(226, 135, 48);">{{res.rating}}分</text>
            {{res.delivery_mode.text}}&nbsp;
            约40分钟·月售{{res.recent_order_num}}
          </view>
        </view>
        <view class="shop-img">
          <img :src="'https://elm.cangdu.org/img/' + res.image_path" class="imgs">
        </view>
      </view>
      <view class="promotion">
        公告:{{res.promotion_info}}
      </view>
      <view class="activities">
        {{res.activities[0].description}}
      </view>
    </view>
    <view class="food-review" v-if="res2">
      <view class="change-tag">
        <view class="change-food" @click="changeBox = 0">
          <text>点餐</text>
        </view>
        <view class="change-review" @click="changeBox = 1">
          <text>评价</text>
        </view>
      </view>
      <view class="scroll" v-if="changeBox===0">
        <view class="left-scroll-container">
          <scroll-view scroll-y="true" class="left-scroll"
            :style="{height:rightScrollHeight+'rpx',width:leftScrollWidth + 'rpx'  }" :scroll-into-view="leftIntoView">
            <view class="left" v-for="item,i in res2" :key="i" @click="scrollToRight(item,i)" :data-index="i"
              :id="'left'+i" :class="active===i?'active':''">
              {{item.name}}
            </view>
          </scroll-view>
        </view>
        <view class="">
          <scroll-view scroll-y="true" class="right-scroll"
            :style="{height:rightScrollHeight +'rpx',width:rightScrollWidth + 'rpx' }" :scroll-top="rightScrollTop2"
            scroll-with-animation="true" @scroll="rightscr" :scroll-into-view="rightIntoView">
            <block v-for="item,i in res2" :key="i">
              <view class="title" :id="'right'+item.id">
                {{item.name}}
              </view>
              <view class="right" v-for="item2,i in item.foods" :key="i">
                <view class="img-box">
                  <img :src="'https://elm.cangdu.org/img/' + item2.image_path"
                    :style="{height:140+'rpx',width:140 + 'rpx'}">
                </view>
                <view class="sale-info">
                  <view class="name-desc">
                    <view class="name">{{item2.name}}</view>
                    <view class="desc">{{item2.description}}</view>
                  </view>
                  <view class="sale">
                    月售:{{item2.month_sales}}&nbsp;好评率:{{item2.satisfy_rate}}%
                  </view>
                  <view class="price-cart">
                    <view class="price">
                      ￥{{item2.specfoods[0].price}}
                    </view>
                    <view class="cart">
                      <my-shopcart :item2='item2' :shopId='shopId'></my-shopcart>
                    </view>
                  </view>
                </view>
              </view>
            </block>
          </scroll-view>
        </view>
      </view>
      <view class="shop-cart">
        <view class="haveFood" v-if="foodsInfo.length!==0 &&hasFood">
          <view class="nav">
            <text>已选商品</text>
          </view>
          <view class="curFood" v-for="curFood,i in foodsInfo" :key="i">
            <view class="curfood-img">
              <img :src="'https://elm.cangdu.org/img/' + curFood.image_path" style=width:110rpx;height:100rpx>
            </view>
            <view class="curfood-info">
              <view class="food-name">{{curFood.name}}</view>
              <view class="price-num">
                <view class="price">￥{{curFood.price}}</view>
                <view class="food-num">
                  <view class="change-num">
                    <view class="reduce-num" v-if="curFood.num !== 0">
                      <view class="reduce" @click="reduce(curFood)">
                        <img src="/static/reduce.png" style=width:40rpx;height:40rpx>
                      </view>
                      <view class="num">
                        <text>{{curFood.num}}</text>
                      </view>
                    </view>
                    <view class="add" @click="add(curFood)">
                      <img src="/static/plus.png" style=width:40rpx;height:40rpx>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="noFood" v-if="res">
          <view class="cart-info" @click="showCart">
            <img src="/static/shoppingbag0.png" style="width:80rpx;height:80rpx" v-if="foodsInfo.length === 0">
            <img src="/static/shoppingbag1.png" style="width:80rpx;height:80rpx" v-else>
            <view class="curPrice-fee">
              <view class="curPrice">
                ￥{{$store.getters['shopcart/total']}}
              </view>
              <view class="fee">
                配送费￥{{res.float_delivery_fee}}
              </view>
            </view>
          </view>
          <view class="go-order">
            <button class="button" @click="goOrder"><text style="color:white;">结算</text></button>
          </view>
        </view>
      </view>
      <view class="review" v-if="changeBox === 1">
        <view class="review-container" v-if="scores">
          <view class="rating-info">
            <view class="rating-info">
              <text class="rating" style="color: rgb(226, 135, 48);font-size: 50rpx;">
                {{res.rating}}分
              </text>
              <view class="scores">
                <text class="promotion">高于附近{{(scores.compare_rating*100).toFixed(1)}}%的商家</text>
                <my-star :rating='res.rating'></my-star>
              </view>
            </view>
            <view class="scores2">
              <view class="foods">
                <text class="promotion">
                  味道
                </text>
                <view class="promotion">
                  <text style="color: black;">{{(scores.food_score).toFixed(1)}}</text>
                </view>
              </view>
              <view class="server">
                <text class="promotion">
                  包装
                </text>
                <view class="promotion">
                  <text style="color: black;">{{(scores.service_score).toFixed(1)}}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="tag">
          <view class="tag-info" v-for="item,i in tag" :key="i" @click="changeTag(i)"
            :class="tagIndex===i?'tag-color':''">
            <view>{{item.name}}</view>&nbsp;
            <view>{{item.count}}</view>
          </view>
        </view>
        <view class="user-review">
          <view class="user-container">
            <view class="user-img">
              <img src="https://elm.cangdu.org/img/default.jpg" style="width: 80rpx;height: 80rpx;">
            </view>
            <view class="user-info">
              <view class="username">
                {{rating[0].username}}
              </view>
              <view style="height: 40rpx;">
                <view style="display: flex;height: 52rpx;">
                  <text>满意度:</text>
                  <view style="margin-top: 7rpx;">
                    <my-star></my-star>
                  </view>
                </view>
              </view>
              <view class="review-img">
                <img src="https://fuss10.elemecdn.com/d/c8/64033625905f0a15a2d181d53a425jpeg.jpeg"
                  style="width: 120rpx;height: 120rpx;margin-right: 10rpx;">
                <img src="https://fuss10.elemecdn.com/0/74/e0e203f613deff4e456c31e4177d1jpeg.jpeg"
                  style="width: 120rpx;height: 120rpx;">
              </view>
            </view>
          </view>
        </view>
        <view class="user-review">
          <view class="user-container">
            <view class="user-img">
              <img src="https://elm.cangdu.org/img/default.jpg" style="width: 80rpx;height: 80rpx;">
            </view>
            <view class="user-info">
              <view class="username">
                {{rating[0].username}}
              </view>
              <view style="height: 40rpx;">
                <view style="display: flex;height: 52rpx;">
                  <text>满意度:</text>
                  <view style="margin-top: 7rpx;">
                    <my-star></my-star>
                  </view>
                </view>
              </view>
              <view class="review-img">
                <img src="https://fuss10.elemecdn.com/d/c8/64033625905f0a15a2d181d53a425jpeg.jpeg"
                  style="width: 120rpx;height: 120rpx;margin-right: 10rpx;">
                <img src="https://fuss10.elemecdn.com/0/74/e0e203f613deff4e456c31e4177d1jpeg.jpeg"
                  style="width: 120rpx;height: 120rpx;">
              </view>
            </view>
          </view>
        </view>

      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    ref,
    reactive,
    getCurrentInstance,
    nextTick,
    computed,
    watch
  } from 'vue'
  import {
    useStore
  } from 'vuex'
  import {
    onLoad,
    onReady,
    onUnload
  } from '@dcloudio/uni-app'
  import {
    request
  } from '@/utils/request.js'
  let res = ref()
  let res2 = ref()
  let res3 = ref()
  let rating = ref()
  let scores = ref()
  let tag = ref()
  let tagIndex = ref(0)
  let curWindowWidth = ref('')
  let shopId = ref('')
  let leftScrollTop = ref([])
  let rightScrollTop = ref([])
  let rightScrollHeight = ref('')
  let rightScrollTop2 = ref('')
  let active = ref(0)
  const currentInstance = getCurrentInstance()
  const store = useStore()
  let hasFood = ref(false)
  let curNumber = ref(0)
  let foodsInfo = computed(() => store.state.shopcart.cart)
  let changeBox = ref(0)
  let findRes = ref()
  let timer = undefined;
  let leftIntoView = ref('left0')
  let rightIntoView = ref('right0')
  let animationData = reactive({})
  let isclick = false
  let rightScrollWidth = ref()
  let leftScrollWidth = ref()
  onLoad(async (option) => {
    shopId.value = option.shop_id
    res.value = await request({
      url: `shopping/restaurant/${option.shop_id}`
    })
    res2.value = await request({
      url: `shopping/v2/menu?restaurant_id=${option.shop_id}`
    })
    rating.value = await request({
      url: `ugc/v2/restaurants/${shopId.value}/ratings?limit=10`
    })
    scores.value = await request({
      url: `ugc/v2/restaurants/${shopId.value}/ratings/scores`
    })
    tag.value = await request({
      url: `ugc/v2/restaurants/${shopId.value}/ratings/tags`
    })
    const {
      windowHeight,
      windowWidth
    } = uni.getSystemInfoSync()
    res3.value = windowHeight
    curWindowWidth.value = windowWidth * 1.8
    rightScrollWidth.value = curWindowWidth.value * 0.75
    leftScrollWidth.value = curWindowWidth.value * 0.2
    nextTick(() => {
      const query = uni.createSelectorQuery().in(currentInstance.proxy);
      query.selectAll('.title').boundingClientRect(data => {
        data.forEach((item, i) => {
          rightScrollTop.value[i] = item.top
        })
      }).exec();
      let rightScroll = uni.createSelectorQuery().in(currentInstance.proxy).select(".right-scroll");
      rightScroll.fields({
        size: true,
        scrollOffset: true,
        rect: true
      }, data => {
        rightScrollHeight.value = (res3.value - data.top) * 2 - 30
      }).exec();

    })
  })
  onUnload(() => {
    store.commit('shopcart/clear', [])
  })
  const scrollToRight = (item, i) => {
    isclick = true
    rightIntoView.value = 'right' + item.id
    active.value = i
    setTimeout(() => {
      isclick = false
    }, 500)
  }
  const rightscr = (e) => {
    if (!isclick) {
      if (timer !== undefined) clearTimeout(timer);
      timer = setTimeout(function() {
        for (let i = rightScrollTop.value.length - 1; i >= 0; i--) {
          if (e.detail.scrollTop >= rightScrollTop.value[i] - rightScrollTop.value[0] - 2) {
            active.value = i
            break
          }
        }
      }, 70);
    }
  }
  const showCart = () => {
    if (foodsInfo.value.length !== 0) hasFood.value = !hasFood.value
  }
  const reduce = (curFood) => {
    curFood.num--
    store.commit('shopcart/reduceCart', curFood)
  }
  const add = (curFood) => {
    hasFood.value = true
    curFood.num++
    store.commit('shopcart/addToCart', curFood)
  }
  const goOrder = () => {
    uni.navigateTo({
      url: `/subpkg/shopOrder/shopOrder?id=${res.value.id}&longitude=${res.value.longitude}&latitude=${res.value.latitude}`
    })
  }
  const animation = () => {
    let animation = uni.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
  }
  const changeTag = (i) => {
    tagIndex.value = i
  }
</script>

<style lang="scss" scoped>
  %littleText {
    font-size: 27rpx;
    color: rgb(186, 186, 186);
  }

  %box-shadows {
    border: 2rpx solid white;
    border-radius: 18rpx;
    box-shadow: 0rpx 0rpx 10rpx rgb(180, 180, 180);
  }

  .img-bgc {
    color: blue;
  }

  .active {
    background-color: #FFFFFF;
    position: relative;
    display: block;

    &::before {
      position: absolute;
      content: '';
      display: block;
      width: 3px;
      height: 30px;
      background-color: #C00000;
      top: 50%;
      right: 7%;
      transform: translate(0%, -50%);
    }
  }

  .container {
    width: 90%;
    margin: 30rpx auto;

    .shop-container {
      padding: 35rpx;
      @extend %box-shadows;

      .shop-info {
        display: flex;
        justify-content: space-between;

        .name-time {

          .name {
            font-size: 50rpx;
            margin-bottom: 5rpx
          }

          .time {
            @extend %littleText;
            color: rgb(52, 52, 52);
            margin-bottom: 10rpx
          }
        }

        .shop-img {
          width: 110rpx;
          height: 100rpx;
          overflow: hidden;
          border: 2rpx solid white;
          border-radius: 20rpx;

          .imgs {
            width: 120rpx;
            height: 110rpx;
          }
        }
      }

      .promotion {
        @extend %littleText;
        margin-bottom: 10rpx;
      }

      .activities {
        @extend %littleText;
        color: rgb(52, 52, 52);
      }
    }

    .food-review {
      margin-top: 20rpx;
      padding: 35rpx;
      @extend %box-shadows;

      .change-tag {
        display: flex;
        margin-bottom: 20rpx;

        .change-food {
          width: 50%;
          text-align: center;
          border-right: 2rpx solid black;
        }

        .change-review {
          width: 50%;
          text-align: center;
        }
      }

      .scroll {
        display: flex;
        justify-content: space-around;

        .left-scroll-container {
          .left-scroll {
            .left {
              text-align: center;
              line-height: 120rpx;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 27rpx;
            }
          }
        }


        .right-scroll {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-bottom: 45rpx;

          .title {
            font-size: 32rpx;
            height: 40rpx;
            width: 100rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            margin: {
              bottom: 25rpx;
              left: 10rpx;
            }

          }

          .right {
            display: flex;
            margin-bottom: 10rpx;
            height: 180rpx;
            position: relative;

            .img-box {}

            .sale-info {
              margin-left: 10rpx;
              max-width: 45%;

              .name-desc {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

                .name {
                  font-size: 30rpx;
                }

                .desc {
                  @extend %littleText;
                }
              }

              .sale {
                font-size: 23rpx;
                color: rgb(52, 52, 52);
              }

              .price-cart {
                display: flex;
                font-size: 28rpx;
                margin: 10rpx 0rpx;

                .price {
                  position: absolute;
                  bottom: 20rpx;
                }

                .cart {
                  position: absolute;
                  right: 30rpx;
                  bottom: 15rpx;
                }
              }
            }
          }
        }
      }

      .shop-cart {
        width: 90%;
        position: fixed;
        bottom: 0;
        left: 5%;
        background-color: white;


        .haveFood {
          .nav {}

          .curFood {
            display: flex;
            height: 120rpx;

            .curfood-info {
              .price-num {
                display: flex;

                .change-num {
                  display: flex;

                  .reduce-num {
                    display: flex;

                    .num {
                      width: 40rpx;
                      text-align: center;
                    }
                  }
                }

                .price {
                  margin-top: 20rpx;
                }

                .food-num {
                  position: absolute;
                  right: 65.7rpx;
                  margin-top: 20rpx;
                }
              }
            }
          }
        }

        .noFood {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;

          .cart-info {
            display: flex;
            margin-left: 5%;
          }

          .go-order {
            margin-right: 2%;
            overflow: hidden;

            .button {
              background-color: rgb(3, 181, 253);
              width: 200rpx;
              border-radius: 50rpx;
              color: white;
              font-size: 30rpx;
            }
          }
        }
      }

      .review {
        .review-container {
          .rating-info {
            display: flex;
            justify-content: space-between;

            .rating {
              margin-top: 7rpx
            }

            .scores {
              margin-left: 10rpx;

              .promotion {
                @extend %littleText;
                font-size: 22rpx;
              }
            }

            .scores2 {
              display: flex;

              .promotion {
                @extend %littleText;
                margin-right: 20rpx;
              }
            }
          }
        }

        .tag {
          display: flex;
          flex-wrap: wrap;

          .tag-color {
            background-color: rgb(3, 181, 253);
          }

          .tag-info {
            @extend %box-shadows;
            display: flex;
            padding: 10rpx;
            margin: 7rpx;
          }
        }

        .user-review {
          margin-top: 40rpx;

          .user-container {
            display: flex;

            .user-img {
              margin-right: 15rpx;
            }
          }
        }
      }
    }
  }
</style>