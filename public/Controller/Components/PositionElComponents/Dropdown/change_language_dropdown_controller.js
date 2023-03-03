import ChangeLanguageHoverCardView from "../../../../View/Components/Dropdown/change_language_dropdown_view.js";

const change_language_hovercard = document.querySelector(
  '.dropdown[data-positionel-name="choose-language"]'
);

let View;

export const render_hovercard = (data_arr) =>
  View.render_and_show_position_el(data_arr);

export const show_change_language_hovercard = () => View.show();


const control_change_language_hovercard = (action, data) => {
  console.log(action, data);
};

if (change_language_hovercard) {
  View = new ChangeLanguageHoverCardView();
  View.add_handler_el(control_change_language_hovercard);
}
