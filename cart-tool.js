let RenderElement = null;
//重新產生畫面
function RenderTable(Element) {
    RenderElement = Element;
    let CartTableString = '';
    const Carts = GetCartsStorage();
    CartTableString += '<div class="cart-layout">';
    if (Carts.length > 0) {
        for (let i = 0; i < Carts.length; i++) {
            const Cart = Carts[i];
            CartTableString += '<table class="cart-table">';
            CartTableString += '    <caption><input type="checkbox" onchange="SelectCart(this)"/>' + Cart.Name + '</caption>';
            CartTableString += '    <thead>';
            CartTableString += '        <tr>';
            CartTableString += '            <th></th>';
            CartTableString += '            <th>No.</th>';
            CartTableString += '            <th></th>';
            CartTableString += '            <th>商品名稱</th>';
            CartTableString += '            <th>單價</th>';
            CartTableString += '            <th>數量</th>';
            CartTableString += '            <th></th>';
            CartTableString += '            <th class="cart-total">小計</th>';
            CartTableString += '        </tr>';
            CartTableString += '    </thead>';
            CartTableString += '    <tbody>';
            for (let j = 0; j < Cart.Commodities.length; j++) {
                const Commodity = Cart.Commodities[j];
                if (Commodity.Select) {
                    CartTableString += '        <tr class="select">';
                } else {
                    CartTableString += '        <tr>';
                }
                if (Commodity.Select) {
                    CartTableString += '            <td><input type="checkbox" name="commodity-select" checked/></td>';
                } else {
                    CartTableString += '            <td><input type="checkbox" name="commodity-select"/></td>';
                }
                CartTableString += '            <td>' + (j + 1) + '</td>';
                CartTableString += '            <td><img src="images/article-5bd182cf13ebb.jpg"></td>';
                CartTableString += '            <td>' + Commodity.Name + '</td>';
                CartTableString += '            <td>$ ' + Commodity.Price + '</td>';
                CartTableString += '            <td>';
                CartTableString += '                <input type="number" name="quantity" step="1" min="0" value="' + Commodity.Quantity + '" onchange="SetQuantity(this)" onkeyup="SetQuantity(this)" />';
                CartTableString += '            </td>';
                CartTableString += '            <td>';
                CartTableString += '                <input type="hidden" name="cart-id" value="' + Cart.ID + '" />';
                CartTableString += '                <input type="hidden" name="commodity-id" value="' + Commodity.ID + '" />';
                CartTableString += '                <div class="btn-group">';
                CartTableString += '                    <button type="button" class="btn" onclick="AddQuantity(this)">＋</button>';
                CartTableString += '                    <button type="button" class="btn" onclick="LessQuantity(this)">－</button>';
                CartTableString += '                    <button type="button" class="btn btn-red" onclick="DeleteCommodity(this)">刪除</button>';
                CartTableString += '                </div>';
                CartTableString += '            </td>';
                CartTableString += '            <td class="sub-total"></td>';
                CartTableString += '        </tr>';
            }
            CartTableString += '    </tbody>';
            CartTableString += '    <tfoot>';
            CartTableString += '        <tr class="cart-total">';
            CartTableString += '            <td colspan="5">合計</td>';
            CartTableString += '            <td></td>';
            CartTableString += '        </tr>';
            CartTableString += '    </tfoot>';
            CartTableString += '</table>';
        }
    } else {
        CartTableString += '<h1 class="message">沒有任何商品在購物車！</h1>';
    }
    CartTableString += '<div class="total">';
    CartTableString += '    <div>總計</div>';
    CartTableString += '    <div></div>';
    CartTableString += '</div>';
    CartTableString += '<div>';
    $(RenderElement).html(CartTableString);
    CalcTotal();
    $('.cart-table caption').click(function (evt) {
        $(evt.target).next('thead').toggle();
        $(evt.target).next('thead').next('tbody').toggle();
    });
    $('.cart-table>tbody>tr').click(SelectCommodity);
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
    if (evt.target.tagName != 'TD' && evt.target.tagName != 'TR' && evt.target.tagName != 'DIV') {
        return;
    }
    let CommodityInfo = GetCommodityInfo(evt.target);
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
function PutCart(CartID, CartName, CommodityID, CommodityName, Price,Quantity = 1) {
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
    }
    if (IsEdit) {
        SetCartsStorage(Carts);
        if (RenderElement) {
            RenderTable(RenderElement);
        }
    }
}
//購物車全選
function SelectCart(element) {
    let Carts = GetCartsStorage();
    let CartElement = $(element).parents('table.cart-table');
    const CartId = $(CartElement).find('input[name="cart-id"]').val();
    let findCarts = Carts.filter((Cart) => Cart.ID == CartId);
    if (findCarts.length) {
        let Cart = findCarts[0];
        Cart.Commodities.forEach((Commodity, iCommodity) => {
            let TrTag = $($(CartElement).find('tbody>tr')[iCommodity]);
            $(TrTag).addClass('select');
            $(TrTag).find('input[name="commodity-select"]').prop('checked', true);
            Commodity.Select = true;
        });
        SetCartsStorage(Carts);
    }
}
//-----/Events-----
//-----Methods-----
//取得目前商品
function GetCommodityInfo(element) {
    let tagTr = null;
    if (element.tagName == 'TR') {
        tagTr = element;
    } else {
        tagTr = $(element).parents('tr');
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
function UpdateCartStorageQuantity(CartId, CommodityId,Quantity) {
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
    Carts.forEach((Cart,iCart) => {
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
        const CartElement = $(RenderElement).find('table.cart-table')[iCart];
        CartTotal = 0;
        Cart.Commodities.forEach((Commodity, iCommodity) => {
            const CommodityElement = $(CartElement).find('tbody>tr')[iCommodity];
            if (Commodity.Select) {
                SubTotal = Commodity.Price * Commodity.Quantity;
            } else {
                SubTotal = 0;
            }
            CartTotal += SubTotal;
            $(CommodityElement).children('td.sub-total').html('$ ' + parseInt(SubTotal));
        });
        Total += CartTotal;
        $($(CartElement).find('tfoot>tr.cart-total>td')[1]).html('$ ' + parseInt(CartTotal));
    });
    $($(RenderElement).find('div.total>div')[1]).html('$ ' + parseInt(Total));
}
//加入千分位
function toCurrency(num) {
    var parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$ '+parts.join('.');
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
                    Select:false
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
