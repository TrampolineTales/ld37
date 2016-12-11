const EvidenceTagsJSON = require('../json/evidencetags.json');
const CaseFilesJSON = require('../json/casefiles.json');
const LevelsJSON = require('../json/levels.json');

var $evidenceTags = [];
var remainingTags = [];
var submittedTagIDs = [];
var currentPage = 1;
var currentLevel = 1;
var animationNum = 0;

function addClickableText(text, func, className) {
  return $('<div>').html('<span class="' + className +'">' + text + '</span>').click(func);
}

function submitTag() { //add animation
  for (var i = (currentPage - 1) * 4; i < $evidenceTags.length; i++) {
    if (i == this.$div.data('id')) {
      submittedTagIDs.push($evidenceTags[i].data('id'));
      remainingTags.splice(i, 1);
      if (($evidenceTags.length % 4 == 0) && ($evidenceTags.length > 0) && (currentPage == Math.ceil(remainingTags.length / 4))) {
        currentPage--;
      }
      break;
    }
  }
  addTagsByPage(this.$arrowLeft, this.$arrowRight, false);
}

function addCasefiles() {
  var $caseFileMonitor = $('#casefile-monitor');
  $caseFileMonitor.html('');
  $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html(addClickableText('Casefiles', undefined, 'top-text'))).appendTo($caseFileMonitor);

  for (var i = 0; i < LevelsJSON[currentLevel - 1].caseFiles.length; i++) {
    $('<div>').attr('class', 'casefile-text').html(addClickableText(CaseFilesJSON[[LevelsJSON[currentLevel - 1].caseFiles[i]]].title, displayCasefileData, 'text').data('id', LevelsJSON[currentLevel - 1].caseFiles[i])).appendTo($caseFileMonitor);
  }

  $('<div>').attr('id', 'casefile-bottombar').html($('<div>').attr('class', 'bar').html(addClickableText('CasefileOS-v0.37', function() {
    $caseFileMonitor.html('');
    $('<div>').attr('id', 'casefile-topbar').html($('<div>').attr('class', 'bar').html('<span class="top-text">CasefileOS-v0.37</span>')).appendTo($caseFileMonitor);
    $('<div>').html('<p>The Evidence Room was developed in 48 hours by <a href="http://TrampolineTales.com/" target="_blank" class="text">TrampolineTales</a> for <a href="https://ldjam.com/" target="_blank" class="text">Ludum Dare 37</a>.</p>').appendTo($caseFileMonitor);
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

function addTag(id, $arrowLeft, $arrowRight) {
  $evidenceTags.push($('<div class="evidence-tag">').html(
    '<img src="assets/tag.png">' +
    '<div class="case-num" style="top:' + (20 + $evidenceTags.length * 139) + 'px;">' + EvidenceTagsJSON[id].caseNum + '</div>' +
    '<div class="date" style="top:' + (20 + $evidenceTags.length * 139) + 'px;">' + EvidenceTagsJSON[id].date + '</div>' +
    '<div class="type" style="top:' + (84 + $evidenceTags.length * 139) + 'px;">' + EvidenceTagsJSON[id].type + '</div>').data('id', id).appendTo($('#evidence-panel')));
  $evidenceTags[$evidenceTags.length - 1].click(
    function() {
      submitTag.bind({$div: this.$div, $arrowLeft: $arrowLeft, $arrowRight: $arrowRight})()
    }.bind({$div: $evidenceTags[$evidenceTags.length - 1]}));
}

function addTagsByPage($arrowLeft, $arrowRight, initLevel) {
  $arrowLeft.detach();
  $arrowRight.detach();
  $evidenceTags.map((el)=> el.remove());
  $evidenceTags = [];

  if (initLevel) {
    var tags = LevelsJSON[currentLevel - 1].evidenceTags;
    remainingTags = LevelsJSON[currentLevel - 1].evidenceTags;
  } else {
    var tags = remainingTags;
  }

  for (var i = 0; i < tags.length - (currentPage - 1) * 4; i++) {
    addTag(tags[i], $arrowLeft, $arrowRight);
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
    addTagsByPage($arrowLeft, $arrowRight, false);
      $pageNum.html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
  });
  var $arrowRight = $('<img>').attr('class', 'panel').attr('id', 'arrow-right').attr('src', 'assets/arrow-right.png').click(function() {
    currentPage++;
    addTagsByPage($arrowLeft, $arrowRight, false);
    $pageNum.html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
  });

  addCasefiles();
  addTagsByPage($arrowLeft, $arrowRight, true);
  $pageNum.html(currentPage + '/' + Math.ceil(LevelsJSON[currentLevel - 1].evidenceTags.length / 4));
});
