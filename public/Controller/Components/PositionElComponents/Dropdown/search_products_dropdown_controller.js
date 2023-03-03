import Search_product_dropdown_view from '../../../../View/Components/Dropdown/search_products_dropdown_view.js';

const search_dropdown = document.querySelector(
  '.dropdown[data-positionel-name="search-products"]'
);

let View;

export const render_dropdown = (data_arr) =>
  View.render_and_show_position_el(data_arr);

export const show_search_dropdown = () => View.show();


const control_search_dropdown = (action, data) => {
  console.log(action, data);
};

if (search_dropdown) {
  View = new Search_product_dropdown_view();
  View.add_handler_el(control_search_dropdown);
}
