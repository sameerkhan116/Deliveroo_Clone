<template>
  <section class="container">
    <div>
      <h1 class="mt-2">Dishes</h1>
      <div class="row">
        <div class="col-md-8">
          <div class="card-columns">
            <div class="card" v-for="dish in dishes" :key="dish.id">
              <img :src="dish.image.url" alt="Card image cap" class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">{{ dish.name }}</h5>
                <p class="card-text">{{ dish.description }}</p>
                <p class="card-text">${{ dish.price }}</p>
                <button class="btn btn-primary" @click="addToCard(dish)">Add to card</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Card</h4>
              <p class="card-text">{{ numberOfItems }} items selected: </p>
              <ul>
                <li class="card-text mb-2" v-for="dish in selectedDishes" :key="dish.id">
                  Name: {{ dish.name }} (${{ dish.price }}) ({{ dish.quantity }})
                  <button class="btn btn-sm btn-success" @click="addToCard(dish)">+</button>
                  <button class="btn btn-sm btn-warning ml-2" @click="removeFromCard(dish)">-</button>
                </li>
              </ul>
            </div>
            <h5 class="card-text">
              Total: ${{ price }}
            </h5>
            <p v-if="!selectedDishes.length">Please select some items.</p>
            <button :disabled="!selectedDishes.length" class="btn btn-primary" @click="goToCheckout">Order</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Strapi from 'strapi-sdk-javascript/build/main';
import { mapMutations } from 'vuex';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

export default {
  data() {
    return {
      complete: false
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    dishes() {
      return this.$store.getters['dishes/list'];
    },
    selectedDishes() {
      return this.$store.getters['card/items'];
    },
    price() {
      return this.$store.getters['card/price'];
    },
    numberOfItems() {
      return this.$store.getters['card/numberOfItems'];
    }
  },
  async fetch({ store, params }) {
    store.commit('dishes/emptyList');
    const response = await strapi.request('post', '/graphql', {
      data: {
        query: `
          {
            restaurant(id: "${params.id}") {
              _id
              name
              dishes {
                _id
                name
                description
                price
                image {
                  url
                }
              }
            }
          }
        `
      }
    });
    
    response.data.restaurant.dishes.forEach(dish => {
      dish.image.url = `${apiUrl}${dish.image.url}`;
      store.commit('dishes/add', {
        id: dish.id || dish._id,
        ...dish
      });
    });
  },
  methods: {
    ...mapMutations({
      addToCard: 'card/add',
      removeFromCard: 'card/remove',
      emptyCard: 'card/emptyList'
    }),
    goToCheckout() {
      const isConnected = this.$store.getters['auth/username'];
      if(!isConnected) {
        this.$router.push('/signin');
        return;
      }
      this.$router.push('/checkout');
    }
  }
};
</script>
