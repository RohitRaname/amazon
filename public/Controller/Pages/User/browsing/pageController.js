import HistoryPageView from "../../../../View/Pages/User/browsing/pageView.js"; 
let View;

const component = document.querySelector(
  '.section-history'
);



const controlComponent = () => {};

if (component) {
  View = new HistoryPageView();
  View.add_handler_el(controlComponent);
}
