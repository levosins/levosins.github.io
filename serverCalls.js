$(function(){
  var groupInviteCode = createGroupInviteCode();
  var userGuid = createUserGuid();
  var accountNumber = createAccountNumber();
  var deviceId = createCurrentDeviceId();
  var subscriberId = createSubscriberId();
  var mockServerBaseURL = "https://cryptic-forest-60044.herokuapp.com/guardian/dev/api/v1";

  var groupName,
    firstName,
    lastName,
    phone,
    ownerEmail;

  $(".submit").click(function(event) {
    event.preventDefault();

    setGlobalValues();
    createAllNeededGroupInfo();
  });

  function setGlobalValues() {
    // Group Values
    groupName = $("#groupName").val();

    // OWNER Values
    firstName = $("#ownerFirstName").val();
    lastName = $("#ownerLastName").val();
    phone = $("#ownerPhone").val();
    ownerEmail = $("#ownerEmail").val();
  }

  function createAllNeededGroupInfo() {
    createGroup().then(createProfile).then(createGroupCode).then(createPlanEligibility);
  }

  function createGroup() {
    var groupOwner = {
      memberIndex: 0,
      deviceOnboarded: true,
      role: "OWNER",
      firstName: firstName,
      lastName: lastName,
      userGuid: userGuid,
      phone: phone,
      imageUrl: null,
      mapInfo: null
    };

    var group = {
      name: groupName,
      groupInviteCode: groupInviteCode,
      members: [groupOwner]
    };

    var groupData = JSON.stringify(group);

    return $.ajax({
      type: "POST",
      url: mockServerBaseURL + "/groups",
      data: groupData,
      success: function() {
        print("Group created")
      },
      dataType: "json",
      contentType: "application/json"
    });
  }

  function createProfile(data, textStatus, jqXHR) {
    var timestampToday = Math.round((new Date()).getTime() / 1000);

    var profile = {
      guid: userGuid,
      firstName: firstName,
      lastName: lastName,
      role: "OWNER",
      email: ownerEmail,
      emailVerified: true,
      phone: phone,
      phoneVerified: true,
      accountNumber: accountNumber,
      subscriberId: subscriberId,
      currentDeviceId: deviceId,
      deviceOnboarded: true,
      termsAcceptedDate: timestampToday,
      termsAcceptedVersionCode: 2,
      privacyAcceptedDate: timestampToday,
      privacyAcceptedVersionCode: 1,
      imageUrl: null
    };

    var profileData = JSON.stringify(profile)

    return $.ajax({
      type: "POST",
      url: mockServerBaseURL + "/profile",
      data: profileData,
      success: function() {
        print("Created Profile")
      },
      dataType: "json",
      contentType: "application/json"
    });
  }

  function createGroupCode(data, textStatus, jqXHR) {
    var groupCode = { code: groupInviteCode, expiration: 1664688694 };
    var groupCodeData = JSON.stringify(groupCode);

    return $.ajax({
      type: "POST",
      url: mockServerBaseURL + "/groups/code",
      data: groupCodeData,
      success: function() {
        print("Created GroupCode")
      },
      dataType: "json",
      contentType: "application/json"
    });
  }

  function createPlanEligibility(data, textStatus, jqXHR) {
    var offerId = createOfferId();
    var vin = createVin();

    var planEligibility = {
      userGuid: userGuid,
      status: "SUBSCRIBED",
      accountNo: accountNumber,
      vin: vin,
      offerId: offerId,
      details: {
        duration: {
          span: 3,
          measure: "MONTH"
        },
        pricing: {
          price: 5,
          currency: "USD"
        }
      }
  };

  var planEligibilityData = JSON.stringify(planEligibility);

  return $.ajax({
    type: "POST",
    url: mockServerBaseURL + "/plan-eligibility",
    data: planEligibilityData,
    success: function() {
      print("Created Plan Eligibility")
    },
    dataType: "json",
    contentType: "application/json"
    });
  }

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result.toUpperCase();
  }

  function createUserGuid() {
    return makeid(10);
  }

  function createGroupInviteCode() {
    return makeid(6);
  }

  function createVin() {
    return makeid(17);
  }

  function createCurrentDeviceId() {
    return makeid(41)
  }

  function createOfferId() {
    return makeid(13);
  }

  function createSubscriberId() {
    return makeid(24);
  }

  function createAccountNumber() {
    var accountNumber = Math.random() * 10000000000;
    return Math.floor(accountNumber);
  }

});
