import { get } from '../../api/api.js';

import Search_view from '../../../View/Pages/Common/search_view.js';

// Other
import {
  render_dropdown,
  show_search_dropdown,
} from '../../Components/PositionElComponents/Dropdown/search_products_dropdown_controller.js';

const search_bar = document.querySelector('.search-form');

let View;

const control_search = async (action, product_name) => {
  console.log(action);

  if (action === 'show-search-dropdown') show_search_dropdown();

  if (action === 'show-result-in-search-dropdown') {
    const res = await get(
      `products/search?q=${product_name}`
    );
    console.log(res.data.docs)
    render_dropdown(res.data.docs);
  }
  if (action === 'show-products-in-new-page') console.log(product_name);
};

if (search_bar) {
  View = new Search_view();
  View.add_handler_search(control_search);
}
