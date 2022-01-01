@isTest 
private class CartControllerTest {
    @isTest 
    static void TP_GetCart() {
        Test.startTest();

        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = '0015f00000CnQFlAAN',
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        Insert newCarts;

        List<Cart__c> result = CartController.getCart(1);
        System.assertEquals(1, result[0].Order_Number__c);
        Test.stopTest();
    }
    
    @isTest 
    static void TN_GetCart() {
        Test.startTest();
        
        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = '0015f00000CnQFlAAN',
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        Insert newCarts;
        List<Cart__c> result = CartController.getCart(100);
        System.assertEquals(0, result.size());
        Test.stopTest();
    }

    static void TP_SaveCarts() {
        Test.startTest();
        
        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = '0015f00000CnQFlAAN',
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        
        CartController.SaveCarts(newCarts);
        List<Cart__c> result = [SELECT Name,Account__c,Quantity__c,Total_price__c,Order_Number__c FROM Cart__c];
        System.assertEquals(5, result.size());
        System.assertEquals('0015f00000CnQFlAAN', result[0].Account__c);
        Test.stopTest();
    }

    static void TN_SaveCarts() {
        Test.startTest();
        
        List<Cart__c> newCarts = new List<Cart__c>();
        
        for(Integer i = 0; i < 5; i++) {
            Cart__c newCart = new Cart__c(
            Account__c = 'Jerry',
            Order_Number__c = 1 + i,
            Quantity__c = 20 *(i+1),
            Total_price__c = 40 * (i+1));
            newCarts.add(newCart);
        }
        
        CartController.SaveCarts(newCarts);
        List<Cart__c> result = [SELECT Name,Account__c,Quantity__c,Total_price__c,Order_Number__c FROM Cart__c];
        System.assertEquals(0, result.size());
        Test.stopTest();
    }
}
