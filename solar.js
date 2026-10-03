// NOAA's approximate fractional-year solar equations, evaluated at local noon.
export const CITIES = {
  dc: {name:'Washington, DC',lat:38.907,lng:-77.037,std:-5},
  ind: {name:'Indianapolis, IN',lat:39.768,lng:-86.158,std:-5},
  sf: {name:'Sioux Falls, SD',lat:43.546,lng:-96.731,std:-6}
};
export function isDST(day) { return day >= 67 && day < 305; }
export function sun(day, city, offset, zenith=90.833) {
  const rad=Math.PI/180, g=2*Math.PI/365*(day-1);
  const eq=229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g));
  const d=.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g);
  const ha=Math.acos(Math.cos(zenith*rad)/(Math.cos(city.lat*rad)*Math.cos(d))-Math.tan(city.lat*rad)*Math.tan(d))/rad;
  return [(720-4*(city.lng+ha)-eq)/60+offset,(720-4*(city.lng-ha)-eq)/60+offset];
}
export function lightAt(hour, daylight, twilight) {
  if(hour>=daylight[0] && hour<=daylight[1]) return 'Daylight';
  if(hour>=twilight[0] && hour<=twilight[1]) return 'Twilight';
  return 'Night';
}
export function remainingMinutes(hour, daylight) { return Math.max(0,Math.round((daylight[1]-Math.max(hour,daylight[0]))*60)); }
export function timeHours(value) {
  if(!/^\d{2}:\d{2}$/.test(value)) return null;
  const [h,m]=value.split(':').map(Number);
  return h<24 && m<60 ? h+m/60 : null;
}
export function formatTime(hour) {
  const total=((Math.round(hour*60)%1440)+1440)%1440;
  const h=Math.floor(total/60),m=total%60;
  return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'pm':'am'}`;
}
export function duration(minutes) { return minutes>=60 ? `${Math.floor(minutes/60)}h${minutes%60?' '+minutes%60+'m':''}` : `${minutes}m`; }
