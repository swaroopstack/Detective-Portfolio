// Random torn-paper clip-path polygon.
export function torn(){const p=[],n=7,j=()=>Math.random()<.12?4+Math.random()*4:Math.random()*2;for(let i=0;i<=n;i++)p.push(`${i/n*100}% ${j()}%`);for(let i=1;i<=n;i++)p.push(`${100-j()}% ${i/n*100}%`);for(let i=n-1;i>=0;i--)p.push(`${i/n*100}% ${100-j()}%`);for(let i=n-1;i>0;i--)p.push(`${j()}% ${i/n*100}%`);return `polygon(${p.join(',')})`}
