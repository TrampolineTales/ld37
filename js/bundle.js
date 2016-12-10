(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const EvidenceTagsJSON = require('../json/evidencetags.json');
const CaseFilesJSON = require('../json/casefiles.json');
const LevelsJSON = require('../json/levels.json');

var $evidenceTags = [];
var submittedTagIDs = [];
var currentPage = 1;
var currentLevel = 1;
var animationNum = 0;

function submitTag() { //add animation
  for (var i = 0; i < $evidenceTags.length; i++) {
    if (i == $(this).data('id')) {
      $(this).remove();
      submittedTagIDs.push($evidenceTags.splice(i, 1)[0].data('id'));
      break;
    }
  }
}

function addCasefiles() {
  var $caseFileMonitor = $('#casefile-monitor');
  $caseFileMonitor.html('');
  $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html('<span class="top-text">Casefiles</span>')).appendTo($caseFileMonitor);
  $('<div>').attr('id', 'casefile-bottombar').html($('<div>').attr('class', 'bar').html('<span class="topbar-text">CrimeOS-v1.0</span>').click(function() {
    $caseFileMonitor.html('<p>The Evidence Room was developed in 48 hours by <a href="http://TrampolineTales.com/" target="_blank" class="text">TrampolineTales</a> for <a href="https://ldjam.com/" target="_blank" class="text">Ludum Dare 37</a>.</p>');
    $('#casefile-topbar').html($('<div>').attr('class', 'bar').html('<span class="top-text">About</span>'));
    $('#casefile-bottombar').html($('<div>').html('<span class="topbar-text">Back</span>')).click(addCasefiles);
  })).appendTo($caseFileMonitor);
  for (var i = 0; i < LevelsJSON[currentLevel - 1].caseFiles.length; i++) {
    $('<div>').attr('class', 'casefile-text').html('<span class="text">' + CaseFilesJSON[[LevelsJSON[currentLevel - 1].caseFiles[i]]].title).click(displayCasefileData).data('id', LevelsJSON[currentLevel - 1].caseFiles[i]).appendTo($caseFileMonitor);
  }
}

function displayCasefileData() {
  switch (CaseFilesJSON[$(this).data('id')].type) {
    case 'newspaper':
      $('#casefile-topbar').html($('<div>').attr('class', 'bar').html('<span class="top-text">' + CaseFilesJSON[$(this).data('id')].title + '</span>' + '<span class="top-text casefile-date">' + CaseFilesJSON[$(this).data('id')].date + '</span>'));
      $('#casefile-bottombar').html($('<div>').attr('class', 'bar').html('<span class="topbar-text">Back</span>')).click(addCasefiles);
      $('#casefile-monitor').html('<div id="newspaper-icon"></div>' + '<div class="file-text">' + CaseFilesJSON[$(this).data('id')].text + '</div>');
    break;
    default:
      $('#casefile-monitor').html($('<div>').attr('class', 'file-text').html(CaseFilesJSON[$(this).data('id')].text));
  }
}

function addTag(id) {
  $evidenceTags.push($('<div class="evidence-tag">').html(
    '<img src="assets/tag.png">' +
    '<div class="case-num" style="top:' + (20 + $evidenceTags.length * 139) + 'px;">' + EvidenceTagsJSON[id].caseNum + '</div>' +
    '<div class="date" style="top:' + (20 + $evidenceTags.length * 139) + 'px;">' + EvidenceTagsJSON[id].date + '</div>' +
    '<div class="type" style="top:' + (84 + $evidenceTags.length * 139) + 'px;">' + EvidenceTagsJSON[id].type + '</div>').data('id', id).click(submitTag).appendTo($('#evidence-panel')));
}

function addTagsByPage($arrowLeft, $arrowRight) {
  $arrowLeft.detach();
  $arrowRight.detach();
  $evidenceTags.map((el)=> el.remove());
  $evidenceTags = [];

  for (var i = 0; i < LevelsJSON[currentLevel - 1].evidenceTags.length - (currentPage - 1) * 4; i++) {
    addTag(LevelsJSON[currentLevel - 1].evidenceTags[i]);
    if (i == 3) {
      $arrowRight.appendTo($('body'));
      break;
    }
  }

  if (currentPage > 1) {
    $arrowLeft.appendTo($('body'));
  }
}

$(document).ready(function() {
  var $pageNum = $('#page-num');
  var $arrowLeft = $('<img>').attr('class', 'panel').attr('id', 'arrow-left').attr('src', 'assets/arrow-left.png').click(function() {
    currentPage--;
    addTagsByPage($arrowLeft, $arrowRight);
    $pageNum.html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
  });
  var $arrowRight = $('<img>').attr('class', 'panel').attr('id', 'arrow-right').attr('src', 'assets/arrow-right.png').click(function() {
    currentPage++;
    addTagsByPage($arrowLeft, $arrowRight);
    $pageNum.html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
  });

  addCasefiles();
  addTagsByPage($arrowLeft, $arrowRight);
  $pageNum.html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
});

},{"../json/casefiles.json":2,"../json/evidencetags.json":3,"../json/levels.json":4}],2:[function(require,module,exports){
module.exports=[
  {
    "caseNum": 23535,
    "type": "newspaper",
    "date": "1/10/85",
    "title": "\"Tragedy at the Opera!\"",
    "text": "Tragedy struck yesterday at the Sunday showing at the Gregory Opera Theatre. During the pivotal scene, Frank Portsman (48) was pushed from the balcony! Police are still questioning those who were in the same wing as Portsman."
  }
]

},{}],3:[function(require,module,exports){
module.exports=[
  {
    "caseNum": "00001",
    "date": "September",
    "type": "Murder Weapon"
  },
  {
    "caseNum": "23535",
    "date": "January",
    "type": "Portsman's Cufflink"
  }
]

},{}],4:[function(require,module,exports){
module.exports=[
  {
    "evidenceTags": [0, 1],
    "neededTags": [0],
    "caseFiles": [0]
  }
]

},{}]},{},[1]);
