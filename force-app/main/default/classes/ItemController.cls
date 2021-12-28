public with sharing class ItemController {
    public ItemController() {

    }

    @AuraEnabled
    public static void SaveItems(List<Item__c> newItems){
        try {
            List<Item__c> cartItems = new List<Item__c>();
            for(Integer i = 0; i < newItems.size(); i++) {
                Item__c newItem = new Item__c(
                    id__c = newItems[i].id__c,
                    Name = newItems[i].Name,
                    ItemPrice__c = newItems[i].ItemPrice__c,
                    Quantity__c = newItems[i].Quantity__c,
                    Product__c = newItems[i].Product__c, 
                    Cart__c = newItems[i].Cart__c
                );
                cartItems.add(newItem);
            }  
            Insert cartItems;          
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
