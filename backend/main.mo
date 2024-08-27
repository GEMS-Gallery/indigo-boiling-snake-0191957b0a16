import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

actor {
  // Types
  type Post = {
    id: Nat;
    author: ?Principal;
    content: Text;
    category: Text;
    timestamp: Int;
  };

  // Stable variables
  stable var posts : [Post] = [];
  stable var nextPostId : Nat = 0;

  // Mutable variables
  var authenticatedUsers = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);

  // Helper functions
  func isAuthenticated(caller : Principal) : Bool {
    switch (authenticatedUsers.get(caller)) {
      case (?isAuth) { isAuth };
      case null { false };
    };
  };

  // Public functions
  public shared(msg) func createPost(content : Text, category : Text) : async Result.Result<Nat, Text> {
    if (not isAuthenticated(msg.caller)) {
      return #err("User not authenticated");
    };

    let post : Post = {
      id = nextPostId;
      author = ?msg.caller;
      content = content;
      category = category;
      timestamp = Time.now();
    };

    posts := Array.append(posts, [post]);
    nextPostId += 1;
    #ok(post.id)
  };

  public query func getPosts() : async [Post] {
    posts
  };

  public query func getPostsByCategory(category : Text) : async [Post] {
    Array.filter(posts, func (post : Post) : Bool {
      post.category == category
    })
  };

  public shared(msg) func login() : async Result.Result<Text, Text> {
    authenticatedUsers.put(msg.caller, true);
    #ok("Logged in successfully")
  };

  public shared(msg) func logout() : async Result.Result<Text, Text> {
    authenticatedUsers.delete(msg.caller);
    #ok("Logged out successfully")
  };

  public query func isUserAuthenticated(user : Principal) : async Bool {
    isAuthenticated(user)
  };
}