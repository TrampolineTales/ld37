(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const EvidenceTagsJSON = require('../json/evidencetags.json');
const CaseFilesJSON = require('../json/casefiles.json');
const LevelsJSON = require('../json/levels.json');

var $evidenceTags = [];
var remainingTags = [];
var submittedTagIDs = [];
var currentPage = 1;
var currentLevel = 1;
var animating = true;
var tagAnimationNum = 1;
var timer = 60;
var strikes = 0;
var gameStarted = false;
var $arrowLeft;
var $arrowRight;
var timerID;
var officerIntervalID;

function addClickableText(text, func, className) {
  return $('<div>').html('<span class="' + className +'">' + text + '</span>').click(func);
}

function displayCover(message) {
  $('<div>').attr('id', 'cover').html('<br>' + message + '<br><br>').appendTo($('body'));
  var intervalID = setInterval(function() {
    if ((parseFloat($('#cover').css('opacity')) < 1) && (gameStarted)) {
      animating = true;
      $('#cover').css('opacity', parseFloat($('#cover').css('opacity')) + 0.01);
    } else {
      switch (message) {
        case 'YOU WIN!':
        $('<div>').html('Score: ' + submittedTagIDs.length + ' out of ' + LevelsJSON[currentLevel - 1].neededTags.length).appendTo($('#cover'));
          $('<span>').attr('class', 'cover-button').html('Play again?').click(function() {
            strikes = 0;
            timer = 60;
            $('#timer').html(':60');
            clearInterval(timerID);
            $('#cover').remove();
            addTagsByPage(true);
            $('.strike').html('[ ]');
            displayOfficerMessage();
            timerID = setInterval(decreaseTimer, 1000);
          }).appendTo($('#cover'));
        break;
        case 'GAME OVER':
        $('<div>').html('Score: ' + submittedTagIDs.length + ' out of ' + LevelsJSON[currentLevel - 1].neededTags.length).appendTo($('#cover'));
          $('<span>').attr('class', 'cover-button').html('Try again?').click(function() {
            strikes = 0;
            timer = 60;
            $('#timer').html(':60');
            clearInterval(timerID);
            $('#cover').remove();
            addTagsByPage(true);
            $('.strike').html('[ ]');
            displayOfficerMessage();
          }).appendTo($('#cover'));
        break;
      case 'The Evidence Room':
      $('#cover').css('opacity', 1);
      $('<span>').attr('class', 'cover-button').html('Play').click(function() {
        $('#cover').remove();
        displayCover(LevelsJSON[0].levelMessage);
      }).appendTo($('#cover'));
      break;
      case LevelsJSON[0].levelMessage:
        $('#cover').css('font-size', '52px');
        $('#cover').css('opacity', 1);
        if (!gameStarted) {
          var $body = $('body');
          $('<div>').attr('id', 'casefile-panel').attr('class', 'panel').html('<div id="casefile-monitor">').appendTo($body);
          $('<div>').attr('id', 'officer-panel').attr('class', 'panel').appendTo($body);
          $('<div>').attr('id', 'evidence-panel').attr('class', 'panel').appendTo($body);
          $('<div>').attr('id', 'page-num').attr('class', 'panel').appendTo($body);
          $('<div>').attr('id', 'timer').html(':60').appendTo($body);
          $('<p>').attr('id', 'strikes').html('<span class="strike">[ ]</span> <span class="strike">[ ]</span> <span class="strike">[ ]</span>').appendTo($body);
          gameStarted = true;
        }
        $('<span>').attr('class', 'cover-button').html('Let\'s get started!').click(function() {
          $('#cover').css('font-size', '72px');
          $('#cover').remove();

          var $pageNum = $('#page-num');
          $arrowLeft = $('<img>').attr('class', 'panel').attr('id', 'arrow-left').attr('src', 'assets/arrow-left.png').click(function() {
            currentPage--;
            addTagsByPage(false);
              $pageNum.html(currentPage + '/' + Math.ceil(remainingTags.length / 4));
          });
          $arrowRight = $('<img>').attr('class', 'panel').attr('id', 'arrow-right').attr('src', 'assets/arrow-right.png').click(function() {
            currentPage++;
            addTagsByPage(false);
            $pageNum.html(currentPage + '/' + Math.ceil(remainingTags.length / 4));
          });

          addCasefiles(false);
          addTagsByPage(true);
          $pageNum.html(currentPage + '/' + Math.ceil(remainingTags.length / 4));
          setTimeout(function() {
          displayOfficerMessage();
          timerID = setInterval(decreaseTimer, 1000);
          }, 1250);
        }).appendTo($('#cover'));
      break;
    }
    clearInterval(intervalID);
  }
  }, 1000 / 60);
}

function displayOfficerMessage(message) {
  clearInterval(officerIntervalID);
  if ((submittedTagIDs.length == LevelsJSON[currentLevel - 1].neededTags.length) && (message == undefined)) {
    displayCover('YOU WIN!');
  } else {
    animating = true;
    $('#officer-panel').html('');
    $('<div>').attr('class', 'officer-message').appendTo($('#officer-panel'));

    officerIntervalID = setInterval(function() {
      $('#talking')[0].play();
      var $officerMessage = $('.officer-message');
      if (message == undefined) {
        var arr = LevelsJSON[currentLevel - 1].messages[submittedTagIDs.length].split('');
      } else {
        var arr = message.split('');
      }
      if ($officerMessage.text().length < arr.length) {
        $officerMessage.text($officerMessage.text() + arr[$officerMessage.text().length]);
      } else {
        switch (message) {
          case 'You\'re taking too long, mac! I\'m outta here!':
            $($('.strike')[2 - strikes]).html('[X]');
            strikes++;
            $('#strikesound')[0].play();

            clearInterval(officerIntervalID);
            if (strikes > 2) {
              displayCover('GAME OVER');
            } else {
              setTimeout(displayOfficerMessage, 2000);
            }
          break;
          case 'That\'s not right...':
            $($('.strike')[2 - strikes]).html('[X]');
            strikes++;
            $('#strikesound')[0].play();

            clearInterval(officerIntervalID);
            setTimeout(displayOfficerMessage, 2000);
          break;
          case 'That\'s not right! You\'ve made too many mistakes, cementhead! You\'re fired!':
            $($('.strike')[2 - strikes]).html('[X]');
            strikes++;
            $('#strikesound')[0].play();

            clearInterval(officerIntervalID);
            displayCover('GAME OVER');
          break;
          default:
            clearInterval(officerIntervalID);
        }
        $('#talking')[0].pause();
        animating = false;
      }
    }, 35);
  }
}

function submitTag() {
  animating = true;
  $('#submit')[0].play();

  var intervalID = setInterval(function() {
    if (parseInt(this.$div.css('left')) >= 400) {

      for (var i = 0; i < remainingTags.length; i++) {
        if (remainingTags[i] == this.$div.data('id')) {
          submittedTagIDs.push($evidenceTags[i % 4].data('id'));
          remainingTags.splice(i, 1);
          if ((remainingTags.length % 4 == 0) && (remainingTags.length > 0) && (currentPage - 1 == Math.ceil(remainingTags.length / 4)) && (submittedTagIDs[submittedTagIDs.length - 1] == LevelsJSON[currentLevel - 1].neededTags[submittedTagIDs.length - 1])) {
            currentPage--;
          }
          break;
        }
      }

      tagAnimationNum = 1;
      animating = false;
      clearInterval(intervalID);
      if (submittedTagIDs[submittedTagIDs.length - 1] == LevelsJSON[currentLevel - 1].neededTags[submittedTagIDs.length - 1]) {
        displayOfficerMessage('That\'s the one! Thanks mac!');
        clearInterval(timerID);
        setTimeout(function() {
          displayOfficerMessage();
          timerID = setInterval(decreaseTimer, 1000);
          timer = 60;
        }, 3000);
      } else if (strikes < 2) {
        displayOfficerMessage('That\'s not right...');
        remainingTags.push(submittedTagIDs.splice(submittedTagIDs.length - 1, 1)[0]);
      } else {
        displayOfficerMessage('That\'s not right! You\'ve made too many mistakes, cementhead! You\'re fired!');
        remainingTags.push(submittedTagIDs.splice(submittedTagIDs.length - 1, 1)[0]);
      }
      addTagsByPage(false);
      if (remainingTags.length > 0) {
        $('#page-num').html(currentPage + '/' + Math.ceil(remainingTags.length / 4));
      }
    } else {
      this.$div.css('left', parseInt(this.$div.css('left')) + tagAnimationNum);
      tagAnimationNum *= 1.065;
    }
  }.bind({$div: this.$div}), 1000 / 60);
}

function addCasefiles(animate) {
  var $caseFileMonitor = $('#casefile-monitor');
  $caseFileMonitor.html('');
  $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html(addClickableText('Casefile Computer', undefined, 'top-text'))).appendTo($caseFileMonitor);

  // if ((animate != undefined) && (animate)) {
  //   for (var i = 0; i < LevelsJSON[currentLevel - 1].caseFiles.length; i++) {
  //     setTimeout(function() {
  //       if (!animating) {
  //         $('<div>').attr('class', 'casefile-text').html(addClickableText(CaseFilesJSON[[LevelsJSON[currentLevel - 1].caseFiles[this.num]]].title, displayCasefileData, 'text').data('id', LevelsJSON[currentLevel - 1].caseFiles[this.num])).appendTo($caseFileMonitor)
  //         $('#blip' + (Math.floor(Math.random() * 3) + 1))[0].play();
  //       }
  //     }.bind({num: i}), (i + 1) * 250);
  //   }
  // } else {
    for (var i = 0; i < LevelsJSON[currentLevel - 1].caseFiles.length; i++) {
      $('<div>').attr('class', 'casefile-text').html(addClickableText(CaseFilesJSON[[LevelsJSON[currentLevel - 1].caseFiles[i]]].title, displayCasefileData, 'text').data('id', LevelsJSON[currentLevel - 1].caseFiles[i])).appendTo($caseFileMonitor);
    }
  // }

  $('<div>').attr('id', 'casefile-bottombar').html($('<div>').attr('class', 'bar').html(addClickableText('CasefileOS-v0.37', function() {
    $caseFileMonitor.html('');
    $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html('<span class="top-text">CasefileOS-v0.37</span>')).appendTo($caseFileMonitor);
    $('<div>').html('<p>The Evidence Room was developed in 48 hours by <a href="http://TrampolineTales.com/" target="_blank" class="text">TrampolineTales</a> for <a href="http://ludumdare.com/compo/ludum-dare-37/" target="_blank" class="text">Ludum Dare 37</a>.</p>').appendTo($caseFileMonitor);
    $('<div>').attr('id', 'casefile-bottombar').attr('class', 'bar').html($('<div>').html(addClickableText('Back', addCasefiles, 'topbar-text'))).appendTo($caseFileMonitor);
  }, 'topbar-text'))).appendTo($caseFileMonitor);
}

