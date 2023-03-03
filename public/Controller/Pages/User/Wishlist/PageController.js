import WishlistPageView from "../../../../View/Pages/User/Wishlist/PageView.js";
let View;
const component= document.querySelector('.section-wishlist')

export const renderWindow =  (windowName,docs)=> View.render(windowName, docs, true,false) 

export const moveItemToAnotherWishlist=(data)=>View.moveItemToAnotherWishlist(data) 

const controlComponent= ()=>{

}

if(component){
    View= new WishlistPageView();
    View.add_handler_el(controlComponent);
}

