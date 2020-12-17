let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = function(el){
    return document.querySelector(el);
}
const cs =  function(el) {
    return document.querySelectorAll(el);
}
//target seleciona o proprio item que vc clica 
//.map para mapear o array.json
pizzaJson.map(function(item, index){
   
     let pizzaItem = c ('.models .pizza-item').cloneNode(true);
    //prencher info pizaaitem

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = 'R$'+' '+item.price.toFixed(2);
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', function (e) {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = 'R$'+' '+pizzaJson[key].price.toFixed(2);

        c('.pizzaInfo--size.selected').classList.remove('selected')
                                            //item, e seleção acessa a info,quando algo é padrão
        cs('.pizzaInfo--size').forEach(function(sizezinho, sizindex) {
            if(sizindex == 2) {
                sizezinho.classList.add('selected');
            } 
            sizezinho.querySelector('span').innerHTML =  pizzaJson[key].sizes[sizindex];
        })

        c('.pizzaInfo--qt').innerHTML = modalQt;

        console.log(pizzaJson[key]);
        
        //MODAL WINDOW
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(function() {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 80);
      
    });
   c ('.pizza-area').append(pizzaItem);
});

//Events Modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(function() {
        c('.pizzaWindowArea').style.display = 'none';
    }, 400)   
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(function(item) {
    item.addEventListener('click', closeModal);
});
c('.pizzaInfo--qtmenos').addEventListener('click',function (aa) {
    if(modalQt > 1) { 
    modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click',function (bb) {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach(function(sizezinho, sizindex) {
    sizezinho.addEventListener('click', function(cc){
        c('.pizzaInfo--size.selected').classList.remove('selected')
        sizezinho.classList.add('selected');
    })
})
c('.pizzaInfo--addButton').addEventListener('click', function(dd) {

    //qual tamanho selecionado?
    let sizes = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let ident = pizzaJson[modalKey].id+'@'+sizes;
    let key = cart.findIndex(function(item) {
        return item.ident == ident
    })
    if(key > -1){
        cart[key].qt += modalQt
    }else{
    cart.push({
        ident,
        id:pizzaJson[modalKey].id,
        sizes,
        qt:modalQt
     });
  }
    upCart();
    closeModal(); 
});

c('.menu-openner').addEventListener('click', function() {
    if(cart.length > 0) {
        c('aside').style.left = '0';

    }
});
c('.menu-closer').addEventListener('click', function() {
    c('aside').style.left = '100vw';
})
function upCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
        let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
        subtotal += pizzaItem.price * cart[i].qt;




        let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeNames;
            
            switch(cart[i].sizes) {
                case 0:
                    pizzaSizeNames = 'P';
                    break;
                case 1:
                    pizzaSizeNames = 'M';
                    break;
                case 2:
                    pizzaSizeNames = 'G';
                    break;  
            }
            let pizzaNames = `${pizzaItem.name} ${pizzaSizeNames}`;

           cartItem.querySelector('img').src = pizzaItem.img;
           cartItem.querySelector('.cart--item-nome').innerHTML = pizzaNames;
           cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
           cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', function(ee){
            if(cart[i].qt > 1) {
                cart[i].qt--;
            } else {
                cart.splice(i, 1);
            }
            upCart();
           });
           cartItem.querySelector('.cart--item-qtmais').addEventListener('click', function(ff){
            cart[i].qt++;
            upCart();
           });

        c('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
    }
}

