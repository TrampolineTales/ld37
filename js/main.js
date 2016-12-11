const EvidenceTagsJSON = require('../json/evidencetags.json');
const CaseFilesJSON = require('../json/casefiles.json');
const LevelsJSON = require('../json/levels.json');

var $evidenceTags = [];
var remainingTags = [];
var submittedTagIDs = [];
var currentPage = 1;
var currentLevel = 1;
var animating = false;
var tagAnimationNum = 1;
var timer = 60;
var strikes = 2; //0
var $arrowLeft;
var $arrowRight;

function addClickableText(text, func, className) {
  return $('<div>').html('<span class="' + className +'">' + text + '</span>').click(func);
}

function displayCover(message) {
  $('<div>').attr('id', 'cover').html(message + '<br><br>').appendTo($('body'));
  var intervalID = setInterval(function() {
    if (parseFloat($('#cover').css('opacity')) < 1) {
      $('#cover').css('opacity', parseFloat($('#cover').css('opacity')) + 0.01);
    } else {
      if (message == 'GAME OVER') {
        $('<span>').attr('class', 'cover-button').html('Try again?').click(function() {
          $('#cover').remove();
          addTagsByPage(undefined, undefined, true);
          $('.strike').html('[ ]');
          displayOfficerMessage();
        }).appendTo($('#cover'));
      }
      clearInterval(intervalID);
    }
  }, 1000 / 60);
}

function displayOfficerMessage(message) {
  animating = true;
  $('#officer-panel').html('');
  $('<div>').attr('class', 'officer-message').appendTo($('#officer-panel'));
  var intervalID = setInterval(function() {
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
        case 'That\'s not right...':
          $($('.strike')[2 - strikes]).html('[X]');
          strikes++
        break;
        case 'That\'s not right! You\'ve made too many mistakes, cementhead! You\'re fired!':
          $($('.strike')[2 - strikes]).html('[X]');
          strikes++;
          displayCover('GAME OVER');
        break;
      }
      animating = false;
      clearInterval(intervalID);
    }
  }, 35);
}

// MAKE TUTORIAL LEVEL
// MAKE TITLE SCREEN
// ADD SOUND EFFECTS

function submitTag() {
  animating = true;

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

  var intervalID = setInterval(function() {
    if (parseInt(this.$div.css('left')) >= 400) {
      tagAnimationNum = 1;
      animating = false;
      clearInterval(intervalID);
      if (submittedTagIDs[submittedTagIDs.length - 1] == LevelsJSON[currentLevel - 1].neededTags[submittedTagIDs.length - 1]) {
        displayOfficerMessage('That\'s the one! Thanks mac!');
      } else if (strikes < 2) {
        displayOfficerMessage('That\'s not right...');
        remainingTags.push(submittedTagIDs.splice(submittedTagIDs.length - 1, 1)[0]);
      } else {
        displayOfficerMessage('That\'s not right! You\'ve made too many mistakes, cementhead! You\'re fired!');
        remainingTags.push(submittedTagIDs.splice(submittedTagIDs.length - 1, 1)[0]);
      }
      addTagsByPage(false);
      if (remainingTags.length > 0) {
        $('#page-num').html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
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
  $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html(addClickableText('Casefiles', undefined, 'top-text'))).appendTo($caseFileMonitor);

  if (true) { //change to animate != undefined if deemed annoying
    for (var i = 0; i < LevelsJSON[currentLevel - 1].caseFiles.length; i++) {
      setTimeout(function() {
        $('<div>').attr('class', 'casefile-text').html(addClickableText(CaseFilesJSON[[LevelsJSON[currentLevel - 1].caseFiles[this.num]]].title, displayCasefileData, 'text').data('id', LevelsJSON[currentLevel - 1].caseFiles[this.num])).appendTo($caseFileMonitor)
      }.bind({num: i}), (i + 1) * 100);
    }
  } else {
    for (var i = 0; i < LevelsJSON[currentLevel - 1].caseFiles.length; i++) {
      $('<div>').attr('class', 'casefile-text').html(addClickableText(CaseFilesJSON[[LevelsJSON[currentLevel - 1].caseFiles[i]]].title, displayCasefileData, 'text').data('id', LevelsJSON[currentLevel - 1].caseFiles[i])).appendTo($caseFileMonitor);
    }
  }

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
      $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html('<span class="top-text">' + casefile.title + '</span>' + '<span class="top-text casefile-date">' + casefile.date + '</span>')).appendTo($caseFileMonitor);
      $('<div>').attr('class', 'newspaper').html('<div id="newspaper-icon"></div>' + '<div class="file-text">' + casefile.text + '</div>').appendTo($caseFileMonitor);
    break;
    default:
      $caseFileMonitor.html($('<div>').attr('class', 'file-text').html(casefile.text));
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
      if (!animating) {
        this.$div.css('position', 'relative');
        submitTag.bind({$div: this.$div})()
      }
    }.bind({$div: $evidenceTags[$evidenceTags.length - 1]}));
}

function addTagsByPage(initLevel) {
  $evidenceTags.map((el)=> el.remove());
  $evidenceTags = [];

  if (initLevel) {
    currentPage = 1;
    var tags = LevelsJSON[currentLevel - 1].evidenceTags;
    remainingTags = LevelsJSON[currentLevel - 1].evidenceTags;
    submittedTagIDs = [];
  } else {
    $arrowLeft.detach();
    $arrowRight.detach();
    var tags = remainingTags;
  }

  for (var i = (currentPage - 1) * 4; i < tags.length; i++) {
    addTag(tags[i]);
    if (i == 3) {
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
  var $pageNum = $('#page-num');
  $arrowLeft = $('<img>').attr('class', 'panel').attr('id', 'arrow-left').attr('src', 'assets/arrow-left.png').click(function() {
    currentPage--;
    addTagsByPage(false);
      $pageNum.html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
  });
  $arrowRight = $('<img>').attr('class', 'panel').attr('id', 'arrow-right').attr('src', 'assets/arrow-right.png').click(function() {
    currentPage++;
    addTagsByPage(false);
    $pageNum.html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
  });

  addCasefiles(true);
  addTagsByPage(true);
  $pageNum.html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
  displayOfficerMessage();
});
