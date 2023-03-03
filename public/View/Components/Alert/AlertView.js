import ErrorView from '../../Common/ErrorView.js';

class AlertView extends ErrorView {
  _parentEl = document.querySelector('.alert');

  _generateMarkUp(msg) {
    let title, text;
    if (typeof msg === 'string') title = msg;
    else {
      title = msg.title;
      text = msg.text;
    }
    return ` 
        <div class="alert-container f-sm">
          <i class="fas fa-exclamation-triangle red alert-icon"></i>
            <div>
              <h class="s-7 s-m red alert-title">${title}</h>
              ${
                text
                  ? `
                <p class="alert-message pt-md">
                ${text}
                </p>
                `
                  : ''
              }
            </div>
        </div>
              `;
  }
}

export default AlertView;
