import test from 'node:test';
import assert from 'node:assert/strict';
import {summarize,eventLabel} from '../src/analytics/dashboard.js';
test('dashboard groups by Berlin day, averages opened letter sessions, and keeps 7 calendar dates across DST',()=>{
 const now=Date.parse('2026-10-26T00:10:00+01:00');
 const visits=[{startedAt:now,activeSeconds:100,maxScrollPercent:100,loveLetterOpened:true,loveLetterActiveSeconds:40,heartsDiscovered:3},{startedAt:Date.parse('2026-10-25T23:30:00+01:00'),activeSeconds:20,maxScrollPercent:50,loveLetterOpened:false,heartsDiscovered:1}];
 const stats=summarize(visits,now);assert.equal(stats.today,1);assert.equal(stats.week,2);assert.equal(stats.average,60);assert.equal(stats.longest,100);assert.equal(stats.scroll,75);assert.equal(stats.letterAverage,40);assert.equal(stats.hearts,4);assert.equal(new Set(stats.chart.map(d=>d.day)).size,7);assert.equal(stats.chart.at(-1).day,'2026-10-26');
 assert.equal(eventLabel({name:'section_left',value:'brief'}),'Love Letter verlassen');
});
