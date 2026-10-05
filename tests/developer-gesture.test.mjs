import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {nextCountdownTap} from '../src/data/birthday.js';
function run(times){let state={count:0,started:0};let unlocked=false;for(const time of times){state=nextCountdownTap(state,time);if(state.count===10)unlocked=true;}return {state,unlocked};}
test('ten taps within six seconds activate, but nine and ordinary single/double taps do not',()=>{assert.equal(run(Array.from({length:10},(_,i)=>1000+i*500)).unlocked,true);for(const count of [1,2,9])assert.equal(run(Array.from({length:count},(_,i)=>1000+i*500)).unlocked,false);assert.equal(run(Array.from({length:10},(_,i)=>1000+i*(6000/9))).unlocked,true);});
test('ten taps beyond six seconds fail; the next tap begins a fresh sequence',()=>{const late=Array.from({length:10},(_,i)=>1000+i*700);const result=run(late);assert.equal(result.unlocked,false);assert.deepEqual(result.state,{count:1,started:7300});assert.equal(run([...late,...Array.from({length:9},(_,i)=>7500+i*200)]).unlocked,true);});
test('the actual countdown handler preserves session activation and filters non-primary clicks',()=>{
 const source=readFileSync(new URL('../src/components/BirthdayGate.jsx',import.meta.url),'utf8');
 const hook=source.slice(source.indexOf('export function useCountdownPreview'),source.indexOf('export function DailyLoveLetters')).replace('export function','function');
 const stored=new Map();let time=1000,unlocks=0;
 const tap=runInNewContext(hook+'; useCountdownPreview(onUnlock);',{useRef:value=>({current:value}),nextCountdownTap,performance:{now:()=>time},sessionStorage:{setItem:(k,v)=>stored.set(k,v)},onUnlock:()=>unlocks++});
 for(let i=0;i<20;i++)tap({button:2});assert.equal(unlocks,0);
 for(let i=0;i<9;i++){tap({button:0});time+=200;}assert.equal(unlocks,0);tap({button:0});assert.equal(unlocks,1);assert.equal(stored.get('yael-developer'),'1');
 tap({button:0});assert.equal(unlocks,1);
 assert.match(source,/className="countdown" onClick=\{countdownTap\}/);
 assert.ok(!/DeveloperUnlock|nextCorner|clientX|clientY|addEventListener\('pointerdown'/.test(source));
 const app=readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');assert.match(app,/excludeAnalytics\(\);setDeveloper\(true\)/);assert.match(app,/<BirthdayGate now=\{now\} date=\{date\} onUnlock=\{unlock\}\/>/);assert.match(app,/!developer && date < BIRTHDAY/);
});
