(()=>{
      const root=document.getElementById('jet-index-chart');
      const data=JSON.parse(root.querySelector('#jet-index-data').textContent);
      const select=root.querySelector('#jet-index-metric');
      const bars=root.querySelector('#jet-index-bars');
      const scope=root.querySelector('#jet-index-scope');
      const axis=root.querySelector('#jet-index-axis');
      data.benchmarks.forEach(b=>{const o=document.createElement('option');o.value=b.id;o.textContent=b.name;select.append(o)});
      const elements=new Map();
      const names=['Jet 4B',...data.models.map(m=>m.name)];
      names.forEach(name=>{
        const row=document.createElement('div');row.setAttribute('role','listitem');row.className='chart-row'+(name==='Jet 4B'?' jet':name==='Jev'?' jev':'');
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
        scope.textContent=overall?'Jet: unranked · full 40-benchmark index not yet measured.':'Jet: '+b.n+' sampled requests · references: full benchmarks · different case sets, no matched-case ranking.';
        axis.textContent=overall?'Decision Index score (0–100)':b.metric+' (0–100)';
        const values=[{name:'Jet 4B',score:overall?null:b.score*100,n:overall?null:b.n}];
        data.models.forEach(m=>{const r=b?m.results[b.id]:null;values.push({name:m.name,score:overall?m.overall:r&&r.metric===b.metric&&r.score!==null?r.score*100:null,n:r?r.n:null})});
        values.sort((a,c)=>a.name==='Jet 4B'?-1:c.name==='Jet 4B'?1:(c.score??-1)-(a.score??-1));
        const descriptions=[];
        values.forEach(v=>{
          const e=elements.get(v.name);bars.append(e.row);
          e.title.textContent=v.name+(v.name==='Jet 4B'&&!overall?' · sample':'');
          e.value.textContent=v.score===null?'Not scored':v.score.toFixed(1);
          e.track.hidden=v.score===null;
          e.detail.textContent=v.n?v.n.toLocaleString()+' cases/requests'+(v.name==='Jet 4B'?' · sampled':' · published'):'';
          if(initial)e.fill.style.transition='none';
          e.fill.style.width=(v.score??0)+'%';
          e.row.setAttribute('title',v.name+': '+(v.score===null?'No official index score':v.score.toFixed(2))+(v.n?' · '+v.n+' cases/requests':'')+(v.name==='Jet 4B'&&!overall?' · sample only':''));
          descriptions.push(e.title.textContent+': '+e.value.textContent);
        });
        bars.setAttribute('aria-label',(overall?'Official overall index. Jet is not scored. ':'Sampled Jet versus full-benchmark references. ')+descriptions.join('; '));
        if(initial)requestAnimationFrame(()=>elements.forEach(e=>e.fill.style.transition=''));
      }
      render('50', true);
      select.addEventListener('change',()=>render(select.value));
    })();
