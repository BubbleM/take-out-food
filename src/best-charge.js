/*
 * 拆分数据
 * @param "ITEM0001 x 1"
 * 返回一个对象　{id: 'ITEM001', count: 1}
 * */
function splitItem(item) {
  let obj = {};
  obj.id = item.split(' x ')[0]; 
  obj.count = item.split(' x ')[1] - 0;
  return obj;
}

/*
 * 根据id在loadAllItems中查找菜品的详细信息
 * @param id
 * 返回当前菜品对象
 * */
function findItem(id) {
  let allItems = loadAllItems();
  for (let item of allItems) {
    if (item.id === id) {
      return item;
    }
  }
  return null;
}

/*
* 格式化输入
* @param inputs
* [{
 id: 'ITEM0001',
 count: 1,
 name: '黄焖鸡',
 price: 18.00,
 total: 18
 }
* */
function formatInput(inputs) {
  var inputsArr = [];
  inputs.forEach(item => {
    let itemInfo = splitItem(item);
    let itemInfos = findItem(itemInfo.id);
    itemInfo.name = itemInfos.name;
    itemInfo.price = itemInfos.price;
    itemInfo.total = itemInfo.count * itemInfo.price;
    inputsArr.push(itemInfo);
  })
  return inputsArr;
}

/*
* 根据给定id查看是否享受"指定商品半价"
* {items:['黄焖鸡','肉夹馍'], save:16}
* */
function itemInList(inputsArr) {
  let onSale = {items: [], save: 0};
  let discounts = loadPromotions()[1];
  for (let item of inputsArr) {
    if(discounts.items.includes(item.id)){
      onSale.items.push(item.name);
      onSale.save += Math.floor(item.price / 2);
    }
  }
  return onSale;
}

/*
* 计算总价　
* */
function totalPrices(arr) {
  let totalPrice = 0;
  arr.forEach(item => {
    totalPrice += item.total;
  })
  return totalPrice;
}

function bestCharge(selectedItems) {
  let inputsArr = formatInput(selectedItems);
  let totalPrice = totalPrices(inputsArr);
  let full30Save = 0;
  if (totalPrice > 30) full30Save = 6;
  let halfPrice = itemInList(inputsArr);

  let str = '============= 订餐明细 =============';
  inputsArr.forEach(item => {
    str += '\n' + item.name + ' x ' + item.count + ' = ' + item.total + '元';
  });
  str += '\n-----------------------------------\n';
  if (full30Save > 0 && full30Save >= halfPrice.save) {
    str += '使用优惠:\n满30减6元，省'+ full30Save +'元\n-----------------------------------\n总计：'+ (totalPrice-full30Save) +'元\n';
  } else if(halfPrice.items.length !== 0){
    str += '使用优惠:\n指定菜品半价(';
    for(let i = 0; i < halfPrice.items.length - 1; i++) {
      str += halfPrice.items[i] + '，'
    }
    str += halfPrice.items[halfPrice.items.length - 1];
    str += ')，省'+ halfPrice.save +'元\n' + '-----------------------------------\n总计：'+ (totalPrice - halfPrice.save)+'元\n';
  } else {
    str += '总计：'+totalPrice+'元\n';
  }
  str += '===================================';
  return str;
}