function displayCasefileData() {
  var casefile = CaseFilesJSON[$(this).data('id')];
  var $caseFileMonitor = $('#casefile-monitor');
  $caseFileMonitor.html('');

  switch (casefile.type) {
    case 'newspaper':
      $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html('<span class="top-text">' + casefile.title + '</span>' + '<span class="top-text casefile-date">' + casefile.data + '</span>')).appendTo($caseFileMonitor);
      $('<div>').attr('class', 'newspaper').html('<div id="newspaper-icon"></div>' + '<div class="file-text">' + casefile.text + '</div>').appendTo($caseFileMonitor);
    break;
    case 'notes':
    $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html('<span class="top-text">' + casefile.title + '</span>' + '<span class="top-text casefile-date">' + casefile.data + '</span>')).appendTo($caseFileMonitor);
      $('<div>').attr('class', 'file-text').html(casefile.text).appendTo($caseFileMonitor);
    break;
    default:
      $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html('<span class="top-text">' + casefile.title + '</span>')).appendTo($caseFileMonitor);
      $('<div>').attr('class', 'file-text').html(casefile.text).appendTo($caseFileMonitor);
  }

  $('<div>').attr('id', 'casefile-bottombar').html($('<div>').attr('class', 'bar').html(addClickableText('Back', addCasefiles, 'topbar-text'))).appendTo($caseFileMonitor);
}

