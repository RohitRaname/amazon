import ChooseLocationModalView from "../../../../View/Pages/home/modal/chooseLocationModalView.js";;
let View;

const component = document.querySelector(
    '.modal[data-positionel-name="choose-user-location"]'
  );



const controlComponent = () => {};

if (component) {
  View = new ChooseLocationModalView();
  View.add_handler_el(controlComponent);
}
