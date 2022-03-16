@isTest
private class AccountControllerTest {
    @TestSetup
    static void makeData(){
        List<Account> newAccounts = new List<Account>();
        for(Integer num = 0; num < 5; num++) {
            newAccounts.add(new Account(name = 'Test Account ' + num, Active__c = 'Yes'));
        }
        Insert newAccounts;
    }

    @isTest 
    static void TP_GetAccountList() {
        Test.startTest();
        List<Account> allAccounts = AccountController.GetAccountList();
        System.assertEquals(5,allAccounts.size());
        Test.stopTest();
    }
    @isTest 
    static void TP_SaveAccountList() {
        List<Account> allAccounts = new List<Account>();
        for(Integer i = 0; i < 2; i++) {
            Account a = new Account(Name ='John' + i, Active__c = 'Yes');
            allAccounts.add(a);
        }
        Test.startTest();
        AccountController.SaveAccountList(allAccounts);
        List<Account> retrievedAccounts = [select Name, Id from Account where Name like '%John%'];
        System.assertEquals(2,retrievedAccounts.size());
        Test.stopTest();
    }
}