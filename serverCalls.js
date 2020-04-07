$(function(){
  var groupInviteCode = createGroupInviteCode();
  var userGuid = createUserGuid();
  var localHostURL = "http://192.168.1.6:8080"
  var herokuBaseURL = "https://cryptic-forest-60044.herokuapp.com"
  var currentEnvironment = "test"
  var mockServerBaseURL = localHostURL + "/guardian/" + currentEnvironment + "/api/v1";
  var overlay = $(".overlay");

  var groupName,
    firstName,
    lastName,
    phone,
    ownerEmail;

  $(".submit").click(function(event) {
    event.preventDefault();

    overlay.show();
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
      dataType: "json",
      contentType: "application/json"
    }).done(function(data) {
      console.log("Created Group");
    }).fail(function(jqXHR, textStatus) {
      overlay.hide();
      alert(textStatus);
    });
  }

  function createProfile(data, textStatus, jqXHR) {
    var profile = {
      guid: userGuid,
      role: "OWNER",
      firstName: firstName,
      lastName: lastName,
      email: ownerEmail,
      emailVerified: true,
      phone: phone,
      phoneVerified: true,
      deviceOnboarded: true,
      termsAcceptedVersionCode: 2,
      privacyAcceptedVersionCode: 1,
      currentDeviceId: "123",
      imageUrl: null,
      safetyServicesStatus: null,
      locationSharingStatus: null
    };

    var profileData = JSON.stringify(profile);

    return $.ajax({
      type: "POST",
      url: mockServerBaseURL + "/profile",
      data: profileData,
      dataType: "json",
      contentType: "application/json"
    }).done(function(data) {
      console.log("Created Profile");
    }).fail(function(jqXHR, textStatus) {
      overlay.hide();
      alert(textStatus);
    });
  }

  function createGroupCode(data, textStatus, jqXHR) {
    var groupCode = { code: groupInviteCode, expiration: 1664688694 };
    var groupCodeData = JSON.stringify(groupCode);

    return $.ajax({
      type: "POST",
      url: mockServerBaseURL + "/groups/code",
      data: groupCodeData,
      dataType: "json",
      contentType: "application/json"
    }).done(function(data) {
      console.log("Created GroupCode");
    }).fail(function(jqXHR, textStatus) {
      overlay.hide();
      alert(textStatus);
    });
  }

  function createPlanEligibility(data, textStatus, jqXHR) {

    var planEligibility = {
        userGuid: userGuid,
        status: "SUBSCRIBED",
        reason: null,
        vin: null,
        offer: null
    };

    var planEligibilityData = JSON.stringify(planEligibility);

    return $.ajax({
      type: "POST",
      url: mockServerBaseURL + "/plan-eligibility",
      data: planEligibilityData,
      dataType: "json",
      contentType: "application/json"
    }).done(function (data) {
      console.log("Created Plan Eligibility");
      overlay.hide();
      successAlert();
    }).fail(function (jqXHR, textStatus) {
      overlay.hide();
      alert(textStatus);
    });
  }

  function successAlert() {
    alert("Success! Your new group with an OWNER has been created!");
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

});
