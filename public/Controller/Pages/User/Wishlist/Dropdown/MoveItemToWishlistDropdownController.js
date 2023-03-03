import MoveItemBwListDropdownView from "../../../../../View/Pages/User/Wishlist/Dropdown/moveItemToListDropdownView.js";
import { moveItemToAnotherWishlist } from "../PageController.js";
let View;
const component = document.querySelector(
    '.positionel[data-positionel-name="move-item-to-list-dropdown"]'
  );


const controlComponent = (action,data)=>{
  if(action==="move-item-to-another-wishlist") moveItemToAnotherWishlist(data)
}

  if(component){
      View= new MoveItemBwListDropdownView();
      View.add_handler_el(controlComponent)
    }