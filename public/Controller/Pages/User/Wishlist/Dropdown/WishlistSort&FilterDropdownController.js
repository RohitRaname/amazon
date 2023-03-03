import WishlistSortFilterDropdownView from "../../../../../View/Pages/User/Wishlist/Dropdown/WishlistSort&FilterDropdownView.js";
import { renderWindow } from "../PageController.js";
let View;
const component =  document.querySelector(
    '.positionel[data-positionel-name="wishlist-filter-&-sort-dropdown"]'
  );


const controlComponent = (action,data)=>{
    if(action==="render-filter-docs-in-window") renderWindow(data.window,data.docs)
}

  if(component){
      View= new WishlistSortFilterDropdownView();
      View.add_handler_el(controlComponent)
    }