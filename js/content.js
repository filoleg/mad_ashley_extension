var email_re = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
// /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g
// /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi


function unique(list) {
  var result = [];
  $.each(list, function(i, e) {
    if ($.inArray(e, result) == -1) result.push(e);
  });
  return result;
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.message === "get_emails" && request.from == "popup") {
      var email_list = document.documentElement.outerHTML.match(email_re);
      try {
        email_list = unique(email_list);
      } catch(err) {
        sendResponse({"message":'error'});
      };


      console.log("testing");
      try {
        if (email_list.length == 0) {
          sendResponse({"message":"error"});
        } else {
          sendResponse({"message":"emails", "email_list":email_list});
          console.log("response sent");
        }
      } catch(err) {
        sendResponse({"message":"error"});
      }
    }
  }
);