import { createStore } from "vuex";
import meals from "./modules/meals";
import reviews from "./modules/reviews";
import mealFilter from "./modules/mealFilter";

export default createStore({
  modules: {
    meals,
    mealFilter,
    reviews,
  },
});
