import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type UserData = {
    checkedItems : CheckedItems;
    monthlyIncome : Nat;
    dailyTasks : [Task];
  };

  type CheckedItems = {
    mABooks : [Text];
    certificates : [Text];
    riyalah : [Text];
    nETPrep : [Text];
    students : [Text];
  };

  type Task = {
    description : Text;
    done : Bool;
  };

  var persistedState : [(Principal, UserData)] = [];

  public shared ({ caller }) func saveUserData(checkedItems : CheckedItems, monthlyIncome : Nat, dailyTasks : [Task]) : async () {
    let userData : UserData = {
      checkedItems;
      monthlyIncome;
      dailyTasks;
    };

    // Update existed data or add new entry.
    let filteredState = persistedState.filter(
      func((principal, _)) { principal != caller }
    );
    persistedState := filteredState.concat([(caller, userData)]);
  };

  public query ({ caller }) func loadUserData() : async UserData {
    for ((principal, data) in persistedState.values()) {
      if (principal == caller) {
        return data;
      };
    };
    Runtime.trap("No data found for this user");
  };

  public query ({ caller }) func isUserDataPersisted() : async Bool {
    for ((principal, _) in persistedState.values()) {
      if (principal == caller) {
        return true;
      };
    };
    false;
  };
};
