const EvidenceTagsJSON = require('../json/evidencetags.json');

var $evidenceTags = [];

function addTag(id, $panel) {
  $evidenceTags.push($('<div class="evidence-tag">').html(
    '<img src="assets/tag.png">' +
    '<div class="case-num" style="top:' + (5 + $evidenceTags.length * 124) + 'px;">' + EvidenceTagsJSON[id].caseNum + '</div>' +
    '<div class="date" style="top:' + (5 + $evidenceTags.length * 124) + 'px;">' + EvidenceTagsJSON[id].date + '</div>' +
    '<div class="type" style="top:' + (60 + $evidenceTags.length * 124) + 'px;">' + EvidenceTagsJSON[id].type + '</div>').appendTo($panel));
}

$(document).ready(function() {
  var $evidencePanel = $('#evidence-panel');
  for (var i = 0; i < 5; i++) {
    addTag(0, $evidencePanel);
  }
});
