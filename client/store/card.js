import Cookies from 'js-cookie';

export const state = () => ({
  items: [],
});

export const mutations = {
  setItems(state, items) {
    state.items = items;
  },
  add(state, item) {
    const record = state.items.find(i => i.id === item.id);
    if (!record) {
      state.items.push({
        quantity: 1,
        ...item,
      });
    } else {
      record.quantity++;
    }
    Cookies.set('card', state.items);
  },
  emptyList(state) {
    state.items = [];
    Cookies.set('card', state.items);
  },
};

export const getters = {
  items: state => state.items,
  price: state =>
    state.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
};
