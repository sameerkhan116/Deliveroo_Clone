'use strict';
const stripe = require('stripe')('sk_test_kfeHEEKTX2dgr4bfWUJ67d6n');

/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */

module.exports = {

  /**
   * Retrieve order records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    return strapi.services.order.fetchAll(ctx.query);
  },

  /**
   * Retrieve a order record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.order.fetch(ctx.params);
  },

  /**
   * Count order records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.order.count(ctx.query);
  },

  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async ctx => {
    const { address, amount, dishes, postalCode, token, city } = ctx.request.body;
  
    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: 'usd',
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
      source: token,
    });
  
    const order = await strapi.services.order.add({
      user: ctx.state.user._id,
      address,
      amount,
      dishes,
      postalCode,
      city,
    });
  
    console.log(charge);
    return order;
  },

  /**
   * Update a/an order record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.order.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an order record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.order.remove(ctx.params);
  }
};
