import ReviewPageView from '../../../../View/Pages/Review/Review/pageView.js';
import {renderFilterReviewDocs,renderSearchReviews} from "./modal/reviewListModalController.js"
const component = document.querySelector('.section-review');
let View;

const controlComponent = (action,data) => {
  // render filter reviews
  if(action==="filter-queryString") renderFilterReviewDocs(data)

  if(action==="search-reviews") renderSearchReviews(data)

  

};

if (component) {
  View = new ReviewPageView();
  View.add_handler_el(controlComponent);
}