function addTag(id) {
  $evidenceTags.push($('<div class="evidence-tag">').html(
    '<img src="assets/tag.png">' +
    '<div class="case-num">' + EvidenceTagsJSON[id].caseNum + '</div>' +
    '<div class="date">' + EvidenceTagsJSON[id].date + '</div>' +
    '<div class="type">' + EvidenceTagsJSON[id].type + '</div>').data('id', EvidenceTagsJSON[id].id).appendTo($('#evidence-panel')));
  $evidenceTags[$evidenceTags.length - 1].click(
    function() {
      if ((!animating) && (submittedTagIDs.length != LevelsJSON[currentLevel - 1].neededTags.length)) {
        this.$div.css('position', 'relative');
        submitTag.bind({$div: this.$div})()
      }
    }.bind({$div: $evidenceTags[$evidenceTags.length - 1]}));
}

function decreaseTimer() {
  if (timer == 0) {
    displayOfficerMessage('You\'re taking too long, mac! I\'m outta here!');
    timer = 60;
  } else {
    timer--;
    if (timer > 9) {
      $('#timer').html(':' + timer);
    } else {
      $('#timer').html(':0' + timer);
    }
  }
}

function addTagsByPage(initLevel) {
  $evidenceTags.map((el)=> el.remove());
  $evidenceTags = [];

  if (initLevel) {
    currentPage = 1;
    var tags = LevelsJSON[currentLevel - 1].evidenceTags;
    remainingTags = LevelsJSON[currentLevel - 1].evidenceTags.map((el)=>el);
    submittedTagIDs = [];
  } else {
    $arrowLeft.detach();
    $arrowRight.detach();
    var tags = remainingTags;
  }

  for (var i = (currentPage - 1) * 4; i < tags.length; i++) {
    addTag(tags[i]);
    if (i == 3 + (currentPage - 1) * 4) {
      if (tags[4] != undefined) {
        $arrowRight.appendTo($('body'));
      }
      break;
    }
  }

  if (currentPage > 1) {
    $arrowLeft.appendTo($('body'));
  }
}

