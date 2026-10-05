import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {nextCorner} from '../src/data/birthday.js';
const sequence=['tr','tl','tr','tl','tr','tl','tr','tl','tr','tl'];
const empty=()=>({index:0,started:0});
function run(corners,start=1000){let state=empty();const progress=[];corners.forEach((corner,i)=>{state=nextCorner(state,corner,start+i*200);progress.push(state.index);});return {state,progress};}
test('only the full ten alternating top-corner taps succeed, right first',()=>{const {progress,state}=run(sequence);assert.deepEqual(progress,[1,2,3,4,5,6,7,8,9,10]);assert.equal(state.index,10);assert.equal(sequence.filter(x=>x==='tr').length,5);assert.equal(sequence.filter(x=>x==='tl').length,5);});
test('wrong order, either bottom corner, and ordinary content taps reset',()=>{for(const wrong of ['tr','br','bl','']){let state=run(['tr','tl','tr']).state;state=nextCorner(state,wrong,1700);assert.deepEqual(state,empty());assert.equal(nextCorner(state,'tl',1800).index,0);}assert.ok(!run(['tl',...sequence.slice(1)]).progress.includes(10));assert.ok(!run(['tl','tr','br','bl','tl','tr','br','bl']).progress.includes(10));});
test('the existing ten-second window is unchanged and expiration starts fresh',()=>{let state=nextCorner(empty(),'tr',1000);state=nextCorner(state,'tl',11000);assert.equal(state.index,2);state=nextCorner(state,'tr',11001);assert.deepEqual(state,{index:1,started:11001});assert.deepEqual(nextCorner(run(['tr']).state,'tl',11001),empty());});
test('normal tapping among content and corners does not accumulate a preview unlock',()=>{const normal=['','tr','','tl','','tr','','tl','br','bl','tr','tr','tl','','tr','','tl'];assert.ok(!run(normal).progress.includes(10));});

test('actual hidden pointer handler uses only top corners, resets content taps, ignores scrolling, and preserves activation callback',()=>{
 const source=readFileSync(new URL('../src/components/BirthdayGate.jsx',import.meta.url),'utf8');
 const component=source.slice(source.indexOf('export function DeveloperUnlock'),source.indexOf('export function DailyLoveLetters')).replace('export function','function');
 const listeners=new Map(),stored=new Map();let time=1000,unlocks=0;
 runInNewContext(component+'; DeveloperUnlock({onUnlock});',{
  useRef:value=>({current:value}),useEffect:effect=>effect(),nextCorner,
  window:{innerWidth:390,innerHeight:844,addEventListener:(name,handler)=>listeners.set(name,handler),removeEventListener:name=>listeners.delete(name)},
  performance:{now:()=>time},sessionStorage:{setItem:(key,value)=>stored.set(key,value)},onUnlock:()=>unlocks++
 });
 assert.deepEqual([...listeners.keys()],['pointerdown']);
 const tap=(x,y)=>{time+=100;listeners.get('pointerdown')({button:0,isPrimary:true,clientX:x,clientY:y});};
 for(let i=0;i<20;i++)listeners.get('scroll')?.({});assert.equal(unlocks,0);
 tap(389,1);tap(1,1);tap(195,400);sequence.slice(2).forEach(c=>tap(c==='tr'?389:1,1));assert.equal(unlocks,0);
 tap(1,843);sequence.slice(0,9).forEach(c=>tap(c==='tr'?389:1,1));assert.equal(unlocks,0);
 tap(1,1);assert.equal(unlocks,1);assert.equal(stored.get('yael-developer'),'1');
});
