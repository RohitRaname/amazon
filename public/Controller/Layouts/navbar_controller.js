import navbar_view from '../../View/Layouts/navbar_view.js';


const navbar = document.querySelector('.nav');

const control_nav = (action) => {
 
};




if (navbar) {
  const view = new navbar_view();
  view.add_handler_nav(control_nav);
}
