public with sharing class AccountsOperation {
    List<Account> currentAccounts;
    public AccountsOperation() {
        currentAccounts = new List<Account>();
    }
    public void getCurrentAccounts() {
        currentAccounts = [SELECT name,rating FROM Account];
        System.debug(currentAccounts);
    }
    public void insertMassAccounts() {
        Integer n = 10;
        List<Account> tempAccounts = new List<Account>();
         
        for(Integer index = 0; index < n; index++) {
            String sName = 'YLGrocery' + index;
            Account temp = new Account(name=sName,Industry='Retail');
            tempAccounts.add(temp);
        }
        Upsert(tempAccounts);
    }
    public static void deleteMassAccounts() {
        List<Account> toDelete = [SELECT Name FROM Account WHERE Name LIKE '%YLGrocery%'];
        System.debug(toDelete);
        Delete toDelete;
    }
}