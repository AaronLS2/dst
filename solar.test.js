import test from 'node:test';
import assert from 'node:assert/strict';
import {CITIES,isDST,sun,lightAt,remainingMinutes,timeHours,formatTime} from './solar.js';
test('2026 transition dates use the correct daytime offset',()=>{
  assert.equal(isDST(66),false);assert.equal(isDST(67),true);assert.equal(isDST(304),true);assert.equal(isDST(305),false);
});
test('DST shifts clock times exactly one hour without changing day length',()=>{
  for(const c of Object.values(CITIES))for(let day=1;day<=365;day++){
    const a=sun(day,c,c.std),b=sun(day,c,c.std+1),t=sun(day,c,c.std,96);
    assert.ok(a.every(Number.isFinite));assert.ok(Math.abs(b[0]-a[0]-1)<1e-10);assert.ok(Math.abs(b[1]-a[1]-1)<1e-10);
    assert.ok(t[0]<a[0]&&a[0]<a[1]&&a[1]<t[1]);assert.ok(t[0]>0&&t[1]<24);
  }
});
test('DC solstice times are in expected approximate ranges',()=>{
  const winter=sun(355,CITIES.dc,-5),summer=sun(172,CITIES.dc,-4);
  assert.ok(winter[0]>7.25&&winter[0]<7.5);assert.ok(winter[1]>16.65&&winter[1]<16.95);
  assert.ok(summer[0]>5.6&&summer[0]<5.9);assert.ok(summer[1]>20.45&&summer[1]<20.75);
});
test('twilight is distinguished from night and daylight',()=>{
  assert.equal(lightAt(5,[6,18],[5.5,18.5]),'Night');assert.equal(lightAt(5.75,[6,18],[5.5,18.5]),'Twilight');assert.equal(lightAt(12,[6,18],[5.5,18.5]),'Daylight');assert.equal(lightAt(18.25,[6,18],[5.5,18.5]),'Twilight');
});
test('remaining daylight never includes pre-sunrise time or goes negative',()=>{
  assert.equal(remainingMinutes(3,[6,18]),720);assert.equal(remainingMinutes(17.5,[6,18]),30);assert.equal(remainingMinutes(20,[6,18]),0);
});
test('schedule parsing and minute rollover',()=>{
  assert.equal(timeHours('00:00'),0);assert.equal(timeHours('23:59'),23+59/60);for(const x of ['','25:00','12:60','bad'])assert.equal(timeHours(x),null);
  assert.equal(formatTime(11+59.6/60),'12:00 pm');assert.equal(formatTime(0),'12:00 am');
});
