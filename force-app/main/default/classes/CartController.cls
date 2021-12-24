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
    public static void SaveCartAndItems(Cart__c cart, List<Item> items){
        try {
            Upsert cart;
            Upsert items;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