$(document).ready(function() {
  displayCover('The Evidence Room');
});

},{"../json/casefiles.json":2,"../json/evidencetags.json":3,"../json/levels.json":4}],2:[function(require,module,exports){
module.exports=[
  {
    "type": "newspaper",
    "data": "1/10/85",
    "title": "\"Tragedy at the Opera!\"",
    "text": "Tragedy struck yesterday at the Sunday showing at the Gregory Opera Theatre. During the pivotal scene, Frank Portsman (48) was pushed from the balcony! Police are still questioning those who were in the same wing as Portsman."
  },
  {
    "type": "notes",
    "data": "#70560",
    "title": "Milennium Christmas Killer",
    "text": "Name: Gregory Bales<br>Age: Deceased<br>Occupation: Unknown<br>Aliases: Greg, Christmas Killer, Milennium Christmas Killer"
  },
  {
    "type": "notes",
    "data": "#07510",
    "title": "Seven Sins Killer",
    "text": "Name: Vincent Woodman<br>Age: Deceased<br>Occupation: Unknown<br>Aliases: Vince, Woody, Seven Sins Killer"
  },
  {
    "type": "newspaper",
    "data": "8/22/73",
    "title": "\"Piano Teacher Kills 12\"",
    "text": "Police officers say there's a killer on the lose who is targeting those who have taken piano lessons. The latest victim is Jimmy Green (14)."
  },
  {
    "type": "notes",
    "data": "#01925",
    "title": "\"Farmer Bob\"",
    "text": "Name: Robert Pitch<br>Age: 87<br>Occupation: Farmer<br>Aliases: Bob, Farmer Bob, Pitchfork Killer"
  }
]

},{}],3:[function(require,module,exports){
module.exports=[
  {
    "id": 0,
    "caseNum": "00021",
    "date": "10/31/37",
    "type": "Bloody Knife"
  },
  {
    "id": 1,
    "caseNum": "23535",
    "date": "1/10/85",
    "type": "Portsman's Cufflink"
  },
  {
    "id": 2,
    "caseNum": "99937",
    "date": "Dec. '16",
    "type": "Switchblade Knife"
  },
  {
    "id": 3,
    "caseNum": "23535",
    "date": "1/11/85",
    "type": "Interview Tape"
  },
  {
    "id": 4,
    "caseNum": "10505",
    "date": "4/17/95",
    "type": "Blood Sample"
  },
  {
    "id": 5,
    "caseNum": "89070",
    "date": "2/7/08",
    "type": "Artist's Sketch"
  },
  {
    "id": 6,
    "caseNum": "45062",
    "date": "5/18 '65",
    "type": "Fire Extinguisher"
  },
  {
    "id": 7,
    "caseNum": "80876",
    "date": "Jan. '93",
    "type": "IRC Chatlogs"
  },
  {
    "id": 8,
    "caseNum": "70560",
    "date": "12/25/00",
    "type": "Fireplace Poker"
  },
  {
    "id": 9,
    "caseNum": "72963",
    "date": "2/1/15",
    "type": "Blood Sample"
  },
  {
    "id": 10,
    "caseNum": "52100",
    "date": "8/22/73",
    "type": "Shoelace"
  },
  {
    "id": 11,
    "caseNum": "45062",
    "date": "5/6/13",
    "type": "Stuffed Animal"
  }
]

},{}],4:[function(require,module,exports){
module.exports=[
  {
    "levelMessage": "Welcome to The Evidence Room! Due to budget cuts at the precinct, all the evidence has to be stored in one room. It's up to YOU to make sure the evidence gets to the right police officers, even when they don't know exactly which piece of evidence they need...",
    "evidenceTags": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "neededTags": [0, 8, 1, 7, 3, 5, 11],
    "messages": [
      "Hey mac, lemme get the evidence from Case #21.",
      "Hey mac, can you get me the evidence from the Milennium Christmas Killer? The Casefile Computer might help you out.",
      "Hey mac, remember that piece of the victim's suit that fell off during that one opera murder? Find it for me, would ya?",
      "Hey mac, would you mind getting the chatlogs that we printed out from the '93 stalker case?",
      "Sorry to bother you again, mac. Can I get the other evidence we have from the opera murder?",
      "Hey mac, lemme get the evidence from the week before Valentine's Day.",
      "Hey mac, can you get me the evidence from June 5th? I think one of our British interns filled out the evidence tag.",
    ],
    "caseFiles": [0, 1, 2, 3, 4]
  }
]

},{}]},{},[1]);
