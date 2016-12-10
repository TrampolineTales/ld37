(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../json/evidencetags.json":2}],2:[function(require,module,exports){
module.exports=[
  {
    "caseNum": "00001",
    "date": "September",
    "type": "Murder Weapon"
  }
]

},{}]},{},[1]);
