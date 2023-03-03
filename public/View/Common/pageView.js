export default class PageView{

    _userProfile= document.querySelector('body[data-user]') && JSON.parse(document.querySelector('body').dataset.user)
    _userCurrency= document.querySelector('body[data-user-currency]') && JSON.parse(document.querySelector('body').dataset.userCurrency)
    _userCurrencyRate= this._userCurrency && Number(this._userCurrency.rate)
    _userCurrencySymbol= this._userCurrency && Number(this._userCurrency.symbol)



    _setProductUrl(title, id) {
        return `/${title.split(' ').join('-')}/${id}`;
      }
    renderSectionError(title,message){}
}