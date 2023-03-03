export const RatingIconsHtml = (ratingValue,iconSizeClass)=>{

    const htmlArr=[];
    ratingValue=Number(ratingValue)

    for (  const num of [1, 2, 3, 4, 5]){
        let iconHtml;

        if(ratingValue-num>=0)
        iconHtml=`<i class="fa fa-star ${iconSizeClass}"></i>`
        
        else if( (Math.abs(ratingValue - num) < 1 && Math.abs(ratingValue - num).toString().includes('.5')))   iconHtml=`<i class="fa fa-star-half-o ${iconSizeClass}"></i>`
        
        else  iconHtml=`<i class="fa fa-star-o ${iconSizeClass}"></i>`

        htmlArr.push(iconHtml)
    }

    return htmlArr.join('')
}