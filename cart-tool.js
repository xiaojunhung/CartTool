let RenderElement = null;
function RenderCartTable(element){
    RenderElement = element;
    
}
function GetCartStorage(){
    const jsonString = localStorage.getItem('CartStorage');
    return JSON.parse(jsonString);
}
function SetCartStorage(obj){
    const jsonString = JSON.stringify(obj);
    localStorage.setItem('CartStorage',jsonString);
}
function AddQuantity(element){
    const CommodityInfo = GetCommodityInfo(element);
    let quantity = parseInt(CommodityInfo.Quantity);
    quantity++;
    $(element).parents('tr').find('input[name="commodity-quantity"]').val(quantity);
    SetCommodityQuantity(CommodityInfo.CartID,CommodityInfo.CommodityID,quantity);
}
function LessQuantity(element){
    const CommodityInfo = GetCommodityInfo(element);
    let quantity = parseInt(CommodityInfo.Quantity);
    quantity--;
    if(quantity >= 1){
        $(element).parents('tr').find('input[name="commodity-quantity"]').val(quantity);
        SetCommodityQuantity(CommodityInfo.CartID,CommodityInfo.CommodityID,quantity);
    }
}
function SetCommodityQuantity(CartID,CommodityID,Quantity){
    let Carts = GetCartStorage();
    let IsEdit = false;
    Carts.forEach((Cart)=>{
        if(Cart.ID == CartID){
            Cart.Commodities.forEach((Commodity)=>{
                if(Commodity.ID == CommodityID){
                    Commodity.Quantity = parseInt(Quantity);
                    IsEdit = true;
                }
            });
        }
    });
    if(IsEdit){
        SetCartStorage(Carts);
        CalcTotal();
    } 
}
function GetCommodityInfo(element){
    return {
        CartID:$(element).parents('tr').find('input[name="cart-id"]').val(),
        CommodityID:$(element).parents('tr').find('input[name="commodity-id"]').val(),
        Quantity:$(element).parents('tr').find('input[name="commodity-quantity"]').val(),
    }
}
function CalcTotal(){
    let Total=0;
    let Carts = GetCartStorage();
    Carts.forEach((Cart,iCart)=>{
        const CartElement = $(RenderElement).find('table.cart-table')[iCart];
        Cart.Commodities.forEach((Commodity,iCommodity)=>{
            const CommodityElement = $(CartElement).find('tbody tr')[iCommodity];
            const SubTotal = Commodity.Price * Commodity.Quantity;
            Total+=SubTotal;
            $(CommodityElement).find('td.sub-total').html('$'+SubTotal);
        });
    });
    $('.cart-layout').find('.total').html('$'+Total);
}
function TestCartTool(){
    let Carts=[
        {
            ID:1,
            Name:'斯貝寵物平台',
            Commodities:[
                {
                    ID:10,
                    Name:'大空間貓砂盆全封閉式貓廁不沾砂喵砂盆貓便盆貓砂屋',
                    Price:599,
                    Quantity:10
                }
            ]
        }
    ]
    SetCartStorage(Carts);
}