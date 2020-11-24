let RenderElement = null;
let CheckoutButtonElement = null;
//重新產生畫面
function RenderTable(Element, CheckoutButton = null) {
    RenderElement = Element;
    if (CheckoutButton) CheckoutButtonElement = CheckoutButton;
    let CartTableString = '';
    const Carts = GetCartsStorage();
    CartTableString += '<div class="cart-layout">';
    if (Carts.length > 0) {
        for (let i = 0; i < Carts.length; i++) {
            const Cart = Carts[i];
            CartTableString += '<div class="cart-table">';
            CartTableString += '    <div class="caption">' + Cart.Name + '</div>';
            CartTableString += '    <div class="thead">';
            CartTableString += '        <div class="tr">';
            CartTableString += '            <div class="th ckb"><label class="select-all-cart"><input type="checkbox" name="select-all" onclick="SelectCart(this)"/></label></div>';
            CartTableString += '            <div class="th number">No.</div>';
            CartTableString += '            <div class="th img"></div>';
            CartTableString += '            <div class="th name">商品名稱</div>';
            CartTableString += '            <div class="th price">單價</div>';
            CartTableString += '            <div class="th quantity">數量</div>';
            CartTableString += '            <div class="th sub-total">小計</div>';
            CartTableString += '            <div class="th function"></div>';
            CartTableString += '        </div>';
            CartTableString += '    </div>';
            CartTableString += '    <div class="tbody">';
            for (let j = 0; j < Cart.Commodities.length; j++) {
                const Commodity = Cart.Commodities[j];
                CartTableString += '        <div class="tr">';
                if (Commodity.Select) {
                    CartTableString += '            <div class="th ckb"><input type="checkbox" name="commodity-select" onchange="SelectCheckbox(this)" value="" checked/></div>';
                } else {
                    CartTableString += '            <div class="th ckb"><input type="checkbox" name="commodity-select" onchange="SelectCheckbox(this)"/></div>';
                }
                CartTableString += '            <div class="td number">' + (j + 1) + '</div>';
                CartTableString += '            <div class="td img"><img src="images/article-5bd182cf13ebb.jpg"></div>';
                CartTableString += '            <div class="td name">' + Commodity.Name + '</div>';
                CartTableString += '            <div class="td price">$ ' + Commodity.Price + '</div>';
                CartTableString += '            <div class="td quantity"><button type="button" onclick="AddQuantity(this)">+</button><input type="number" name="quantity" step="1" min="0" value="' + Commodity.Quantity + '" onchange="SetQuantity(this)" onkeyup="SetQuantity(this)"/><button type="button" onclick="LessQuantity(this)">-</button></div>';
                CartTableString += '            <div class="td sub-total"></div>';
                CartTableString += '            <div class="td function">';
                CartTableString += '                <input type="hidden" name="cart-id" value="' + Cart.ID + '" />';
                CartTableString += '                <input type="hidden" name="commodity-id" value="' + Commodity.ID + '" />';
                CartTableString += '                <button type="button" onclick="DeleteCommodity(this)">刪除</button>';
                CartTableString += '            </div>';
                CartTableString += '        </div>';
            }

            CartTableString += '    </div>';
            CartTableString += '    <div class="tfoot">';
            CartTableString += '        <div class="tr">';
            CartTableString += '            <div class="td title">合計</div>';
            CartTableString += '            <div class="td cart-total"></div>';
            CartTableString += '        </div>';
            CartTableString += '    </div>';
            CartTableString += '</div>';
        }
    } else {
        CartTableString += '<h1 class="message">沒有任何商品在購物車！</h1>';
    }
    CartTableString += '<div class="total">';
    CartTableString += '    <div><label><input type="checkbox" onchange="SelectAllCarts(this)"/>選取所有商品</label></div>';
    CartTableString += '    <div>總計</div>';
    CartTableString += '    <div></div>';
    CartTableString += '</div>';
    CartTableString += '<div>';
    $(RenderElement).html(CartTableString);
    CalcTotal();
    $('.cart-table .caption').click(function (evt) {
        $(evt.target).next('.thead').toggle();
        $(evt.target).next('.thead').next('.tbody').toggle();
    });
    $('.cart-table>.tbody>.tr').click(SelectCommodity);
    if (CheckoutButtonElement) {
        if (CartIsEmpty()) {
            $(CheckoutButtonElement).hide();
        } else {
            $(CheckoutButtonElement).show();
        }
    }
}
//-----Events-----
//增加數量
function AddQuantity(element) {
    const CommodityInfo = GetCommodityInfo(element);
    let quantity = CommodityInfo.Quantity;
    quantity++;
    CommodityInfo.QuantityElement.val(quantity);
    UpdateCartStorageQuantity(CommodityInfo.CartID, CommodityInfo.CommodityID, quantity);
}
//減少數量
function LessQuantity(element) {
    const CommodityInfo = GetCommodityInfo(element);
    let quantity = CommodityInfo.Quantity;
    if (quantity > 1) {
        quantity--;
        CommodityInfo.QuantityElement.val(quantity);
        UpdateCartStorageQuantity(CommodityInfo.CartID, CommodityInfo.CommodityID, quantity);
    }
}
//選擇商品
function SelectCommodity(evt) {
    if (evt.target.tagName == 'DIV'
        || evt.target.tagName == 'IMG') {
        let CommodityInfo = GetCommodityInfo(evt.target);
        $(evt.target).parents('.cart-table').find('[name="select-all"]').prop('checked', false);
        if (CommodityInfo.Select == true) {
            CommodityInfo.SelectElement.prop('checked', false);
            CommodityInfo.TrElement.removeClass('select');
            UpdateCartStorageSelect(CommodityInfo.CartID, CommodityInfo.CommodityID, false);
        } else {
            CommodityInfo.SelectElement.prop('checked', true);
            CommodityInfo.TrElement.addClass('select');
            UpdateCartStorageSelect(CommodityInfo.CartID, CommodityInfo.CommodityID, true);
        }
    }
}
//設定數量
function SetQuantity(element) {
    const CommodityInfo = GetCommodityInfo(element);
    let quantity = parseInt($(element).val());
    if (quantity <= 1) {
        $(element).val(1);
        quantity = 1;
    }
    UpdateCartStorageQuantity(CommodityInfo.CartID, CommodityInfo.CommodityID, quantity);
}
//刪除商品
function DeleteCommodity(element) {
    const CommodityIfo = GetCommodityInfo(element);
    let confirmResult = confirm('商品:' + CommodityIfo.CommodityName + '\r\n數量:' + CommodityIfo.Quantity + '\r\n確定要刪除這筆商品？');
    if (confirmResult) DeleteCommodityStorage(CommodityIfo.CartID, CommodityIfo.CommodityID);
    RenderTable(RenderElement);
}
//放入商品到購物車
function PutCart(CartID, CartName, CommodityID, CommodityName, Price, Quantity = 1) {
    if (!CartID || !CartName || !CommodityID || !CommodityName) {
        alert('無法放入購物車');
        return;
    }
    const IsExist = CommodityIsExist(CartID, CommodityID);
    if (IsExist) {
        alert('無法放入購物車，商品已放入購物車');
        return
    }
    let Carts = GetCartsStorage();
    let IsEdit = false;
    let findCart = Carts.filter((Cart) => Cart.ID == CartID);
    if (!findCart.length) {
        let Cart = {
            ID: CartID,
            Name: CartName,
            Commodities: [
                {
                    ID: CommodityID,
                    Name: CommodityName,
                    Price: Price,
                    Quantity: Quantity,
                    Select: false
                }
            ]
        }
        Carts.push(Cart);
        IsEdit = true;
    } else {
        let Cart = findCart[0];
        let Commodity = {
            ID: CommodityID,
            Name: CommodityName,
            Price: Price,
            Quantity: Quantity,
            Select: false
        }
        Cart.Commodities.push(Commodity);
        IsEdit = true;
    }
    if (IsEdit) {
        SetCartsStorage(Carts);
        alert('已放入購物車');
        if (RenderElement) {
            RenderTable(RenderElement);
        }
    }
}
//購物車全選
function SelectCart(element) {
    let Carts = GetCartsStorage();
    const IsChecked = $(element).prop('checked');
    let CartElement = $(element).parents('.cart-table');
    const CartId = $(CartElement).find('input[name="cart-id"]').val();
    let findCarts = Carts.filter((Cart) => Cart.ID == CartId);
    if (findCarts.length) {
        let Cart = findCarts[0];
        Cart.Commodities.forEach((Commodity, iCommodity) => {
            let TrTag = $($(CartElement).find('.tbody>.tr')[iCommodity]);
            if (IsChecked) {
                $(TrTag).addClass('select');
                $(TrTag).find('input[name="commodity-select"]').prop('checked', true);
                Commodity.Select = true;
            } else {
                $(TrTag).removeClass('select');
                $(TrTag).find('input[name="commodity-select"]').prop('checked', false);
                Commodity.Select = false;
            }

        });
        SetCartsStorage(Carts);
    }
}
//選擇核取方塊
function SelectCheckbox(element){
    let IsChecked = $(element).prop('checked');
    let CommodityInfo = GetCommodityInfo(element);
        $(element).parents('.cart-table').find('[name="select-all"]').prop('checked', false);
        if (IsChecked) {
            CommodityInfo.TrElement.addClass('select');
            UpdateCartStorageSelect(CommodityInfo.CartID, CommodityInfo.CommodityID, true);
        } else {
            CommodityInfo.TrElement.removeClass('select');
            UpdateCartStorageSelect(CommodityInfo.CartID, CommodityInfo.CommodityID, false);
        }
}
//選擇所有購物車的商品
function SelectAllCarts(element){
    let IsChecked = $(element).prop('checked');
    $('.cart-layout .cart-table').each(function(){
        let CartElement = this;
        $(CartElement).find('[name="select-all"]').prop('checked',IsChecked);
        $(CartElement).find('.tbody>.tr').each(function(){
            let TrTag = this;
            let CommodityInfo = GetCommodityInfo(TrTag);
            if(IsChecked){
                $(TrTag).addClass('select');
                $(TrTag).find('input[name="commodity-select"]').prop('checked', true);
                UpdateCartStorageSelect(CommodityInfo.CartID, CommodityInfo.CommodityID, true);
            }else{
                $(TrTag).removeClass('select');
                $(TrTag).find('input[name="commodity-select"]').prop('checked', false);
                UpdateCartStorageSelect(CommodityInfo.CartID, CommodityInfo.CommodityID, false);
            }
        });
    });
}
//-----/Events-----
//-----Methods-----
function CartIsEmpty() {
    let Carts = GetCartsStorage();
    if (Carts.length) {
        return false;
    } else {
        return true;
    }
}
//取得目前商品
function GetCommodityInfo(element) {
    let tagTr = null;
    if ($(element).hasClass('tr')) {
        tagTr = element;
    } else {
        tagTr = $(element).parents('.tr');
    }
    let Commodity = GetCommodityStorage($(tagTr).find('input[name="cart-id"]').val(), $(tagTr).find('input[name="commodity-id"]').val());
    return {
        TrElement: tagTr,
        QuantityElement: $(tagTr).find('input[name="quantity"]'),
        SelectElement: $(tagTr).find('input[name="commodity-select"]'),

        CartID: $(tagTr).find('input[name="cart-id"]').val(),
        CommodityID: $(tagTr).find('input[name="commodity-id"]').val(),
        Quantity: parseInt($(tagTr).find('input[name="quantity"]').val()),
        Select: $(tagTr).find('input[name="commodity-select"]').prop('checked'),
        CommodityName: Commodity.Name
    }
}
//取得商品資料
function GetCommodityStorage(CartId, CommodityId) {
    CartId = parseInt(CartId);
    CommodityId = parseInt(CommodityId);
    let Carts = GetCartsStorage();
    let findCommodity = null;
    Carts.forEach((Cart) => {
        if (Cart.ID == CartId) {
            Cart.Commodities.forEach((Commodity) => {
                if (Commodity.ID == CommodityId) {
                    findCommodity = Commodity;
                }
            });
        }
    });
    return findCommodity;
}
//取得購物車資料
function GetCartsStorage() {
    if (localStorage.getItem("CartsStorage")) {
        const jsonString = localStorage.getItem("CartsStorage");
        return JSON.parse(jsonString);
    } else {
        return [];
    }
}
//設定購物車資料
function SetCartsStorage(obj) {
    const jsonString = JSON.stringify(obj);
    localStorage.setItem("CartsStorage", jsonString);
    if (RenderElement) {
        CalcTotal();
    }
}
//更新購物車數量資料
function UpdateCartStorageQuantity(CartId, CommodityId, Quantity) {
    let CommodityObj = {
        Quantity: Quantity
    }
    UpdateCartStorage(CartId, CommodityId, CommodityObj)
}
//更新商品選擇資料
function UpdateCartStorageSelect(CartId, CommodityId, Select) {
    let CommodityObj = {
        Select: Select
    }
    UpdateCartStorage(CartId, CommodityId, CommodityObj);
}
//更新購物車資料
function UpdateCartStorage(CartId, CommodityId, obj) {
    let Carts = GetCartsStorage();
    let IsEdit = false;
    Carts.forEach((Cart) => {
        if (Cart.ID == CartId) {
            Cart.Commodities.forEach((Commodity) => {
                if (Commodity.ID == CommodityId) {
                    IsEdit = true;
                    if (obj.Quantity) Commodity.Quantity = obj.Quantity;
                    if (obj.Select != undefined) Commodity.Select = obj.Select;
                }
            });
        }
    });
    if (IsEdit) {
        SetCartsStorage(Carts);
    }
}
//刪除商品資料
function DeleteCommodityStorage(CartId, CommodityId) {
    let Carts = GetCartsStorage();
    Carts.forEach((Cart, iCart) => {
        if (Cart.ID == CartId) {
            Cart.Commodities.forEach((Commodity, iCommodity) => {
                if (Commodity.ID == CommodityId) {
                    Cart.Commodities.splice(iCommodity, 1);
                    if (Cart.Commodities.length == 0) {
                        Carts.splice(iCart, 1);
                    }
                }
            });
        }
    });
    SetCartsStorage(Carts);
}
//計算總計
function CalcTotal() {
    let Carts = GetCartsStorage();
    let Total = 0;
    let CartTotal = 0;
    let SubTotal = 0;
    Carts.forEach((Cart, iCart) => {
        const CartElement = $(RenderElement).find('div.cart-table')[iCart];
        CartTotal = 0;
        Cart.Commodities.forEach((Commodity, iCommodity) => {
            const CommodityElement = $(CartElement).find('.tbody>.tr')[iCommodity];
            SubTotal = Commodity.Price * Commodity.Quantity;
            CartTotal += SubTotal;
            $(CommodityElement).children('.td.sub-total').html('$ ' + parseInt(SubTotal));
        });
        Total += CartTotal;
        $($(CartElement).find('.tfoot>.tr>.td')[1]).html('$ ' + parseInt(CartTotal));
    });
    $($(RenderElement).find('div.total>div')[1]).html('$ ' + parseInt(Total));
}
//加入千分位
function toCurrency(num) {
    var parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$ ' + parts.join('.');
}
//確認商品是否已經在購物車內
function CommodityIsExist(CartID, CommodityID) {
    if (!CartID || !CommodityID) {
        return false;
    }
    let Carts = GetCartsStorage();
    let findCart = Carts.filter((Cart) => Cart.ID == CartID);
    if (!findCart.length) {
        return false
    } else {
        let Cart = findCart[0];
        let findCommodity = Cart.Commodities.filter((Commodity) => Commodity.ID == CommodityID);
        if (findCommodity.length) {
            return true;
        }
    }
}
//-----/Methods-----
//測試用，不用把它拿掉
function SetTestData() {
    let Carts = [
        {
            ID: 1,
            Name: '斯貝寵物平台',
            Commodities: [
                {
                    ID: 10,
                    Name: 'Nutram紐頓 - T22無穀挑嘴全齡貓(火雞+雞肉)',
                    Price: 599,
                    Quantity: 10,
                    Select: false
                },
                {
                    ID: 11,
                    Name: '日本TK舒適8字腹帶(中型犬)',
                    Price: 180,
                    Quantity: 5,
                    Select: true
                }
            ]
        },
        {
            ID: 2,
            Name: '哈瑪星寵物商店',
            Commodities: [
                {
                    ID: 20,
                    Name: 'Qoopet 玩樂互動耐咬潔牙棉繩',
                    Price: 1699,
                    Quantity: 1,
                    Select: false
                }
            ]
        }
    ];
    SetCartsStorage(Carts);
}
