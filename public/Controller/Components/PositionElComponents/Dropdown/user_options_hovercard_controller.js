import UserOptionsHoverCard from "../../../../View/Components/Dropdown/user_options_dropdown_view.js";

const user_options_hovercard = document.querySelector(
  '.dropdown[data-positionel-name="user-options"]'
);

let View;

export const render_hovercard = (data_arr) =>
  View.render_and_show_position_el(data_arr);

export const show_user_options_hovercard = () => View.show();


const control_user_options_hovercard = (action, data) => {
  console.log(action, data);
};

if (user_options_hovercard) {
  View = new UserOptionsHoverCard();
  View.add_handler_el(control_user_options_hovercard);
}
