function RenderCartTable(element){
    
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
    const input = $(element).parents('tr').find('input[type="number"]');
    const quantity = parseInt(input.val());
    input.val(quantity + 1);
}
function LessQuantity(element){
    const input = $(element).parents('tr').find('input[type="number"]');
    const quantity = parseInt(input.val());
    if(quantity > 1){
        input.val(quantity - 1);
    }
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