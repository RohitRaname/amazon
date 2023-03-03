const data = {
  title: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, min: 0 },
  category: 'SmartPhones & Basic Mobiles',

    color: String,
    color_img: String,
    size: String,

  variants: {
    colors: [{ name: String, color: String, product_img: String }],
    sizes: [{ name: String, value: String }],
  },
  asset: {
    thumbnail: String,
    product_imgs: [String],
    spec_imgs: [String],
  },
  stock: 1000,
  attributes: [{ name: String, value: String }],

  technical_specs: [{ name: String, value: String }],

  // iphone,iphone plus,iphone pro,iphone pro max
  comparison_with_upgrade_variants: [{ name: String, value: String }],
};

data.title = document.querySelector('#productTitle').textContent.trim();
data.name = data.title.split(' ').slice(0, 3).join(' ');

data.description = [
  ...document.querySelector('#feature-bullets').querySelectorAll('li'),
].map((el) => el.querySelector('span').textContent.trim());

data.price = {
  unit: '$',
  value: Math.round(
    Number(
      document
        .querySelector('.a-price-whole')
        .textContent.slice(0, -1)
        .split(',')
        .join('')
    ) / 70
  ),
};

data.attributes = [
  ...document
    .querySelector('#productOverview_feature_div')
    .querySelectorAll('tr'),
].map((el) => {
  const two_span = [...el.querySelectorAll('span')];
  const obj = { name: null, value: null };
  obj.name = two_span[0].textContent
    .toLocaleLowerCase()
    .split(' ')
    .join('_')
    .trim()
    .toLocaleLowerCase();
  obj.value = two_span[1].textContent.trim();
  return obj;
});
data.attributes.push({
  name: 'color',
  value: document
    .querySelector('#variation_color_name')
    .querySelector('span')
    .textContent.toLowerCase(),
});

// needed fields
data.color=document
.querySelector('#variation_color_name')
.querySelector('span')
.textContent.toLowerCase()
data.size=document.querySelector('#variation_size_name').querySelector('span')
.textContent

data.attributes.push({
  name: 'size',
  value: document.querySelector('#variation_size_name').querySelector('span')
    .textContent,
});

data.variants = {
  colors: [
    ...document.querySelector('#variation_color_name').querySelectorAll('img'),
  ].map((el) => {
    const obj = {};
    obj.color_img = el.src;
    obj.color = el.alt.toLowerCase();
    obj.product_img = document
      .querySelector('[data-csa-c-action="image-block-main-image-hover"]')
      .querySelector('img').src;
    return obj;
  }),
  sizes: [
    ...document.querySelector('#variation_size_name').querySelectorAll('p'),
  ].map((el) => ({ value: el.textContent, price: data.price.value })),
};

data.asset = {
  thumbnail: document
    .querySelector('[data-csa-c-action="image-block-main-image-hover"]')
    .querySelector('img').src,
  product_imgs: [
    ...document.querySelector('#imageBlock').querySelectorAll('img'),
  ].map((el) => el.src),

  spec_imgs: [...document.querySelectorAll('.content-grid-block')]
    .map((el) => {
      if (el.querySelector('img')) return el.querySelector('img').src;
      else null;
    })
    .filter((el) => el),
};

let screen_height = null;
data.technical_specs = [
  ...document.querySelector('#tech').querySelectorAll('tr'),
].map((el) => {
  const obj = { name: null, value: null };
  const prop_and_value_el = [...el.querySelectorAll('p')];

  obj.name = prop_and_value_el[0].textContent
    .toLocaleLowerCase()
    .trim()
    .split(' ')
    .join('_');

  if (['width', 'depth', 'weight'].includes(obj.name))
    obj.value = prop_and_value_el[1].textContent
      .split('(')
      .slice(0, -1)[0]
      .trim();
  else obj.value = prop_and_value_el[1].textContent.trim();

  if (obj.name === 'display') screen_height = obj.value.split(' ')[0].trim();

  return obj;
});
if (data.category === 'SmartPhones & Basic Mobiles')
  data.technical_specs.push({ name: 'screen_height', value: screen_height });

data.technical_specs.push();

data.comparison_with_upgrade_variants = [
  ...document.querySelector('#compare').querySelectorAll('tr'),
].map((el) => {
  // const arr=[{name:null,values:null}]
  const els = [...el.querySelectorAll('td')];

  const obj = { name: null, values: [] };
  obj.name = els[0].querySelector('span')
    ? els[0].querySelector('span').textContent
    : 'image';
  obj.name = obj.name.toLocaleLowerCase().trim();

  if (obj.name === 'image') {
    els
      .slice(1)
      .forEach((img_el) =>
        obj.values.push(
          `${img_el.querySelector('img').alt},${
            img_el.querySelector('img').src
          }`
        )
      );
  } else if (obj.name === 'ratings') {
    obj.name = 'ratings';
    obj.values = new Array(els.slice(1).length).fill(0);
  } else if (obj.name === 'price') {
    els
      .slice(1)
      .forEach((span_el) =>
        obj.values.push(
          Math.round(
            Number(
              span_el
                .querySelector('span')
                .textContent.trim()
                .split(': ')[1]
                .slice(1)
                .replace(/,/g, '')
            ) / 70
          )
        )
      );
  } else {
    els
      .slice(1)
      .forEach((span_el) =>
        obj.values.push(span_el.querySelector('span').textContent.trim())
      );
  }

  return obj;
});
