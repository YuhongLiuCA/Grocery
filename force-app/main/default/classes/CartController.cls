public with sharing class CartController {
    public CartController() {

    }

    @AuraEnabled
    public static List<Cart__c> getCarts(){
        try {
            List<Cart__c> c = new List<Cart__c>();
            return c;            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void SaveCarts(List<Cart__c> carts){
        List<cart__c> newCarts = [SELECT Name,Account__c,Quantity__c,Total_price__c FROM Cart__c];
        for(Integer i = 0; i < carts.size(); i++) {
            Cart__c newCart = new Cart__c(Account__c = carts[i].Account__c,
            Order_Number__c = carts[i].Order_Number__c,
            Quantity__c = carts[i].Quantity__c,
            Total_price__c = carts[i].Total_price__c);
            newCarts.add(newCart);
        }
        try {
            Upsert newCarts;       
            //List<Database.SaveResult> dsrs = Database.Insert(newCarts, false);     
            //system.debug(dsrs);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
