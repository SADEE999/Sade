/* SADEE PRO STORE - mobile-safe video controls */
(() => {
  'use strict';
  const SPEEDS = [1, 1.5, 2];
  function attach(video) {
    if (!(video instanceof HTMLVideoElement) || video.dataset.sadeeControls === '2') return;
    video.dataset.sadeeControls = '2'; video.controls = false;
    const panel = document.createElement('div');
    panel.className = 'sadee-video-controls'; panel.setAttribute('role','group'); panel.setAttribute('aria-label','Video controls');
    panel.innerHTML = `<button type="button" data-sv="play" aria-label="Play video">▶</button><button type="button" data-sv="mute" class="sv-sound" aria-label="Tap to enable sound" aria-pressed="false">TAP FOR SOUND</button><button type="button" data-sv="speed" aria-label="Playback speed">1x</button><input data-sv="seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek video"><button type="button" data-sv="replay" aria-label="Replay video">↻</button><button type="button" data-sv="fullscreen" aria-label="Fullscreen">⛶</button>`;
    video.insertAdjacentElement('afterend', panel);
    const $=s=>panel.querySelector(s), play=$('[data-sv="play"]'), sound=$('[data-sv="mute"]'), speed=$('[data-sv="speed"]'), seek=$('[data-sv="seek"]'); let speedIndex=0;
    function refresh(){play.textContent=video.paused?'▶':'Ⅱ';play.setAttribute('aria-label',video.paused?'Play video':'Pause video');const muted=video.muted||video.volume<=0;sound.textContent=muted?'TAP FOR SOUND':'SOUND ON';sound.setAttribute('aria-label',muted?'Tap to enable sound':'Turn sound off');sound.setAttribute('aria-pressed',String(!muted));if(Number.isFinite(video.duration)&&video.duration>0&&!seek.matches(':active'))seek.value=String(Math.round(video.currentTime/video.duration*1000));}
    async function enableSound(){video.defaultMuted=false;video.removeAttribute('muted');video.muted=false;video.volume=1;try{await video.play();}catch(_){sound.textContent='TAP VIDEO';sound.setAttribute('aria-label','Tap the video to start playback with sound');}refresh();}
    panel.querySelectorAll('button[data-sv]').forEach(button=>button.addEventListener('click',async event=>{event.preventDefault();event.stopPropagation();const a=button.dataset.sv;if(a==='play'){if(video.paused){try{await video.play();}catch(_){}}else video.pause();}else if(a==='mute'){if(video.muted||video.volume<=0)await enableSound();else{video.muted=true;refresh();}}else if(a==='speed'){speedIndex=(speedIndex+1)%SPEEDS.length;video.playbackRate=SPEEDS[speedIndex];speed.textContent=SPEEDS[speedIndex]+'x';}else if(a==='replay'){try{video.currentTime=0;await video.play();}catch(_){}}else if(a==='fullscreen'){try{if(document.fullscreenElement)await document.exitFullscreen();else if(video.requestFullscreen)await video.requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();}catch(_){}}refresh();}));
    seek.addEventListener('input',()=>{if(Number.isFinite(video.duration)&&video.duration>0)video.currentTime=Number(seek.value)/1000*video.duration;});
    ['play','pause','volumechange','timeupdate','loadedmetadata','durationchange','ended','emptied'].forEach(n=>video.addEventListener(n,refresh));const sync=()=>{panel.hidden=video.hidden;};new MutationObserver(sync).observe(video,{attributes:true,attributeFilter:['hidden']});sync();
    // Try audible autoplay first. Browsers may reject it until a visitor taps.
    video.defaultMuted=false;video.removeAttribute('muted');video.muted=false;video.volume=1;const attempt=video.play();if(attempt&&typeof attempt.catch==='function')attempt.catch(async()=>{video.muted=true;try{await video.play();}catch(_){}refresh();});refresh();
  }
  function scan(node){if(!node||node.nodeType!==1)return;if(node.matches('video'))attach(node);node.querySelectorAll?.('video').forEach(attach);}
  function start(){scan(document.body);new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(scan))).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
