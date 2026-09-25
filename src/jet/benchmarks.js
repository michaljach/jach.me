(()=>{
  const root=document.getElementById('jet-index-chart');
  const data=JSON.parse(root.querySelector('#jet-index-data').textContent);
  const select=root.querySelector('#jet-index-metric');
  const bars=root.querySelector('#jet-index-bars');
  const scope=root.querySelector('#jet-index-scope');
  const axis=root.querySelector('#jet-index-axis');
  const description=root.querySelector('#jet-index-description');
  data.benchmarks.forEach(b=>{const o=document.createElement('option');o.value=b.id;o.textContent=b.name+(b.sampled?' · sample':'');select.append(o)});
  const elements=new Map();
  ['Jet',...data.models.map(m=>m.name)].forEach(name=>{
    const row=document.createElement('div');row.setAttribute('role','listitem');row.className='chart-row'+(name==='Jet'?' jet':name==='Jev'?' jev':'');
    const label=document.createElement('div');label.className='row-label';
    const title=document.createElement('span');title.className='row-name';
    const value=document.createElement('span');value.className='row-value tabular-nums';
    const detail=document.createElement('div');detail.className='row-detail text-small text-muted';
    const track=document.createElement('div');track.className='bar-track';
    const fill=document.createElement('div');fill.className='bar-fill';track.append(fill);
    label.append(title,value);row.append(label,track,detail);bars.append(row);
    elements.set(name,{row,title,value,track,fill,detail});
  });
  function render(key,initial=false){
    const b=data.benchmarks.find(x=>x.id===key);const overall=!b;
    select.value=overall?'overall':key;
    description.textContent=overall?'Archived Decision Index 0.1, chance-corrected balanced score.':b.description;
    scope.textContent=overall?'Jet: not scored overall. Reference scores come from the archived 0.1 panel.':
      'Jet: '+b.answered.toLocaleString()+' / '+b.n.toLocaleString()+' requests answered'+(b.unsupported?' · '+b.unsupported+' unsupported':'')+
      (b.sampled?' · sampled complete queries; different denominators.':' · full available reconstruction; identical source cases unverified.');
    axis.textContent=overall?'Chance-corrected Decision Index 0.1 (0–100)':b.metric+' (0–100)';
    const values=[{name:'Jet',score:overall||b.score===null?null:b.score*100,n:overall?null:b.n}];
    data.models.forEach(m=>{const r=b?m.results[b.id]:null;values.push({name:m.name,score:overall?m.overall:r&&r.metric===b.metric&&r.score!==null?r.score*100:null,n:r?r.n:null})});
    values.sort((a,c)=>a.name==='Jet'?-1:c.name==='Jet'?1:(c.score??-1)-(a.score??-1));
    const descriptions=[];
    values.forEach(v=>{
      const e=elements.get(v.name);bars.append(e.row);
      e.title.textContent=v.name+(v.name==='Jet'&&b?.sampled?' · sample':'');
      e.value.textContent=v.score===null?'Not scored':v.score.toFixed(1);
      e.track.hidden=v.score===null;
      e.detail.textContent=v.n?v.n.toLocaleString()+' cases/requests'+(v.name==='Jet'?(b.sampled?' · sample':' · local'):' · published')+(b?.id==='40'&&v.name!=='Jet'?' across tracks; English A score':''):'';
      if(initial)e.fill.style.transition='none';
      e.fill.style.width=(v.score??0)+'%';
      e.row.title=v.name+': '+(v.score===null?'Not scored':v.score.toFixed(2))+(v.n?' · '+v.n+' requests':'');
      descriptions.push(e.title.textContent+': '+e.value.textContent);
    });
    bars.setAttribute('aria-label',(overall?'Archived overall index; Jet is not scored. ':'Local Jet evaluation and published references. ')+descriptions.join('; '));
    if(initial)requestAnimationFrame(()=>elements.forEach(e=>e.fill.style.transition=''));
  }
  render('50',true);select.addEventListener('change',()=>render(select.value));
})();
