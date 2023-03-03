import FilterOrdersByTimeFrameDropdownView from '../../../../../View/Pages/Shopping/myOrders/dropdown/filterOrdersByTimeFrameDropdown.js';
import { renderFilterOrdersByDate } from '../modal/myOrderModalController.js';

let View;

const component = document.querySelector(
  '.positionel[data-positionel-name="filter-orders-by-timeframe"]'
);
// render filtered Productmenu items

const controlComponent = (action, data) => {
  if(action==="set-orders-timeframe-query-in-order-modal") renderFilterOrdersByDate(data)


};



if (component) {
  View = new FilterOrdersByTimeFrameDropdownView();
  View.add_handler_el(controlComponent);
}
