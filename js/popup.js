
var count;
var done;
var HttpClient = function(){
  this.get_status = function(email,cb) {
    var url = "https://ashley.cynic.al/check";
    var http = new XMLHttpRequest();
    var params = "email="+email;
    http.open('POST', url, true);
    //http.setRequestHeader('user-agent','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.89 Safari/537.36');
    //http.setRequestHeader('content-length','28');
    http.setRequestHeader('content-type','application/x-www-form-urlencoded; charset=UTF-8')
    
    http.responseType = 'text';
    http.onload = function() {
      // do something to response
      json_resp = JSON.parse(http.responseText);
      if (json_resp.success == false) {
        cb("#F6E66F","error",email);
      } else {
        console.log("found: " + json_resp.found);
        if (json_resp.found) {
          cb("#FF6666","yes",email);
        } else {
          cb("#33FF66","no",email);
        };
      };
    };
  
    http.send(params);
    
  };
};

function isValidEmailAddress(emailAddress) {
    var re = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    return re.test(emailAddress);
};

function renderStatus(statusText) {
  $('#status').text(statusText);
}


$( document).ready(function() {
    console.log( "ready!" );
    //$("a[class='btn btn-default']").popover();
    var new_client = new HttpClient();
    $("button[class='btn btn-default']").click(function() {
      console.log("wtf");
      new_client.get_status($('#search-term').val(), function(color,status,addr) {
        $("#search-term").css("background-color", color);
      });
      //var email = $('#search-term').val();
      //console.log(email);
      //$("a[class='btn btn-default']").attr('data-content',function() {
      //  $('#search-term').val();
      //  return email
      //});


    });
});





function displayEmails(response) {
  try {
    if (response.message == "emails") {
      var email_list;
      renderStatus('Processing emails...');
      var str = '';
      console.log(response.email_list);
      
      //var email_dict = response.email_list;
      //email_list = email_dict.keys();
      email_list = response.email_list;

      var new_client = new HttpClient();
      for(var i = 0; i < email_list.length; i += 1){
          //var email_check = getAMStatus(email_list[i]);
         new_client.get_status(email_list[i], function(color,status,addr) {
            $('#tbody').append($('<tr>').append($('<td>').text(count+=1)).append($('<td colspan="2">').text(addr)).append($("<td bgcolor='"+color+"'>").text(status)));
            if (!done) {
              renderStatus("Results");
              done = 1;
            }
         });
      };
      //renderStatus("Results");
    } else {
      renderStatus('No emails were found on this page :(');
  
    };
  } catch(err) {
    renderStatus('No emails were found on this page :(');
  }
}

document.addEventListener('DOMContentLoaded', function() {


  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    count = 0;
    done = 0;
    renderStatus('Getting emails...');
    chrome.tabs.sendMessage(tabs[0].id, {"from":"popup","message": "get_emails"},displayEmails);

  });
});
