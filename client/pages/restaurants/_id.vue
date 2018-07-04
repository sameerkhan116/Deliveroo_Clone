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
                <button class="btn btn-primary">Add to card</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Card</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Strapi from 'strapi-sdk-javascript/build/main';

const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

export default {
  computed: {
    id() {
      return this.$route.params.id;
    },
    dishes() {
      return this.$store.getters['dishes/list'];
    },
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
};
</script>
