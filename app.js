
(function(){
  const temStorage = typeof window !== 'undefined' && window.storage && typeof window.storage.get === 'function';
  const Guardar = {
    async ler(chave, compartilhado){
      if(temStorage){
        try{ const r = await window.storage.get(chave, !!compartilhado); return r && r.value ? JSON.parse(r.value) : null; }
        catch(e){ return null; }
      }
      try{ const v = localStorage.getItem(chave); return v ? JSON.parse(v) : null; }catch(e){ return null; }
    },
    async gravar(chave, valor, compartilhado){
      if(temStorage){
        try{ await window.storage.set(chave, JSON.stringify(valor), !!compartilhado); return true; }catch(e){}
      }
      try{ localStorage.setItem(chave, JSON.stringify(valor)); return true; }catch(e){ return false; }
    }
  };

  const CHAVE_CHAT = 'bestsale:chat';
  const CHAVE_PRODUTOS = 'bestsale:produtos';
  const CHAVE_LANC = 'bestsale:lancamentos';
  const CHAVE_PERFIL = 'bestsale:perfil';
  const CHAVE_MATRICULAS = 'bestsale:matriculas';
  const CHAVE_CATALOGO = 'comunidade:cursos';
  const CHAVE_IDIOMA = 'bestsale:idioma';
  const CHAVE_METAS = 'bestsale:metas';
  const CHAVE_ESTOQUE = 'bestsale:estoque';
  const CHAVE_AVALIACOES = 'comunidade:avaliacoes';
  const CHAVE_DESAFIO = 'bestsale:desafio';
  const CHAVE_ALERTAS_PRECO = 'bestsale:alertas-preco';
  const CHAVE_LEMBRETES = 'bestsale:lembretes';

  const IDIOMAS = [
    { codigo:'pt-BR', nome:'Português (Brasil)' },
    { codigo:'pt-PT', nome:'Português (Portugal)' },
    { codigo:'en-US', nome:'English (US)' },
    { codigo:'es-ES', nome:'Español' },
    { codigo:'fr-FR', nome:'Français' },
    { codigo:'it-IT', nome:'Italiano' },
    { codigo:'de-DE', nome:'Deutsch' },
    { codigo:'zh-CN', nome:'中文' }
  ];
  let idiomaAtual = 'pt-BR';

  const CATEGORIAS = ['Negócios e vendas','Tecnologia e IA','Design e criação','Trabalho manual','Saúde e bem-estar','Finanças','Idiomas','Outros'];
  const CORES_CAPA = ['linear-gradient(135deg,#FFBE00,#FF9F5A)','linear-gradient(135deg,#7CFFC4,#3FBFA0)','linear-gradient(135deg,#FFC94D,#FF6B6B)','linear-gradient(135deg,#8FD3FF,#7CFFC4)','linear-gradient(135deg,#FF9F5A,#FFE066)'];
  function corCapa(id){ let h=0; for(let i=0;i<id.length;i++) h = (h*31 + id.charCodeAt(i)) >>> 0; return CORES_CAPA[h % CORES_CAPA.length]; }

  let mensagens = [];
  let produtos = [];
  let lancamentos = [];
  let perfil = { nome:'', bio:'' };
  let matriculas = [];
  let catalogo = [];
  let metas = [];
  let estoque = [];
  let avaliacoes = [];
  let desafio = null; // { tipo, diasMarcados: [], iniciado }
  let alertasPreco = [];
  let lembretes = [];
  let carregando = false;
  let anexoPendente = null;
  let editandoProdutoId = null;
  let vendaProdutoId = null;
  let depositoMetaId = null;
  let filtroAtual = 'Todos';
  let telaAtual = 'chat';

  const $ = (id) => document.getElementById(id);
  function esc(t){ const d = document.createElement('div'); d.textContent = t == null ? '' : String(t); return d.innerHTML; }
  function moeda(v){ return (Number(v)||0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); }
  function idNovo(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

  function abrir(id){ $(id).classList.add('aberto'); }
  function fechar(id){ $(id).classList.remove('aberto'); }
  document.querySelectorAll('[data-fecha]').forEach(b => b.addEventListener('click', () => fechar(b.dataset.fecha)));
  document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', ev => { if(ev.target === o) o.classList.remove('aberto'); }));

  function toast(texto, ms){
    const el = $('status-mic');
    el.textContent = texto;
    el.classList.add('visivel');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('visivel'), ms || 3200);
  }

  function formatarLinha(txt){
    let s = esc(txt);
    const links = [];
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (m, r, u) => { links.push('<a href="'+u+'" target="_blank" rel="noopener">'+r+'</a>'); return '\u0000'+(links.length-1)+'\u0000'; });
    s = s.replace(/(https?:\/\/[^\s<]+)/g, u => '<a href="'+u+'" target="_blank" rel="noopener">'+u+'</a>');
    s = s.replace(/\u0000(\d+)\u0000/g, (m,i) => links[Number(i)]);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    return s;
  }

  function barrasGrafico(itens, formatador){
    const max = Math.max.apply(null, itens.map(i => Math.abs(i.valor)).concat([1]));
    return itens.map(i => '<div class="linha-grafico">'
      + '<div class="rotulo-grafico">' + esc(i.rotulo) + '</div>'
      + '<div class="trilha-grafico"><div class="barra-grafico" style="width:' + Math.max(4, (Math.abs(i.valor)/max)*100) + '%"></div></div>'
      + '<div class="valor-grafico">' + (formatador ? formatador(i.valor) : i.valor.toLocaleString('pt-BR')) + '</div>'
      + '</div>').join('');
  }

  function renderizarGraficoTexto(conteudo){
    const linhas = conteudo.split('\n').map(l => l.trim()).filter(Boolean);
    let titulo = ''; const itens = [];
    linhas.forEach(l => {
      const t = /^t[íi]tulo:\s*(.+)/i.exec(l);
      if(t){ titulo = t[1]; return; }
      const it = /^(.+?):\s*(-?\d+(?:[.,]\d+)?)\s*$/.exec(l);
      if(it) itens.push({ rotulo: it[1].trim(), valor: parseFloat(it[2].replace(',','.')) });
    });
    if(!itens.length) return '';
    return '<div class="grafico-wrap">' + (titulo ? '<div class="titulo-grafico">'+esc(titulo)+'</div>' : '') + barrasGrafico(itens) + '</div>';
  }

  function formatarMensagem(bruto){
    const graficos = [];
    const base = bruto.replace(/```grafico\n([\s\S]*?)```/g, (m,c) => { graficos.push(renderizarGraficoTexto(c)); return '\u0001'+(graficos.length-1)+'\u0001'; });
    const linhas = base.split('\n');
    let html = '', lista = null, par = [];
    const fechaPar = () => { if(par.length){ html += '<p>'+par.join(' ')+'</p>'; par = []; } };
    const fechaLista = () => { if(lista){ html += '</'+lista+'>'; lista = null; } };
    let i = 0;
    while(i < linhas.length){
      const l = linhas[i].trim();
      const mg = /^\u0001(\d+)\u0001$/.exec(l);
      if(mg){ fechaPar(); fechaLista(); html += graficos[Number(mg[1])] || ''; i++; continue; }
      const ehTab = /^\|.*\|$/.test(l);
      const sep = linhas[i+1] && /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(linhas[i+1].trim());
      if(ehTab && sep){
        fechaPar(); fechaLista();
        const cel = s => s.trim().split('|').map(c=>c.trim()).filter((c,idx,arr)=> !(idx===0&&c==='') && !(idx===arr.length-1&&c===''));
        const cab = cel(l); let j = i+2; const corpo = [];
        while(j < linhas.length && /^\|.*\|$/.test(linhas[j].trim())){ corpo.push(cel(linhas[j])); j++; }
        html += '<div class="tabela-wrap"><table class="tabela-resposta"><thead><tr>'+cab.map(c=>'<th>'+formatarLinha(c)+'</th>').join('')+'</tr></thead><tbody>'+corpo.map(r=>'<tr>'+r.map(c=>'<td>'+formatarLinha(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
        i = j; continue;
      }
      const ul = /^[-•]\s+(.*)/.exec(l);
      const ol = /^\d+[.)]\s+(.*)/.exec(l);
      if(ul){ fechaPar(); if(lista!=='ul'){ fechaLista(); html+='<ul>'; lista='ul'; } html += '<li>'+formatarLinha(ul[1])+'</li>'; }
      else if(ol){ fechaPar(); if(lista!=='ol'){ fechaLista(); html+='<ol>'; lista='ol'; } html += '<li>'+formatarLinha(ol[1])+'</li>'; }
      else if(l === ''){ fechaPar(); fechaLista(); }
      else { fechaLista(); par.push(formatarLinha(l)); }
      i++;
    }
    fechaPar(); fechaLista();
    return html;
  }

  const ABERTURAS = [
    { t:'Como está seu dia?', s:'O que você quer comprar, economizar ou vender hoje? Eu pesquiso antes de responder.' },
    { t:'Por onde começamos?', s:'Me diga o que está na sua cabeça — uma compra, uma dívida, uma ideia de renda extra.' },
    { t:'Tem algo em vista?', s:'Se for compra, eu comparo preço. Se for venda, eu monto o plano com número.' },
    { t:'O que você quer resolver?', s:'Pode ser barato demais, caro demais, ou aquela ideia que você ainda não tirou do papel.' },
    { t:'Vamos ver esse dinheiro.', s:'Comprar melhor, gastar menos ou começar a vender — escolha um e a gente destrincha.' },
    { t:'Bom te ver por aqui.', s:'Me conte o que está pesando no bolso e eu volto com opções reais e o link certo.' },
    { t:'Fala comigo.', s:'Uma dúvida de preço, um plano de revenda, um curso que você quer criar. Tudo cabe.' },
    { t:'Que ideia você tem?', s:'Se ela tiver número, eu simulo. Se não tiver, a gente descobre os números juntos.' },
    { t:'Sem enrolação, então.', s:'Diga o que você precisa e eu pesquiso antes de te dar qualquer resposta.' },
    { t:'Que tal hoje?', s:'Posso comparar preços, achar onde revender ou te ajudar a publicar seu primeiro curso.' }
  ];
  const SUGESTOES = [
    'Vale a pena esse celular?','Quero criar um curso','Onde revendo isso com lucro?','Como cortar minhas contas fixas?','Formas de renda extra com IA','Onde investir uma sobra de dinheiro?','Como começar a economizar esse mês?'
  ];

  const SUGESTOES_TUTOR = [
    'Sugestão de investimento pra sobra de caixa',
    'Como posso economizar mais esse mês?',
    'Meu negócio está saudável?',
    'Como aumentar meu ticket médio?',
    'Vale a pena baixar meu preço?',
    'Qual produto devo priorizar agora?'
  ];
  function renderizarSugestoesTutor(){
    $('sugestoes-tutor').innerHTML = SUGESTOES_TUTOR.map(s=>'<button class="sugestao">'+esc(s)+'</button>').join('');
    $('sugestoes-tutor').querySelectorAll('.sugestao').forEach(b => b.addEventListener('click', () => { $('pergunta-tutor').value = b.textContent; perguntarTutor(); }));
  }

  function bolha(m){
    if(m.role === 'user'){
      let anexo = '';
      if(m.anexo){
        const miolo = m.anexo.tipo === 'image' && m.anexo.dataBase64
          ? '<img src="data:'+m.anexo.mediaType+';base64,'+m.anexo.dataBase64+'" alt="">'
          : '<span class="icone-pdf">PDF</span>';
        anexo = '<div class="chip-anexo" style="margin:0 0 8px;">'+miolo+'<span class="nome-anexo">'+esc(m.anexo.nomeArquivo)+'</span></div>';
      }
      return '<div class="linha-usuario"><div class="bolha-usuario">'+anexo+esc(m.texto)+'</div></div>';
    }
    return '<div class="mensagem-assistente"><div class="rotulo-assistente"><span class="bola"></span>Best Sale</div>'+formatarMensagem(m.texto)+'</div>';
  }

  const SACOLA_MINI = '<svg viewBox="0 0 100 100" fill="none"><path d="M30 40 Q30 16 50 16 Q70 16 70 40" stroke="#FFBE00" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M21 42 L79 42 L89 90 L11 90 Z" fill="#FFBE00"/></svg>';

  let aberturaEscolhida = ABERTURAS[Math.floor(Math.random()*ABERTURAS.length)];

  function renderizarChat(base, parcial){
    const lista = base || mensagens;
    const c = $('mensagens');
    if(!lista.length && !carregando && parcial === undefined){
      c.innerHTML = '<div class="vazio-chat"><div class="vazio-titulo">'+esc(aberturaEscolhida.t)+'</div><div class="vazio-subtitulo">'+esc(aberturaEscolhida.s)+'</div>'
        + '<div class="sugestoes">'+SUGESTOES.map(s=>'<button class="sugestao">'+esc(s)+'</button>').join('')+'</div></div>';
      c.querySelectorAll('.sugestao').forEach(b => b.addEventListener('click', () => { $('input-barra').value = b.textContent; enviar(); }));
      return;
    }
    let html = lista.map(bolha).join('');
    if(carregando) html += '<div class="carregando"><span class="sacola-carregando">'+SACOLA_MINI+'</span><span class="texto-pensando">pensando</span></div>';
    if(parcial !== undefined) html += '<div class="mensagem-assistente"><div class="rotulo-assistente"><span class="bola"></span>Best Sale</div>'+formatarMensagem(parcial)+'<span class="cursor-digitando"></span></div>';
    c.innerHTML = html;
    if(parcial === undefined) window.scrollTo({ top: document.body.scrollHeight, behavior:'smooth' });
  }

  function animar(texto){
    return new Promise(res => {
      const anteriores = mensagens.slice(0, -1);
      let i = 0;
      const passo = Math.max(1, Math.round(texto.length/90));
      const t = setInterval(() => {
        i += passo;
        if(i >= texto.length){ clearInterval(t); renderizarChat(); res(); }
        else renderizarChat(anteriores, texto.slice(0,i));
      }, 16);
    });
  }

  async function chamarClaudeGenerico(modo, contextoExtra, listaMensagens){
    const paraAPI = listaMensagens.map(m => {
      if(m.anexo && m.anexo.dataBase64){
        const blocos = [];
        if(m.anexo.tipo === 'image') blocos.push({ type:'image', source:{ type:'base64', media_type:m.anexo.mediaType, data:m.anexo.dataBase64 } });
        else blocos.push({ type:'document', source:{ type:'base64', media_type:'application/pdf', data:m.anexo.dataBase64 } });
        blocos.push({ type:'text', text: m.texto || 'Dá uma olhada nisso pra mim.' });
        return { role:m.role, content:blocos };
      }
      return { role:m.role, content:m.texto };
    });

    let resposta;
    try{
      resposta = await fetch('/.netlify/functions/chat', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ modo, contextoExtra: contextoExtra || '', messages: paraAPI })
      });
    }catch(e){
      if(location.protocol === 'file:'){
        throw new Error('O navegador bloqueou essa chamada — isso costuma acontecer quando o app é aberto direto do arquivo baixado (file://) em vez de um link publicado (https://). Suba este site num host como Netlify e abra por lá.');
      }
      throw new Error('Não consegui alcançar o servidor. Verifique a conexão e tente de novo.');
    }
    if(!resposta.ok){
      let detalhe = '';
      try{ const err = await resposta.json(); detalhe = err.error || ''; }catch(e){}
      if(resposta.status === 404) throw new Error('Não achei a função do servidor (/.netlify/functions/chat). Se você está testando fora do Netlify publicado, isso é esperado — só funciona no site publicado de verdade.');
      if(resposta.status === 429) throw new Error('Muitas mensagens em pouco tempo. Espere alguns segundos e envie de novo.');
      if(resposta.status === 401 || resposta.status === 403) throw new Error('O servidor recusou a chamada (erro ' + resposta.status + (detalhe?': '+detalhe:'') + ').');
      throw new Error('Erro ' + resposta.status + (detalhe ? ': ' + detalhe : '') + '. Tente de novo em instantes.');
    }
    const dados = await resposta.json();
    const texto = (dados.text || '').trim();
    if(!texto) throw new Error('A resposta veio vazia. Reformule a pergunta e tente de novo.');
    return texto;
  }

  async function resumoCatalogoParaContexto(){
    await carregarCatalogo();
    if(!catalogo.length) return '';
    const lista = catalogo.slice(0, 15).map(c =>
      '- "' + c.titulo + '" (' + c.categoria + ', ' + c.tipo + ') por ' + c.autor + ', ' + (c.preco > 0 ? moeda(c.preco) : 'gratuito')
    ).join('\n');
    return '\n\nCursos publicados agora na Comunidade deste app (pode recomendar quando o tema combinar com a pergunta da pessoa, além de plataformas externas):\n' + lista;
  }

  async function chamarClaude(){
    const extra = await resumoCatalogoParaContexto();
    return chamarClaudeGenerico('chat', extra, mensagens);
  }

  async function perguntarTutor(){
    const input = $('pergunta-tutor');
    const pergunta = input.value.trim();
    if(!pergunta) return;
    const t = totaisFinanceiros();
    const meses = mesesRecentesValor(3);
    const resumoProdutos = produtos.length
      ? produtos.map(p => '- ' + p.nome + ' (' + p.tipo + '): preço ' + moeda(p.preco) + ', ' + p.vendas + ' vendas' + (p.meta ? ', meta ' + p.meta + '/mês' : '')).join('\n')
      : 'Nenhum produto cadastrado ainda.';
    const resumoMeses = meses.map(m => m.chave + ': entrou ' + moeda(m.receita) + ', saiu ' + moeda(m.despesa)).join('\n');
    const contexto = 'Dados reais do negócio da pessoa agora:\n'
      + 'Faturamento total: ' + moeda(t.receitas) + '\n'
      + 'Saídas totais: ' + moeda(t.despesas) + '\n'
      + 'Saldo: ' + moeda(t.saldo) + '\n'
      + 'Vendas totais: ' + t.vendas + '\n'
      + 'Ticket médio: ' + moeda(t.ticket) + '\n'
      + 'Últimos 3 meses:\n' + resumoMeses + '\n'
      + 'Produtos:\n' + resumoProdutos;

    const area = $('resposta-tutor');
    $('btn-perguntar-tutor').disabled = true;
    area.innerHTML = '<div class="carregando" style="padding-left:0"><span class="sacola-carregando">'+SACOLA_MINI+'</span><span class="texto-pensando">pensando</span></div>';

    let resp;
    try{
      const extraCatalogo = await resumoCatalogoParaContexto();
      resp = await chamarClaudeGenerico('tutor', extraCatalogo, [{ role:'user', texto: contexto + '\n\nPergunta da pessoa: ' + pergunta }]);
    }
    catch(e){ resp = e && e.message ? e.message : 'Algo deu errado. Tente de novo.'; }

    $('btn-perguntar-tutor').disabled = false;
    area.innerHTML = '<div class="mensagem-assistente" style="padding-left:0;border-left:none">'+formatarMensagem(resp)+'</div>';
    input.value = '';
  }
  $('btn-perguntar-tutor').addEventListener('click', perguntarTutor);
  $('pergunta-tutor').addEventListener('keydown', ev => { if(ev.key==='Enter'){ ev.preventDefault(); perguntarTutor(); } });

  async function enviar(){
    const input = $('input-barra');
    const texto = input.value.trim();
    if((!texto && !anexoPendente) || carregando) return;
    if(telaAtual !== 'chat') mudarTela('chat');

    const msg = { role:'user', texto };
    if(anexoPendente) msg.anexo = anexoPendente;
    mensagens.push(msg);
    input.value = '';
    anexoPendente = null;
    renderizarPreviaAnexo();
    salvarChat();

    carregando = true;
    $('btn-enviar').disabled = true;
    renderizarChat();

    let resp;
    try{ resp = await chamarClaude(); }
    catch(e){ resp = e && e.message ? e.message : 'Algo deu errado. Tente de novo.'; }

    carregando = false;
    $('btn-enviar').disabled = false;
    mensagens.push({ role:'assistant', texto: resp });
    salvarChat();
    await animar(resp);
    input.focus();
  }

  function salvarChat(){
    const leve = mensagens.map(m => m.anexo ? { role:m.role, texto:m.texto, anexo:{ tipo:m.anexo.tipo, nomeArquivo:m.anexo.nomeArquivo } } : m);
    Guardar.gravar(CHAVE_CHAT, leve);
  }

  $('btn-enviar').addEventListener('click', enviar);
  $('input-barra').addEventListener('keydown', ev => { if(ev.key === 'Enter'){ ev.preventDefault(); enviar(); } });
  $('btn-limpar').addEventListener('click', () => {
    if(!mensagens.length) return;
    if(confirm('Apagar toda a conversa?')){
      mensagens = [];
      aberturaEscolhida = ABERTURAS[Math.floor(Math.random()*ABERTURAS.length)];
      salvarChat(); renderizarChat();
    }
  });

  function mudarTela(nome){
    telaAtual = nome;
    document.querySelectorAll('.aba-nav').forEach(b => b.classList.toggle('ativa', b.dataset.tela === nome));
    document.querySelectorAll('.tela').forEach(s => s.classList.toggle('visivel', s.id === 'tela-'+nome));
    $('barra-inferior').style.display = nome === 'chat' ? 'flex' : 'none';
    $('previa-anexo').style.display = nome === 'chat' ? 'flex' : 'none';
    window.scrollTo({ top:0 });
    if(nome === 'dashboard') renderizarDashboard();
    if(nome === 'comunidade') renderizarComunidade();
    if(nome === 'aprender') renderizarMatriculas();
  }
  document.querySelectorAll('.aba-nav').forEach(b => b.addEventListener('click', () => mudarTela(b.dataset.tela)));

  const ICO = {
    cifrao:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M16.5 7.5c0-1.8-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3 4.5 1.2 4.5 3-2 3-4.5 3-4.5-1.2-4.5-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    carrinho:'<svg viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20 8H6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1.3" fill="currentColor"/><circle cx="17" cy="20" r="1.3" fill="currentColor"/></svg>',
    alvo:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
    caixa:'<svg viewBox="0 0 24 24" fill="none"><path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5v-7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M3.5 8.5 12 13l8.5-4.5M12 13v7" stroke="currentColor" stroke-width="1.6"/></svg>',
    subir:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 16l6-6 4 4 6-7M14 7h6v6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    descer:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 8l6 6 4-4 6 7M14 17h6v-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function cardMetrica(icone, rotulo, valor, classe, nota){
    return '<div class="card-metrica"><div class="linha-icone-card"><span class="icone-card">'+icone+'</span><span class="rotulo-card">'+rotulo+'</span></div>'
      + '<div class="valor-card '+(classe||'')+'">'+valor+'</div>'
      + (nota ? '<div class="nota-card">'+nota+'</div>' : '') + '</div>';
  }

  function totaisFinanceiros(){
    const receitas = lancamentos.filter(l=>l.tipo==='receita').reduce((s,l)=>s+l.valor,0);
    const despesas = lancamentos.filter(l=>l.tipo==='despesa').reduce((s,l)=>s+l.valor,0);
    const vendas = lancamentos.filter(l=>l.tipo==='receita' && l.venda).reduce((s,l)=>s+(l.qtd||1),0);
    return { receitas, despesas, saldo: receitas-despesas, vendas, ticket: vendas ? receitas/vendas : 0 };
  }

  function mesesRecentesValor(qtd){
    const agora = new Date(); const out = [];
    for(let k=qtd-1; k>=0; k--){
      const d = new Date(agora.getFullYear(), agora.getMonth()-k, 1);
      const chave = d.getFullYear()+'-'+d.getMonth();
      const receita = lancamentos.filter(l=>l.tipo==='receita' && l.mes===chave).reduce((s,l)=>s+l.valor,0);
      const despesa = lancamentos.filter(l=>l.tipo==='despesa' && l.mes===chave).reduce((s,l)=>s+l.valor,0);
      out.push({ chave, receita, despesa });
    }
    return out;
  }

  function diagnosticoNegocio(){
    const t = totaisFinanceiros();
    const meses = mesesRecentesValor(3);
    const esteMes = meses[meses.length-1];
    const mesPassado = meses[meses.length-2];
    const alertas = [];
    let nivel = 'boa';

    if(!lancamentos.length && !produtos.length){
      return { nivel:'vazio', alertas:['Ainda não há dados suficientes. Crie um produto e registre a primeira venda ou gasto pra eu conseguir avaliar sua saúde financeira.'] };
    }
    if(t.saldo < 0){ nivel = 'risco'; alertas.push('Seu saldo está negativo: as saídas já passaram as entradas em ' + moeda(Math.abs(t.saldo)) + '.'); }
    if(esteMes && mesPassado && mesPassado.receita > 0 && esteMes.receita < mesPassado.receita * 0.6){
      nivel = nivel === 'risco' ? 'risco' : 'atencao';
      alertas.push('Suas entradas caíram bastante em relação ao mês passado (' + moeda(mesPassado.receita) + ' → ' + moeda(esteMes.receita) + ').');
    }
    if(esteMes && esteMes.despesa > 0 && esteMes.receita > 0 && esteMes.despesa > esteMes.receita * 0.7){
      nivel = nivel === 'risco' ? 'risco' : 'atencao';
      alertas.push('Suas saídas deste mês já comem mais de 70% do que entrou.');
    }
    produtos.forEach(p => {
      if(p.meta && p.vendas < p.meta * 0.5){
        nivel = nivel === 'risco' ? 'risco' : 'atencao';
        alertas.push('"' + p.nome + '" está com ' + p.vendas + ' vendas, bem abaixo da meta de ' + p.meta + '/mês.');
      }
    });
    if(!alertas.length) alertas.push('Nenhum alerta agora. Saldo positivo e nada fora do esperado nos seus produtos.');
    return { nivel, alertas, t, meses };
  }

  function renderizarDiagnostico(){
    const d = diagnosticoNegocio();
    const rotulos = { vazio:'Sem dados ainda', boa:'Saúde financeira: boa', atencao:'Saúde financeira: atenção', risco:'Saúde financeira: risco' };
    let comparativo = '';
    if(d.meses && d.meses.length >= 2){
      const esteMes = d.meses[d.meses.length-1];
      const mesPassado = d.meses[d.meses.length-2];
      if(mesPassado.receita > 0){
        const variacao = ((esteMes.receita - mesPassado.receita) / mesPassado.receita) * 100;
        const seta = variacao >= 0 ? '📈' : '📉';
        comparativo = '<div class="item-resumo" style="margin-bottom:10px"><span>Comparado ao mês passado</span><strong>'+seta+' '+(variacao>=0?'+':'')+variacao.toFixed(0)+'%</strong></div>';
      }
    }
    $('diagnostico-tutor').innerHTML =
      '<div class="item-resumo" style="margin-bottom:10px"><span>'+rotulos[d.nivel]+'</span></div>'
      + comparativo
      + d.alertas.map(a => '<div class="aviso" style="margin-bottom:8px">'+esc(a)+'</div>').join('');
  }

  function renderizarDashboard(){
    renderizarDiagnostico();
    renderizarSugestoesTutor();
    renderizarMetas();
    renderizarRadarGasto();
    renderizarEstoque();
    renderizarResumoDesafio();
    renderizarAlertasPreco();
    renderizarLembretes();
    const t = totaisFinanceiros();
    $('cards-dashboard').innerHTML =
      cardMetrica(ICO.cifrao, 'Faturamento', moeda(t.receitas), '', 'tudo que entrou')
      + cardMetrica(ICO.carrinho, 'Vendas', String(t.vendas), '', 'unidades vendidas')
      + cardMetrica(ICO.alvo, 'Ticket médio', moeda(t.ticket), '', 'por venda')
      + cardMetrica(ICO.cifrao, 'Saldo', moeda(t.saldo), t.saldo < 0 ? 'negativo' : 'positivo', 'entradas menos saídas')
      + cardMetrica(ICO.caixa, 'Produtos', String(produtos.length), '', produtos.filter(p=>p.publicado).length + ' na comunidade')
      + cardMetrica(ICO.descer, 'Saídas', moeda(t.despesas), 'negativo', 'custos registrados');

    const agora = new Date();
    const nomes = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    const itens = [];
    for(let k = 5; k >= 0; k--){
      const d = new Date(agora.getFullYear(), agora.getMonth()-k, 1);
      const chave = d.getFullYear()+'-'+d.getMonth();
      const soma = lancamentos.filter(l => l.tipo==='receita' && l.mes === chave).reduce((s,l)=>s+l.valor,0);
      itens.push({ rotulo: nomes[d.getMonth()] + '/' + String(d.getFullYear()).slice(2), valor: soma });
    }
    const temAlgo = itens.some(i => i.valor > 0);
    $('grafico-vendas').innerHTML = temAlgo
      ? barrasGrafico(itens, moeda)
      : '<div class="vazio-bloco">Sem entradas ainda. Registre a primeira venda abaixo e o gráfico se preenche.</div>';

    const area = $('lista-produtos');
    if(!produtos.length){
      area.innerHTML = '<div class="vazio-bloco">Nenhum produto ainda.<br>Crie o primeiro e eu monto o plano de lançamento em etapas.</div>';
    } else {
      area.innerHTML = produtos.map(p => {
        const feitas = p.etapas.filter(e=>e.feita).length;
        const pct = Math.round((feitas/p.etapas.length)*100);
        return '<div class="item-produto">'
          + '<div class="capa-produto" style="background:'+corCapa(p.id)+'">'+esc((p.nome||'?').trim().charAt(0).toUpperCase())+'</div>'
          + '<div class="info-produto">'
            + '<div class="nome-produto">'+esc(p.nome)+'</div>'
            + '<div class="meta-produto">'+esc(p.tipo)+' · '+moeda(p.preco)+' · '+p.vendas+' vendas'+(p.meta?' · meta '+p.meta+'/mês':'')+'</div>'
            + '<span class="etiqueta '+(p.publicado?'publicado':'rascunho')+'">'+(p.publicado?'na comunidade':'rascunho')+'</span>'
            + '<span class="etiqueta">'+feitas+'/'+p.etapas.length+' etapas</span>'
            + '<div class="barra-progresso"><div style="width:'+pct+'%"></div></div>'
          + '</div>'
          + '<div class="acoes-produto">'
            + '<button class="btn-mini" data-acao="etapas" data-id="'+p.id+'">Plano</button>'
            + '<button class="btn-mini" data-acao="venda" data-id="'+p.id+'">+ Venda</button>'
            + '<button class="btn-mini" data-acao="publicar" data-id="'+p.id+'">'+(p.publicado?'Publicado':'Publicar')+'</button>'
            + '<button class="btn-mini perigo" data-acao="excluir" data-id="'+p.id+'">Excluir</button>'
          + '</div></div>';
      }).join('');
      area.querySelectorAll('[data-acao]').forEach(b => b.addEventListener('click', () => acaoProduto(b.dataset.acao, b.dataset.id)));
    }

    const tl = $('tabela-lancamentos');
    if(!lancamentos.length){
      tl.innerHTML = '<div class="vazio-bloco">Nada registrado ainda.</div>';
    } else {
      const ord = lancamentos.slice().sort((a,b)=>b.criado-a.criado).slice(0,25);
      tl.innerHTML = '<div class="tabela-wrap"><table class="tabela-resposta"><thead><tr><th>Descrição</th><th>Valor</th><th></th></tr></thead><tbody>'
        + ord.map(l => '<tr><td>'+esc(l.descricao || (l.tipo==='receita'?'Entrada':'Saída'))+'</td>'
          + '<td style="color:'+(l.tipo==='receita'?'var(--menta)':'var(--coral)')+'">'+(l.tipo==='receita'?'+':'-')+' '+moeda(l.valor)+'</td>'
          + '<td><button class="btn-mini perigo" data-del="'+l.id+'">✕</button></td></tr>').join('')
        + '</tbody></table></div>';
      tl.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', async () => {
        lancamentos = lancamentos.filter(l => l.id !== b.dataset.del);
        await Guardar.gravar(CHAVE_LANC, lancamentos);
        renderizarDashboard();
      }));
    }
  }

  function etapasPadrao(){
    return [
      { texto:'Definir o tema e para quem é', dica:'Uma frase: "ensino X para pessoas que querem Y".', feita:false },
      { texto:'Montar o roteiro das aulas', dica:'Liste os módulos antes de gravar qualquer coisa.', feita:false },
      { texto:'Gravar o conteúdo', dica:'Celular no tripé e boa luz já resolvem o começo.', feita:false },
      { texto:'Definir o preço', dica:'Use o simulador de lucro para checar se o preço fecha a conta.', feita:false },
      { texto:'Escrever a página de vendas', dica:'Promessa, para quem é, o que tem dentro, preço e garantia.', feita:false },
      { texto:'Publicar na Comunidade', dica:'Aparece para todo mundo aqui dentro, sem taxa.', feita:false },
      { texto:'Publicar numa plataforma de fora', dica:'Kiwify, Hotmart ou Eduzz cuidam de pagamento e hospedagem.', feita:false },
      { texto:'Divulgar nos primeiros 7 dias', dica:'Avise sua lista, poste nas redes, peça indicação.', feita:false }
    ];
  }

  function abrirModalProduto(id){
    editandoProdutoId = id || null;
    const sel = $('prod-categoria');
    sel.innerHTML = CATEGORIAS.map(c => '<option>'+c+'</option>').join('');
    const p = id ? produtos.find(x=>x.id===id) : null;
    $('titulo-modal-produto').textContent = p ? 'Editar produto' : 'Criar produto';
    $('prod-nome').value = p ? p.nome : '';
    $('prod-tipo').value = p ? p.tipo : 'Curso em vídeo';
    $('prod-preco').value = p ? p.preco : '';
    $('prod-categoria').value = p ? p.categoria : CATEGORIAS[0];
    $('prod-descricao').value = p ? p.descricao : '';
    $('prod-horario').value = p ? (p.horario || '') : '';
    $('prod-contato').value = p ? (p.contato || '') : '';
    $('prod-grupo').value = p ? (p.grupo || '') : '';
    $('prod-meta').value = p ? p.meta : '';
    abrir('overlay-produto');
  }
  $('btn-novo-produto').addEventListener('click', () => abrirModalProduto());
  $('btn-novo-produto-2').addEventListener('click', () => abrirModalProduto());

  $('btn-salvar-produto').addEventListener('click', async () => {
    const nome = $('prod-nome').value.trim();
    if(!nome){ toast('Dê um nome ao produto para salvar.'); return; }
    const dados = {
      nome,
      tipo: $('prod-tipo').value,
      preco: parseFloat($('prod-preco').value) || 0,
      categoria: $('prod-categoria').value,
      descricao: $('prod-descricao').value.trim(),
      horario: $('prod-horario').value.trim(),
      contato: $('prod-contato').value.trim(),
      grupo: $('prod-grupo').value.trim(),
      meta: parseFloat($('prod-meta').value) || 0
    };
    if(editandoProdutoId){
      const p = produtos.find(x=>x.id===editandoProdutoId);
      Object.assign(p, dados);
    } else {
      produtos.push(Object.assign({ id:idNovo(), vendas:0, publicado:false, etapas:etapasPadrao(), criado:Date.now() }, dados));
    }
    await Guardar.gravar(CHAVE_PRODUTOS, produtos);
    fechar('overlay-produto');
    renderizarDashboard();
    toast('Produto salvo.');
  });

  async function acaoProduto(acao, id){
    const p = produtos.find(x=>x.id===id);
    if(!p) return;
    if(acao === 'excluir'){
      if(!confirm('Excluir "'+p.nome+'"?')) return;
      produtos = produtos.filter(x=>x.id!==id);
      await Guardar.gravar(CHAVE_PRODUTOS, produtos);
      renderizarDashboard();
      return;
    }
    if(acao === 'etapas'){ abrirEtapas(p); return; }
    if(acao === 'venda'){
      vendaProdutoId = id;
      $('subtitulo-venda').textContent = p.nome;
      $('venda-qtd').value = 1;
      $('venda-valor').value = p.preco || '';
      abrir('overlay-venda');
      return;
    }
    if(acao === 'publicar'){ publicarNaComunidade(p); return; }
  }

  function abrirEtapas(p){
    $('titulo-etapas').textContent = p.nome;
    const desenhar = () => {
      $('conteudo-etapas').innerHTML = p.etapas.map((e,i) =>
        '<div class="etapa '+(e.feita?'feita':'')+'" data-i="'+i+'"><div class="caixa-etapa">'+(e.feita?'✓':'')+'</div>'
        + '<div><div class="texto-etapa">'+esc(e.texto)+'</div><div class="dica-etapa">'+esc(e.dica)+'</div></div></div>').join('');
      $('conteudo-etapas').querySelectorAll('.etapa').forEach(el => el.addEventListener('click', async () => {
        const i = Number(el.dataset.i);
        p.etapas[i].feita = !p.etapas[i].feita;
        await Guardar.gravar(CHAVE_PRODUTOS, produtos);
        desenhar(); renderizarDashboard();
      }));
    };
    desenhar();
    abrir('overlay-etapas');
  }

  $('btn-confirmar-venda').addEventListener('click', async () => {
    const p = produtos.find(x=>x.id===vendaProdutoId);
    if(!p) return;
    const qtd = Math.max(1, parseInt($('venda-qtd').value) || 1);
    const val = parseFloat($('venda-valor').value) || 0;
    if(val <= 0){ toast('Informe o valor recebido.'); return; }
    p.vendas += qtd;
    const d = new Date();
    lancamentos.push({ id:idNovo(), tipo:'receita', valor: val*qtd, qtd, venda:true, descricao:'Venda · '+p.nome, criado:Date.now(), mes: d.getFullYear()+'-'+d.getMonth() });
    await Guardar.gravar(CHAVE_PRODUTOS, produtos);
    await Guardar.gravar(CHAVE_LANC, lancamentos);
    fechar('overlay-venda');
    renderizarDashboard();
    toast('Venda registrada.');
  });

  $('btn-add-lancamento').addEventListener('click', async () => {
    const tipo = $('lanc-tipo').value;
    const valor = parseFloat($('lanc-valor').value) || 0;
    const descricao = $('lanc-descricao').value.trim();
    if(valor <= 0){ toast('Informe um valor maior que zero.'); return; }
    const d = new Date();
    lancamentos.push({ id:idNovo(), tipo, valor, descricao, criado:Date.now(), mes: d.getFullYear()+'-'+d.getMonth() });
    await Guardar.gravar(CHAVE_LANC, lancamentos);
    $('lanc-valor').value = ''; $('lanc-descricao').value = '';
    renderizarDashboard();
  });

  $('btn-abrir-calc').addEventListener('click', () => abrir('overlay-calc'));
  $('btn-calcular').addEventListener('click', () => {
    const inv = parseFloat($('calc-investimento').value) || 0;
    const luc = parseFloat($('calc-lucro').value) || 0;
    const hrs = parseFloat($('calc-horas').value) || 0;
    const area = $('resultado-calc');
    if(luc <= 0){ area.innerHTML = '<div class="aviso">Preencha ao menos o lucro mensal para eu simular.</div>'; return; }
    const horasMes = hrs*4.33;
    const porHora = horasMes > 0 ? luc/horasMes : null;
    const meses = inv > 0 ? inv/luc : 0;
    const dados = []; let acum = 0;
    for(let m=1; m<=12; m++){ acum += luc; dados.push({ rotulo:'Mês '+m, valor: acum-inv }); }
    const resumo = '<div class="resumo">'
      + '<div class="item-resumo"><span>Se paga em</span><strong>'+(inv>0 ? (meses<1?'menos de 1 mês':meses.toFixed(1).replace('.',',')+' meses') : 'sem investimento')+'</strong></div>'
      + (porHora !== null ? '<div class="item-resumo"><span>Por hora dedicada</span><strong>'+moeda(porHora)+'</strong></div>' : '')
      + '<div class="item-resumo"><span>Lucro em 12 meses</span><strong>'+moeda(acum)+'</strong></div>'
      + '<div class="item-resumo"><span>Saldo no fim do ano</span><strong>'+moeda(acum-inv)+'</strong></div>'
      + '</div>';
    area.innerHTML = resumo + '<div class="grafico-wrap"><div class="titulo-grafico">Saldo mês a mês</div>'+barrasGrafico(dados, moeda)+'</div>';
  });

  // Taxas de referência 2026 (aproximadas — a plataforma pode cobrar diferente por categoria específica; sempre bom confirmar no painel dela)
  function taxaMercadoLivre(preco, premium){
    const comissao = premium ? 0.17 : 0.12; // Clássico ~10-14%, Premium ~15-19%, usando ponto médio
    const fixo = preco < 79 ? 6 : 0; // abaixo de R$79 cobra tarifa fixa; acima, o custo vira frete grátis obrigatório (não modelado aqui)
    return { comissao, fixo };
  }
  function taxaShopee(preco){
    if(preco < 80) return { comissao:0.20, fixo:4 };
    if(preco < 100) return { comissao:0.14, fixo:16 };
    if(preco < 200) return { comissao:0.14, fixo:20 };
    return { comissao:0.14, fixo:26 };
  }
  function obterTaxa(plataforma, preco){
    if(plataforma === 'ml_classico') return taxaMercadoLivre(preco, false);
    if(plataforma === 'ml_premium') return taxaMercadoLivre(preco, true);
    if(plataforma === 'shopee') return taxaShopee(preco);
    return { comissao:0, fixo:0 };
  }
  function calcularPrecoSugerido(custo, margemPct, plataforma){
    const lucroDesejado = custo * (margemPct/100);
    // taxa pode depender da faixa de preço final (Shopee/ML) — chuta um preço, recalcula a taxa, refaz até estabilizar (poucas iterações bastam)
    let preco = custo + lucroDesejado;
    for(let i=0; i<6; i++){
      const { comissao, fixo } = obterTaxa(plataforma, preco);
      const novoPreco = (custo + lucroDesejado + fixo) / (1 - comissao);
      if(Math.abs(novoPreco - preco) < 0.01){ preco = novoPreco; break; }
      preco = novoPreco;
    }
    const { comissao, fixo } = obterTaxa(plataforma, preco);
    const taxaReais = preco*comissao + fixo;
    const liquido = preco - taxaReais - custo;
    return { preco, taxaReais, liquido, comissaoPct: comissao*100, fixo };
  }
  const NOMES_PLATAFORMA = { ml_classico:'Mercado Livre Clássico', ml_premium:'Mercado Livre Premium', shopee:'Shopee', direto:'venda direta (sem taxa)' };

  $('btn-abrir-precificador').addEventListener('click', () => abrir('overlay-precificador'));
  $('btn-calcular-preco').addEventListener('click', () => {
    const custo = parseFloat($('preco-custo').value) || 0;
    const margem = parseFloat($('preco-margem').value) || 0;
    const plataforma = $('preco-plataforma').value;
    const area = $('resultado-precificador');
    if(custo <= 0){ area.innerHTML = '<div class="aviso">Preencha quanto você pagou pelo produto.</div>'; return; }
    const r = calcularPrecoSugerido(custo, margem, plataforma);
    area.innerHTML = '<div class="resumo">'
      + '<div class="item-resumo"><span>Preço de venda sugerido</span><strong>'+moeda(r.preco)+'</strong></div>'
      + '<div class="item-resumo"><span>Taxa da '+NOMES_PLATAFORMA[plataforma]+'</span><strong>'+moeda(r.taxaReais)+(r.comissaoPct>0?' ('+r.comissaoPct.toFixed(0)+'% + '+moeda(r.fixo)+' fixo)':'')+'</strong></div>'
      + '<div class="item-resumo"><span>Seu lucro líquido real</span><strong>'+moeda(r.liquido)+'</strong></div>'
      + '</div>'
      + '<div class="aviso">Taxas de referência de 2026 — a plataforma pode cobrar um pouco diferente conforme a categoria exata do produto. Confirme no painel de vendedor antes de publicar o anúncio.</div>';
  });

  // ===== Metas de economia =====
  function calcularMeses(prazoISO){
    if(!prazoISO) return 1;
    const hoje = new Date(); const alvo = new Date(prazoISO + 'T00:00:00');
    const meses = (alvo.getFullYear()-hoje.getFullYear())*12 + (alvo.getMonth()-hoje.getMonth()) + (alvo.getDate()>=hoje.getDate()?1:0);
    return Math.max(1, meses);
  }
  function renderizarMetas(){
    const area = $('lista-metas');
    if(!metas.length){ area.innerHTML = '<div class="vazio-bloco">Nenhuma meta ainda. Crie uma pra eu calcular quanto guardar por mês.</div>'; return; }
    area.innerHTML = metas.map(m => {
      const pct = Math.min(100, Math.round((m.acumulado / m.valorAlvo)*100));
      const meses = calcularMeses(m.prazo);
      const faltando = Math.max(0, m.valorAlvo - m.acumulado);
      const porMes = faltando / meses;
      return '<div class="item-produto">'
        + '<div class="capa-produto" style="background:'+corCapa(m.id)+'">🎯</div>'
        + '<div class="info-produto"><div class="nome-produto">'+esc(m.nome)+'</div>'
        + '<div class="meta-produto">'+moeda(m.acumulado)+' de '+moeda(m.valorAlvo)+(m.prazo?' · até '+new Date(m.prazo+'T00:00:00').toLocaleDateString('pt-BR'):'')+'</div>'
        + (faltando>0 ? '<div class="meta-produto">Guarde '+moeda(porMes)+'/mês pra chegar lá</div>' : '<div class="meta-produto" style="color:var(--menta)">Meta batida! 🎉</div>')
        + '<div class="barra-progresso"><div style="width:'+pct+'%"></div></div>'
        + '</div>'
        + '<div class="acoes-produto"><button class="btn-mini" data-deposito="'+m.id+'">+ Guardar</button><button class="btn-mini perigo" data-del-meta="'+m.id+'">Excluir</button></div>'
        + '</div>';
    }).join('');
    area.querySelectorAll('[data-deposito]').forEach(b => b.addEventListener('click', () => {
      depositoMetaId = b.dataset.deposito;
      const m = metas.find(x=>x.id===depositoMetaId);
      $('subtitulo-deposito').textContent = m.nome;
      $('deposito-valor').value = '';
      abrir('overlay-deposito');
    }));
    area.querySelectorAll('[data-del-meta]').forEach(b => b.addEventListener('click', async () => {
      metas = metas.filter(m => m.id !== b.dataset.delMeta);
      await Guardar.gravar(CHAVE_METAS, metas);
      renderizarMetas();
    }));
  }
  $('btn-nova-meta').addEventListener('click', () => {
    $('meta-nome').value=''; $('meta-valor').value=''; $('meta-prazo').value='';
    abrir('overlay-meta');
  });
  $('btn-salvar-meta').addEventListener('click', async () => {
    const nome = $('meta-nome').value.trim();
    const valorAlvo = parseFloat($('meta-valor').value) || 0;
    if(!nome || valorAlvo<=0){ toast('Preencha o nome e o valor da meta.'); return; }
    metas.push({ id:idNovo(), nome, valorAlvo, prazo:$('meta-prazo').value||'', acumulado:0, criado:Date.now() });
    await Guardar.gravar(CHAVE_METAS, metas);
    fechar('overlay-meta');
    renderizarMetas();
    toast('Meta criada.');
  });
  $('btn-confirmar-deposito').addEventListener('click', async () => {
    const m = metas.find(x=>x.id===depositoMetaId);
    if(!m) return;
    const v = parseFloat($('deposito-valor').value) || 0;
    if(v<=0){ toast('Informe um valor.'); return; }
    m.acumulado += v;
    await Guardar.gravar(CHAVE_METAS, metas);
    fechar('overlay-deposito');
    renderizarMetas();
    toast('Guardado! Total na meta: ' + moeda(m.acumulado));
  });

  // ===== Radar de gasto fixo =====
  function detectarGastosFixos(){
    const grupos = {};
    lancamentos.filter(l=>l.tipo==='despesa' && l.descricao).forEach(l => {
      const chave = l.descricao.trim().toLowerCase();
      if(!grupos[chave]) grupos[chave] = { nome:l.descricao.trim(), meses:new Set(), valores:[] };
      grupos[chave].meses.add(l.mes);
      grupos[chave].valores.push(l.valor);
    });
    return Object.values(grupos).filter(g => g.meses.size >= 2).map(g => ({
      nome: g.nome, vezes: g.meses.size, mediaValor: g.valores.reduce((s,v)=>s+v,0)/g.valores.length
    })).sort((a,b) => b.mediaValor - a.mediaValor);
  }
  function renderizarRadarGasto(){
    const fixos = detectarGastosFixos();
    const area = $('radar-gasto');
    if(!fixos.length){ area.innerHTML = '<div class="vazio-bloco">Ainda não detectei gasto recorrente — preciso da mesma despesa aparecer em pelo menos 2 meses diferentes.</div>'; return; }
    const totalMes = fixos.reduce((s,f)=>s+f.mediaValor,0);
    area.innerHTML = '<div class="aviso" style="margin-bottom:10px">Total recorrente detectado: <strong>'+moeda(totalMes)+'</strong>/mês</div>'
      + fixos.map(f => '<div class="item-resumo" style="margin-bottom:8px"><span>'+esc(f.nome)+' ('+f.vezes+'x)</span><strong>'+moeda(f.mediaValor)+'</strong></div>').join('');
  }

  // ===== Estoque pra revenda =====
  let editandoItemEstoqueId = null;
  const ETAPAS_ESTOQUE = ['comprado','anunciado','vendido'];
  const NOMES_ETAPA_ESTOQUE = { comprado:'Comprado', anunciado:'Anunciado', vendido:'Vendido' };
  function renderizarEstoque(){
    const area = $('lista-estoque');
    if(!estoque.length){ area.innerHTML = '<div class="vazio-bloco">Nenhum item ainda. Adicione o que você comprou pra revender.</div>'; return; }
    area.innerHTML = estoque.slice().reverse().map(it =>
      '<div class="item-produto"><div class="capa-produto" style="background:'+corCapa(it.id)+'">'+esc((it.nome||'?').charAt(0).toUpperCase())+'</div>'
      + '<div class="info-produto"><div class="nome-produto">'+esc(it.nome)+'</div>'
      + '<div class="meta-produto">Pago: '+moeda(it.custo)+'</div>'
      + '<span class="etiqueta '+(it.status==='vendido'?'publicado':'rascunho')+'">'+NOMES_ETAPA_ESTOQUE[it.status]+'</span></div>'
      + '<div class="acoes-produto">'
        + (it.status!=='vendido' ? '<button class="btn-mini" data-avancar="'+it.id+'">Avançar</button>' : '')
        + '<button class="btn-mini perigo" data-del-item="'+it.id+'">Excluir</button>'
      + '</div></div>'
    ).join('');
    area.querySelectorAll('[data-avancar]').forEach(b => b.addEventListener('click', async () => {
      const it = estoque.find(x=>x.id===b.dataset.avancar);
      const i = ETAPAS_ESTOQUE.indexOf(it.status);
      it.status = ETAPAS_ESTOQUE[Math.min(ETAPAS_ESTOQUE.length-1, i+1)];
      await Guardar.gravar(CHAVE_ESTOQUE, estoque);
      renderizarEstoque();
    }));
    area.querySelectorAll('[data-del-item]').forEach(b => b.addEventListener('click', async () => {
      estoque = estoque.filter(x=>x.id!==b.dataset.delItem);
      await Guardar.gravar(CHAVE_ESTOQUE, estoque);
      renderizarEstoque();
    }));
  }
  $('btn-novo-item-estoque').addEventListener('click', () => {
    $('item-nome').value=''; $('item-custo').value='';
    abrir('overlay-item-estoque');
  });
  $('btn-salvar-item-estoque').addEventListener('click', async () => {
    const nome = $('item-nome').value.trim();
    const custo = parseFloat($('item-custo').value) || 0;
    if(!nome){ toast('Dê um nome ao item.'); return; }
    estoque.push({ id:idNovo(), nome, custo, status:'comprado', criado:Date.now() });
    await Guardar.gravar(CHAVE_ESTOQUE, estoque);
    fechar('overlay-item-estoque');
    renderizarEstoque();
  });

  // ===== Gerador de anúncio =====
  $('btn-abrir-anuncio').addEventListener('click', () => {
    $('anuncio-nome').value=''; $('anuncio-preco').value=''; $('anuncio-detalhes').value='';
    $('resultado-anuncio').innerHTML = '';
    abrir('overlay-anuncio');
  });
  $('btn-gerar-anuncio').addEventListener('click', async () => {
    const nome = $('anuncio-nome').value.trim();
    const estado = $('anuncio-estado').value;
    const preco = parseFloat($('anuncio-preco').value) || 0;
    const detalhes = $('anuncio-detalhes').value.trim();
    if(!nome){ toast('Diz o nome do produto.'); return; }
    const area = $('resultado-anuncio');
    $('btn-gerar-anuncio').disabled = true;
    area.innerHTML = '<div class="carregando" style="padding-left:0"><span class="sacola-carregando">'+SACOLA_MINI+'</span><span class="texto-pensando">pensando</span></div>';
    const promptAnuncio = 'Escreva um texto de anúncio pronto pra colar no Mercado Livre, Shopee ou OLX pra este produto: "'+nome+'", estado: '+estado+(preco>0?', preço: '+moeda(preco):'')+(detalhes?', detalhes: '+detalhes:'')+'. Use um título curto e chamativo (até 60 caracteres), depois uma descrição com os pontos fortes em bullet points, e termine com uma chamada pra ação. Sem inventar característica que não foi dita. Direto, sem enrolação.';
    let resp;
    try{ resp = await chamarClaudeGenerico('anuncio', '', [{ role:'user', texto: promptAnuncio }]); }
    catch(e){ resp = e && e.message ? e.message : 'Não consegui gerar agora. Tente de novo.'; }
    $('btn-gerar-anuncio').disabled = false;
    area.innerHTML = '<div class="mensagem-assistente" style="padding-left:0;border-left:none">'+formatarMensagem(resp)+'</div>';
  });

  // ===== Vale a pena parcelar? =====
  $('btn-abrir-parcelamento').addEventListener('click', () => {
    $('parc-avista').value=''; $('parc-numero').value=''; $('parc-valor').value='';
    $('resultado-parcelamento').innerHTML = '';
    abrir('overlay-parcelamento');
  });
  $('btn-calcular-parcelamento').addEventListener('click', () => {
    const avista = parseFloat($('parc-avista').value) || 0;
    const n = parseInt($('parc-numero').value) || 0;
    const valorParcela = parseFloat($('parc-valor').value) || 0;
    const area = $('resultado-parcelamento');
    if(avista<=0 || n<=0 || valorParcela<=0){ area.innerHTML = '<div class="aviso">Preencha os três campos.</div>'; return; }
    const total = n * valorParcela;
    const diferenca = total - avista;
    const pctJuros = (diferenca / avista) * 100;
    let veredito;
    if(diferenca <= 0) veredito = 'Parcelar sai igual ou mais barato que à vista — geralmente vale a pena, contanto que você consiga pagar todas as parcelas em dia.';
    else if(pctJuros < 8) veredito = 'O juro embutido é baixo. Se você não tem o dinheiro todo agora, parcelar é razoável.';
    else veredito = 'O juro embutido é alto. Se você tem o valor à vista, quase sempre compensa mais pagar à vista (ou negociar desconto) do que parcelar.';
    area.innerHTML = '<div class="resumo">'
      + '<div class="item-resumo"><span>Total parcelado</span><strong>'+moeda(total)+'</strong></div>'
      + '<div class="item-resumo"><span>Diferença pro à vista</span><strong>'+moeda(diferenca)+'</strong></div>'
      + '<div class="item-resumo"><span>Juro embutido</span><strong>'+pctJuros.toFixed(1).replace('.',',')+'%</strong></div>'
      + '</div><div class="aviso">'+veredito+'</div>';
  });

  // ===== Comparador de produtos =====
  $('btn-abrir-comparador').addEventListener('click', () => {
    [0,1,2,3].forEach(i => $('comp-item-'+i).value = '');
    $('resultado-comparador').innerHTML = '';
    abrir('overlay-comparador');
  });
  $('btn-gerar-comparacao').addEventListener('click', async () => {
    const itens = [0,1,2,3].map(i => $('comp-item-'+i).value.trim()).filter(Boolean);
    if(itens.length < 2){ toast('Coloque pelo menos 2 produtos pra comparar.'); return; }
    const area = $('resultado-comparador');
    $('btn-gerar-comparacao').disabled = true;
    area.innerHTML = '<div class="carregando" style="padding-left:0"><span class="sacola-carregando">'+SACOLA_MINI+'</span><span class="texto-pensando">pensando</span></div>';
    const prompt = 'Compare estes produtos: ' + itens.join(', ') + '. Pesquise o preço atual de cada um, e monte uma tabela markdown com colunas Produto, Preço, Prós, Contras. Depois da tabela, diga em 1-2 frases qual você recomendaria e por quê, considerando custo-benefício.';
    let resp;
    try{ resp = await chamarClaudeGenerico('chat', '', [{ role:'user', texto: prompt }]); }
    catch(e){ resp = e && e.message ? e.message : 'Não consegui comparar agora. Tente de novo.'; }
    $('btn-gerar-comparacao').disabled = false;
    area.innerHTML = '<div class="mensagem-assistente" style="padding-left:0;border-left:none">'+formatarMensagem(resp)+'</div>';
  });

  // ===== Desafio de economia =====
  const DESAFIOS = {
    '1': { nome:'R$1 a R$100 crescente', dias:100, valorDia:(d)=>d, total:5050 },
    '2': { nome:'R$2 a R$200 crescente', dias:100, valorDia:(d)=>d*2, total:10100 },
    '5': { nome:'R$5 fixo por semana', dias:52, valorDia:()=>5, total:260 }
  };
  function renderizarResumoDesafio(){
    const area = $('resumo-desafio');
    if(!desafio){ area.innerHTML = '<div class="vazio-bloco">Nenhum desafio ativo. Toque em "Ver desafio" pra começar um.</div>'; return; }
    const def = DESAFIOS[desafio.tipo];
    const guardado = desafio.diasMarcados.reduce((s,d)=>s+def.valorDia(d),0);
    area.innerHTML = '<div class="item-resumo"><span>'+def.nome+'</span><strong>'+desafio.diasMarcados.length+'/'+def.dias+' dias</strong></div>'
      + '<div class="item-resumo" style="margin-top:8px"><span>Guardado até agora</span><strong>'+moeda(guardado)+'</strong></div>';
  }
  function renderizarProgressoDesafio(){
    const area = $('progresso-desafio');
    if(!desafio){ area.innerHTML = ''; return; }
    const def = DESAFIOS[desafio.tipo];
    const guardado = desafio.diasMarcados.reduce((s,d)=>s+def.valorDia(d),0);
    let grade = '<div style="display:flex;flex-wrap:wrap;gap:5px;margin:14px 0;max-height:220px;overflow-y:auto">';
    for(let d=1; d<=def.dias; d++){
      const feito = desafio.diasMarcados.includes(d);
      grade += '<button class="btn-mini'+(feito?'':'')+'" data-dia="'+d+'" style="width:38px;height:38px;border-radius:9px;'+(feito?'background:var(--menta);color:#0E0E0E;border-color:var(--menta)':'')+'">'+d+'</button>';
    }
    grade += '</div>';
    area.innerHTML = '<div class="resumo">'
      + '<div class="item-resumo"><span>Progresso</span><strong>'+desafio.diasMarcados.length+'/'+def.dias+'</strong></div>'
      + '<div class="item-resumo"><span>Guardado</span><strong>'+moeda(guardado)+' de '+moeda(def.total)+'</strong></div>'
      + '</div>' + grade
      + '<button class="botao-secundario botao-largo" id="btn-reiniciar-desafio">Reiniciar desafio</button>';
    area.querySelectorAll('[data-dia]').forEach(b => b.addEventListener('click', async () => {
      const d = Number(b.dataset.dia);
      const i = desafio.diasMarcados.indexOf(d);
      if(i>=0) desafio.diasMarcados.splice(i,1); else desafio.diasMarcados.push(d);
      await Guardar.gravar(CHAVE_DESAFIO, desafio);
      renderizarProgressoDesafio();
      renderizarResumoDesafio();
    }));
    $('btn-reiniciar-desafio').addEventListener('click', async () => {
      if(!confirm('Reiniciar o desafio do zero?')) return;
      desafio = null;
      await Guardar.gravar(CHAVE_DESAFIO, null);
      $('config-desafio').style.display = '';
      $('btn-comecar-desafio').style.display = '';
      renderizarProgressoDesafio();
      renderizarResumoDesafio();
    });
  }
  $('btn-abrir-desafio').addEventListener('click', () => {
    if(desafio){ $('config-desafio').style.display = 'none'; $('btn-comecar-desafio').style.display = 'none'; }
    else { $('config-desafio').style.display = ''; $('btn-comecar-desafio').style.display = ''; }
    renderizarProgressoDesafio();
    abrir('overlay-desafio');
  });
  $('btn-comecar-desafio').addEventListener('click', async () => {
    desafio = { tipo: $('desafio-tipo').value, diasMarcados: [], iniciado: Date.now() };
    await Guardar.gravar(CHAVE_DESAFIO, desafio);
    $('config-desafio').style.display = 'none';
    $('btn-comecar-desafio').style.display = 'none';
    renderizarProgressoDesafio();
    renderizarResumoDesafio();
  });

  // ===== Relatório do negócio =====
  function montarTextoRelatorio(){
    const t = totaisFinanceiros();
    const meses = mesesRecentesValor(6);
    const hoje = new Date().toLocaleDateString('pt-BR');
    let txt = 'RELATÓRIO DO NEGÓCIO — ' + (perfil.nome || 'Best Sale') + '\nGerado em ' + hoje + '\n\n';
    txt += '== RESUMO GERAL ==\n';
    txt += 'Faturamento total: ' + moeda(t.receitas) + '\n';
    txt += 'Saídas totais: ' + moeda(t.despesas) + '\n';
    txt += 'Saldo: ' + moeda(t.saldo) + '\n';
    txt += 'Vendas totais: ' + t.vendas + '\n';
    txt += 'Ticket médio: ' + moeda(t.ticket) + '\n\n';
    txt += '== ÚLTIMOS 6 MESES ==\n';
    meses.forEach(m => { txt += m.chave + ': entrou ' + moeda(m.receita) + ', saiu ' + moeda(m.despesa) + '\n'; });
    txt += '\n== PRODUTOS ==\n';
    if(!produtos.length) txt += 'Nenhum produto cadastrado.\n';
    produtos.forEach(p => { txt += '- ' + p.nome + ' (' + p.tipo + '): preço ' + moeda(p.preco) + ', ' + p.vendas + ' vendas' + (p.meta?', meta '+p.meta+'/mês':'') + (p.publicado?' [na Comunidade]':'') + '\n'; });
    txt += '\n== ÚLTIMAS MOVIMENTAÇÕES ==\n';
    const ord = lancamentos.slice().sort((a,b)=>b.criado-a.criado).slice(0,20);
    if(!ord.length) txt += 'Nenhuma movimentação registrada.\n';
    ord.forEach(l => { txt += (l.tipo==='receita'?'+ ':'- ') + moeda(l.valor) + ' — ' + (l.descricao||(l.tipo==='receita'?'Entrada':'Saída')) + '\n'; });
    return txt;
  }
  $('btn-exportar-relatorio').addEventListener('click', () => {
    $('preview-relatorio').textContent = montarTextoRelatorio();
    abrir('overlay-relatorio');
  });
  $('btn-baixar-relatorio').addEventListener('click', () => {
    const texto = montarTextoRelatorio();
    const blob = new Blob([texto], { type:'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-negocio-' + new Date().toISOString().slice(0,10) + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // ===== Produtos de olho (alerta de preço sob demanda) =====
  function renderizarAlertasPreco(){
    const area = $('lista-alertas-preco');
    if(!alertasPreco.length){ area.innerHTML = '<div class="vazio-bloco">Nenhum produto na lista ainda.</div>'; return; }
    area.innerHTML = alertasPreco.slice().reverse().map(a =>
      '<div class="item-produto"><div class="capa-produto" style="background:'+corCapa(a.id)+'">🔎</div>'
      + '<div class="info-produto"><div class="nome-produto">'+esc(a.nome)+'</div>'
      + '<div class="meta-produto">Quer pagar até '+moeda(a.alvo)+'</div>'
      + (a.ultimaChecagem ? '<div class="meta-produto">Última checagem: '+esc(a.ultimoResultado||'')+' ('+new Date(a.ultimaChecagem).toLocaleDateString('pt-BR')+')</div>' : '')
      + '</div>'
      + '<div class="acoes-produto">'
        + '<button class="btn-mini" data-verificar="'+a.id+'">Verificar agora</button>'
        + '<button class="btn-mini perigo" data-del-alerta="'+a.id+'">Excluir</button>'
      + '</div></div>'
    ).join('');
    area.querySelectorAll('[data-del-alerta]').forEach(b => b.addEventListener('click', async () => {
      alertasPreco = alertasPreco.filter(x=>x.id!==b.dataset.delAlerta);
      await Guardar.gravar(CHAVE_ALERTAS_PRECO, alertasPreco);
      renderizarAlertasPreco();
    }));
    area.querySelectorAll('[data-verificar]').forEach(b => b.addEventListener('click', async () => {
      const a = alertasPreco.find(x=>x.id===b.dataset.verificar);
      if(!a) return;
      b.disabled = true; b.textContent = 'Verificando...';
      const prompt = 'Pesquise o preço atual de "'+a.nome+'"'+(a.link?' (link de referência: '+a.link+')':'')+'. Eu quero pagar até '+moeda(a.alvo)+'. Me diga em 1-2 frases o preço que você encontrou e se está dentro do que eu quero pagar ou não, com o link de onde encontrou.';
      let resp;
      try{ resp = await chamarClaudeGenerico('chat', '', [{ role:'user', texto: prompt }]); }
      catch(e){ resp = e && e.message ? e.message : 'Não consegui verificar agora.'; }
      a.ultimaChecagem = Date.now();
      a.ultimoResultado = resp.replace(/\n/g,' ').slice(0, 160) + (resp.length>160?'…':'');
      await Guardar.gravar(CHAVE_ALERTAS_PRECO, alertasPreco);
      renderizarAlertasPreco();
      toast(resp.slice(0,200), 6000);
    }));
  }
  $('btn-novo-alerta-preco').addEventListener('click', () => {
    $('alerta-nome').value=''; $('alerta-link').value=''; $('alerta-alvo').value='';
    abrir('overlay-alerta-preco');
  });
  $('btn-salvar-alerta-preco').addEventListener('click', async () => {
    const nome = $('alerta-nome').value.trim();
    const alvo = parseFloat($('alerta-alvo').value) || 0;
    if(!nome || alvo<=0){ toast('Preencha o nome e o preço que você quer pagar.'); return; }
    alertasPreco.push({ id:idNovo(), nome, link:$('alerta-link').value.trim(), alvo, ultimaChecagem:null, ultimoResultado:'', criado:Date.now() });
    await Guardar.gravar(CHAVE_ALERTAS_PRECO, alertasPreco);
    fechar('overlay-alerta-preco');
    renderizarAlertasPreco();
  });

  // ===== Lembretes =====
  const NOMES_TIPO_LEMBRETE = { estoque:'Repor estoque', assinatura:'Renovar assinatura', outro:'Outro' };
  function renderizarLembretes(){
    const area = $('lista-lembretes');
    if(!lembretes.length){ area.innerHTML = '<div class="vazio-bloco">Nenhum lembrete ainda.</div>'; return; }
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const ordenados = lembretes.slice().sort((a,b) => new Date(a.data) - new Date(b.data));
    area.innerHTML = ordenados.map(l => {
      const data = new Date(l.data + 'T00:00:00');
      const diasRestantes = Math.round((data - hoje) / 86400000);
      let cor = '';
      let situacao = 'em ' + diasRestantes + ' dias';
      if(diasRestantes < 0){ cor='negativo'; situacao = 'atrasado há ' + Math.abs(diasRestantes) + ' dias'; }
      else if(diasRestantes === 0){ cor='negativo'; situacao = 'é hoje'; }
      else if(diasRestantes <= 7){ situacao = 'em ' + diasRestantes + ' dias — chegando'; }
      return '<div class="item-produto"><div class="capa-produto" style="background:'+corCapa(l.id)+'">⏰</div>'
        + '<div class="info-produto"><div class="nome-produto">'+esc(l.nome)+'</div>'
        + '<div class="meta-produto">'+NOMES_TIPO_LEMBRETE[l.tipo]+' · '+data.toLocaleDateString('pt-BR')+'</div>'
        + '<div class="meta-produto" style="color:var(--'+(cor==='negativo'?'coral':'papel-suave')+')">'+situacao+'</div></div>'
        + '<div class="acoes-produto"><button class="btn-mini perigo" data-del-lembrete="'+l.id+'">Excluir</button></div></div>';
    }).join('');
    area.querySelectorAll('[data-del-lembrete]').forEach(b => b.addEventListener('click', async () => {
      lembretes = lembretes.filter(x=>x.id!==b.dataset.delLembrete);
      await Guardar.gravar(CHAVE_LEMBRETES, lembretes);
      renderizarLembretes();
    }));
  }
  $('btn-novo-lembrete').addEventListener('click', () => {
    $('lembrete-nome').value=''; $('lembrete-data').value='';
    abrir('overlay-lembrete');
  });
  $('btn-salvar-lembrete').addEventListener('click', async () => {
    const nome = $('lembrete-nome').value.trim();
    const data = $('lembrete-data').value;
    if(!nome || !data){ toast('Preencha o nome e a data.'); return; }
    lembretes.push({ id:idNovo(), nome, tipo:$('lembrete-tipo').value, data, criado:Date.now() });
    await Guardar.gravar(CHAVE_LEMBRETES, lembretes);
    fechar('overlay-lembrete');
    renderizarLembretes();
  });

  async function carregarCatalogo(){
    const c = await Guardar.ler(CHAVE_CATALOGO, true);
    catalogo = Array.isArray(c) ? c : [];
  }

  async function publicarNaComunidade(p){
    if(!perfil.nome){ abrir('overlay-perfil'); toast('Coloque seu nome antes de publicar.'); return; }
    if(!p.descricao){ toast('Escreva "para quem é" antes de publicar. Toque no produto para editar.'); return; }
    await carregarCatalogo();
    const jaTem = catalogo.find(c => c.id === p.id);
    const ehPrimeiro = !jaTem && !catalogo.some(c => c.autor === perfil.nome);
    const registro = {
      id: p.id, titulo: p.nome, tipo: p.tipo, preco: p.preco,
      categoria: p.categoria, descricao: p.descricao,
      horario: p.horario || '', contato: p.contato || '', grupo: p.grupo || '',
      autor: perfil.nome, bio: perfil.bio, alunos: jaTem ? jaTem.alunos : 0,
      primeiroCurso: jaTem ? !!jaTem.primeiroCurso : ehPrimeiro,
      perguntas: jaTem ? (jaTem.perguntas || []) : [],
      criado: jaTem ? jaTem.criado : Date.now()
    };
    if(jaTem) Object.assign(jaTem, registro); else catalogo.push(registro);
    const ok = await Guardar.gravar(CHAVE_CATALOGO, catalogo, true);
    p.publicado = true;
    await Guardar.gravar(CHAVE_PRODUTOS, produtos);
    renderizarDashboard();
    toast(ok ? (ehPrimeiro ? '🌱 Primeiro curso publicado!' : 'Publicado na comunidade.') : 'Publicado só neste aparelho.');
  }

  $('btn-publicar').addEventListener('click', () => {
    if(!produtos.length){ mudarTela('dashboard'); abrirModalProduto(); toast('Crie o produto primeiro, depois publique.'); return; }
    mudarTela('dashboard');
    toast('Escolha o produto e toque em "Publicar".');
  });

  async function carregarAvaliacoes(){
    const a = await Guardar.ler(CHAVE_AVALIACOES, true);
    avaliacoes = Array.isArray(a) ? a : [];
  }
  function mediaAvaliacao(cursoId){
    const doCurso = avaliacoes.filter(a => a.cursoId === cursoId);
    if(!doCurso.length) return null;
    return { media: doCurso.reduce((s,a)=>s+a.nota,0)/doCurso.length, total: doCurso.length };
  }

  async function renderizarComunidade(){
    await carregarCatalogo();
    await carregarAvaliacoes();
    $('aviso-comunidade').textContent = temStorage
      ? 'Tudo que você publica aqui fica visível para as outras pessoas que usam o app.'
      : 'Este aparelho está guardando os cursos só localmente, então você vê apenas os seus. Abra pelo link publicado para ver os de todo mundo.';

    const cats = ['Todos'].concat(CATEGORIAS);
    $('filtros-comunidade').innerHTML = cats.map(c => '<button class="filtro '+(c===filtroAtual?'ativo':'')+'" data-cat="'+esc(c)+'">'+esc(c)+'</button>').join('');
    $('filtros-comunidade').querySelectorAll('.filtro').forEach(b => b.addEventListener('click', () => { filtroAtual = b.dataset.cat; renderizarComunidade(); }));

    const lista = catalogo.filter(c => filtroAtual === 'Todos' || c.categoria === filtroAtual)
                          .sort((a,b) => (b.alunos||0)-(a.alunos||0) || b.criado-a.criado);
    const grade = $('grade-cursos');
    if(!lista.length){
      grade.innerHTML = '<div class="vazio-bloco">Ainda não há curso nesta categoria.<br>Seja a primeira pessoa a publicar — vá em "Meu negócio", crie o produto e toque em Publicar.</div>';
      return;
    }
    grade.innerHTML = lista.map(c => {
      const meu = produtos.some(p => p.id === c.id);
      const inscrito = matriculas.some(m => m.id === c.id);
      const nota = mediaAvaliacao(c.id);
      return '<div class="card-curso">'
        + '<div class="capa-curso" style="background:'+corCapa(c.id)+'">'+esc(c.titulo)+'</div>'
        + '<div class="corpo-curso">'
        + '<div><div class="titulo-curso">'+esc(c.titulo)+(c.primeiroCurso?' <span class="etiqueta publicado" style="margin-top:0">🌱 primeiro curso</span>':'')+'</div><div class="autor-curso">Por '+esc(c.autor)+' · '+esc(c.tipo)+(nota?' · ⭐ '+nota.media.toFixed(1)+' ('+nota.total+')':'')+'</div></div>'
        + '<div class="descricao-curso">'+esc((c.descricao||'').slice(0,110))+((c.descricao||'').length>110?'…':'')+'</div>'
        + '<div class="rodape-curso"><span class="preco-curso">'+(c.preco>0?moeda(c.preco):'Gratuito')+'</span>'
        + '<span class="contador-curso">'+(c.alunos||0)+' alunos</span></div>'
        + '<button class="'+(meu||inscrito?'botao-secundario':'botao-principal')+'" data-curso="'+c.id+'">'
        + (meu ? 'Seu curso' : inscrito ? 'Abrir curso' : 'Ver curso') + '</button></div></div>';
    }).join('');
    grade.querySelectorAll('[data-curso]').forEach(b => b.addEventListener('click', () => abrirCurso(b.dataset.curso)));
  }

  function linkContato(txt){
    if(!txt) return null;
    if(/^https?:\/\//i.test(txt)) return txt;
    const soDigitos = txt.replace(/[^\d]/g, '');
    if(soDigitos.length >= 8 && /^[\d\s()+-]+$/.test(txt)) return 'https://wa.me/' + soDigitos;
    return null;
  }

  function renderizarPerguntasHTML(c){
    const perguntas = c.perguntas || [];
    const lista = perguntas.length
      ? perguntas.map(p => '<div class="item-resumo" style="align-items:flex-start;flex-direction:column;gap:4px"><strong>'+esc(p.autor)+'</strong><span>'+esc(p.texto)+'</span></div>').join('')
      : '<div class="vazio-bloco" style="padding:14px">Nenhuma pergunta ainda. Seja a primeira pessoa a perguntar.</div>';
    return '<div class="titulo-secao-painel">PERGUNTAS</div>' + lista
      + (perfil.nome ? '<div class="campos" style="margin-top:10px"><input type="text" id="nova-pergunta-curso" placeholder="Escreva sua dúvida sobre o curso"></div><button class="botao-secundario botao-largo" id="btn-enviar-pergunta" data-curso-pergunta="'+c.id+'">Enviar pergunta</button>' : '<div class="aviso">Coloque seu nome no perfil pra poder perguntar.</div>');
  }

  function renderizarAvaliacaoHTML(c, jaAvaliou){
    const nota = mediaAvaliacao(c.id);
    const doCurso = avaliacoes.filter(a => a.cursoId === c.id).slice().reverse();
    let html = '<div class="titulo-secao-painel">AVALIAÇÕES'+(nota?' · ⭐ '+nota.media.toFixed(1)+' ('+nota.total+')':'')+'</div>';
    html += doCurso.length
      ? doCurso.map(a => '<div class="item-resumo" style="align-items:flex-start;flex-direction:column;gap:4px"><strong>'+'⭐'.repeat(a.nota)+' — '+esc(a.autor)+'</strong>'+(a.comentario?'<span>'+esc(a.comentario)+'</span>':'')+'</div>').join('')
      : '<div class="vazio-bloco" style="padding:14px">Ainda sem avaliação.</div>';
    if(jaAvaliou){
      html += '<div class="lista-opcoes" id="lista-notas" style="flex-direction:row;gap:6px;margin-top:10px">'
        + [1,2,3,4,5].map(n => '<button class="btn-mini" data-nota="'+n+'" style="flex:1;text-align:center">'+n+'⭐</button>').join('')
        + '</div>'
        + '<div class="campos" style="margin-top:8px"><input type="text" id="comentario-avaliacao" placeholder="Comentário (opcional)"></div>'
        + '<div class="aviso" id="aviso-nota-escolhida" style="margin-top:8px">Toque numa nota acima.</div>';
    }
    return html;
  }

  function abrirCurso(id){
    const c = catalogo.find(x=>x.id===id);
    if(!c) return;
    const inscrito = matriculas.some(m=>m.id===id);
    const meu = produtos.some(p=>p.id===id);
    const linkWhats = linkContato(c.contato);
    const jaAvaliou = inscrito && !avaliacoes.some(a => a.cursoId===c.id && a.autor===perfil.nome);
    let notaEscolhida = 0;
    $('titulo-curso-modal').textContent = c.titulo;
    $('conteudo-curso').innerHTML =
      '<div class="subtitulo-modal">Por '+esc(c.autor)+(c.bio?' · '+esc(c.bio):'')+(c.primeiroCurso?' · 🌱 primeiro curso':'')+'</div>'
      + '<div class="aviso" style="margin-bottom:14px">'+esc(c.descricao || 'Sem descrição.')+'</div>'
      + '<div class="resumo">'
        + '<div class="item-resumo"><span>Formato</span><strong>'+esc(c.tipo)+'</strong></div>'
        + '<div class="item-resumo"><span>Categoria</span><strong>'+esc(c.categoria)+'</strong></div>'
        + '<div class="item-resumo"><span>Preço</span><strong>'+(c.preco>0?moeda(c.preco):'Gratuito')+'</strong></div>'
        + '<div class="item-resumo"><span>Alunos</span><strong>'+(c.alunos||0)+'</strong></div>'
        + (c.horario ? '<div class="item-resumo"><span>Horário</span><strong>'+esc(c.horario)+'</strong></div>' : '')
      + '</div>'
      + (c.contato ? '<a href="'+(linkWhats||'#')+'" target="_blank" rel="noopener" class="botao-secundario botao-largo" style="display:block;text-align:center;text-decoration:none;margin-bottom:10px">'+(linkWhats?'Falar com quem criou (WhatsApp)':'Contato: '+esc(c.contato))+'</a>' : '')
      + (c.grupo ? '<a href="'+esc(c.grupo)+'" target="_blank" rel="noopener" class="botao-secundario botao-largo" style="display:block;text-align:center;text-decoration:none;margin-bottom:10px">Entrar no grupo do curso</a>' : '')
      + (meu ? '<div class="aviso">Este curso é seu. As vendas você registra em "Meu negócio".</div>'
        : inscrito ? '<div class="aviso">Você já está matriculado. O curso aparece em "Meus cursos".</div>'
        : '<button class="botao-principal botao-largo" id="btn-matricular">'+(c.preco>0?'Quero este curso':'Entrar no curso')+'</button>'
          + '<div class="aviso" style="margin-top:12px">O pagamento é combinado direto com quem criou o curso. Confira quem é a pessoa antes de transferir qualquer valor.</div>')
      + renderizarAvaliacaoHTML(c, jaAvaliou)
      + renderizarPerguntasHTML(c);
    if(!meu && !inscrito){
      $('btn-matricular').addEventListener('click', async () => {
        matriculas.push({ id:c.id, titulo:c.titulo, autor:c.autor, preco:c.preco, tipo:c.tipo, descricao:c.descricao, contato:c.contato, grupo:c.grupo, horario:c.horario, quando:Date.now() });
        await Guardar.gravar(CHAVE_MATRICULAS, matriculas);
        await carregarCatalogo();
        const alvo = catalogo.find(x=>x.id===c.id);
        if(alvo){ alvo.alunos = (alvo.alunos||0)+1; await Guardar.gravar(CHAVE_CATALOGO, catalogo, true); }
        fechar('overlay-curso');
        renderizarComunidade();
        toast('Pronto — está em "Meus cursos".');
      });
    }
    if(jaAvaliou){
      $('lista-notas').querySelectorAll('[data-nota]').forEach(b => b.addEventListener('click', () => {
        notaEscolhida = Number(b.dataset.nota);
        $('aviso-nota-escolhida').textContent = 'Nota escolhida: ' + '⭐'.repeat(notaEscolhida) + ' — toque em "Enviar" abaixo.';
        if(!$('btn-enviar-avaliacao')){
          $('aviso-nota-escolhida').insertAdjacentHTML('afterend', '<button class="botao-principal botao-largo" id="btn-enviar-avaliacao" style="margin-top:8px">Enviar avaliação</button>');
          $('btn-enviar-avaliacao').addEventListener('click', async () => {
            if(!notaEscolhida) return;
            avaliacoes.push({ id:idNovo(), cursoId:c.id, autor:perfil.nome, nota:notaEscolhida, comentario:$('comentario-avaliacao').value.trim(), criado:Date.now() });
            await Guardar.gravar(CHAVE_AVALIACOES, avaliacoes, true);
            fechar('overlay-curso');
            renderizarComunidade();
            toast('Avaliação enviada. Obrigado!');
          });
        }
      }));
    }
    const btnPerg = $('btn-enviar-pergunta');
    if(btnPerg){
      btnPerg.addEventListener('click', async () => {
        const texto = $('nova-pergunta-curso').value.trim();
        if(!texto) return;
        await carregarCatalogo();
        const alvo = catalogo.find(x=>x.id===c.id);
        if(alvo){
          alvo.perguntas = alvo.perguntas || [];
          alvo.perguntas.push({ autor:perfil.nome, texto, criado:Date.now() });
          await Guardar.gravar(CHAVE_CATALOGO, catalogo, true);
        }
        fechar('overlay-curso');
        renderizarComunidade();
        toast('Pergunta enviada.');
      });
    }
    abrir('overlay-curso');
  }

  function renderizarMatriculas(){
    const area = $('lista-matriculas');
    if(!matriculas.length){
      area.innerHTML = '<div class="vazio-bloco">Você ainda não pegou nenhum curso.<br>Dê uma olhada na Comunidade.</div>';
      return;
    }
    area.innerHTML = matriculas.slice().reverse().map(m =>
      '<div class="item-produto"><div class="capa-produto" style="background:'+corCapa(m.id)+'">'+esc((m.titulo||'?').charAt(0).toUpperCase())+'</div>'
      + '<div class="info-produto"><div class="nome-produto">'+esc(m.titulo)+'</div>'
      + '<div class="meta-produto">Por '+esc(m.autor)+' · '+esc(m.tipo)+'</div>'
      + '<div class="meta-produto" style="margin-top:6px">'+esc((m.descricao||'').slice(0,120))+'</div></div>'
      + '<div class="acoes-produto"><button class="btn-mini perigo" data-sair="'+m.id+'">Sair</button></div></div>').join('');
    area.querySelectorAll('[data-sair]').forEach(b => b.addEventListener('click', async () => {
      matriculas = matriculas.filter(m => m.id !== b.dataset.sair);
      await Guardar.gravar(CHAVE_MATRICULAS, matriculas);
      renderizarMatriculas();
    }));
  }

  // ===== Firebase Auth =====
  const firebaseConfig = {
    apiKey: "AIzaSyBV-zz-0MbDI3ANfvoEdQC21bC-yONmHx4",
    authDomain: "best-sale-2f7c3.firebaseapp.com",
    projectId: "best-sale-2f7c3",
    storageBucket: "best-sale-2f7c3.firebasestorage.app",
    messagingSenderId: "38274568853",
    appId: "1:38274568853:web:a4f0148be2bb0d3d0b019c"
  };
  let auth = null;
  try{
    if(window.firebase){
      firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      // em ambientes restritos (ex: dentro de um iframe/preview) o IndexedDB pode ficar bloqueado.
      // sem persistência (fica em memória, some ao recarregar) ainda deixa logar nesta sessão.
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {
        return auth.setPersistence(firebase.auth.Auth.Persistence.NONE).catch(() => {});
      });
    }
  }catch(e){ /* SDK pode não ter carregado (sem internet, bloqueio, etc.) */ }

  function abaConta(modo){
    const login = modo !== 'cadastro';
    return '<div class="filtros" style="margin-bottom:16px">'
      + '<button class="filtro '+(login?'ativo':'')+'" data-aba-conta="entrar">Entrar</button>'
      + '<button class="filtro '+(!login?'ativo':'')+'" data-aba-conta="cadastro">Criar conta</button>'
      + '</div>'
      + '<div class="campos">'
        + '<label>Email<input type="email" id="conta-email" placeholder="voce@email.com"></label>'
        + '<label>Senha<input type="password" id="conta-senha" placeholder="mínimo 6 caracteres"></label>'
      + '</div>'
      + '<button class="botao-principal botao-largo" id="btn-entrar-email" style="margin-top:14px">'+(login?'Entrar':'Criar conta')+'</button>'
      + '<div style="text-align:center;color:var(--papel-suave);font-size:.8rem;margin:14px 0">ou</div>'
      + '<button class="botao-google botao-largo" id="btn-entrar-google">'
        + '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">'
          + '<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>'
          + '<path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>'
          + '<path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>'
          + '<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.4 5.4C39.7 37.3 44 31.4 44 24c0-1.2-.1-2.4-.4-3.5z"/>'
        + '</svg>'
        + '<span>Continuar com Google</span>'
      + '</button>'
      + '<div id="erro-conta" style="display:none;margin-top:14px"></div>'
      + (!auth ? '<div class="aviso" style="margin-top:14px">Não consegui carregar o serviço de login agora (sem internet, ou o navegador bloqueou). Verifique a conexão e tente de novo.</div>' : '');
  }

  function mostrarErroConta(titulo, detalheTecnico){
    const el = $('erro-conta');
    if(!el) return;
    el.style.display = 'block';
    el.innerHTML = '<div class="aviso" style="border-color:var(--coral)"><strong style="color:var(--coral)">'+esc(titulo)+'</strong>'
      + (detalheTecnico ? '<div style="margin-top:6px;font-family:\'IBM Plex Mono\',monospace;font-size:.72rem;opacity:.8">'+esc(detalheTecnico)+'</div>' : '')
      + '</div>';
  }

  function renderizarContaModal(){
    const area = $('conteudo-conta');
    const user = auth && auth.currentUser;
    if(user){
      area.innerHTML = '<div class="subtitulo-modal">logado como '+esc(user.email||'')+'</div>'
        + '<div class="campos">'
          + '<label>Como quer ser chamado<input type="text" id="perfil-nome" placeholder="Ana Ribeiro"></label>'
          + '<label>Uma linha sobre você<input type="text" id="perfil-bio" placeholder="Trabalho com marcenaria há 12 anos"></label>'
        + '</div>'
        + '<button class="botao-principal botao-largo" id="btn-salvar-perfil">Salvar</button>'
        + '<button class="botao-secundario botao-largo" id="btn-sair-conta" style="margin-top:10px">Sair desta conta</button>';
      $('perfil-nome').value = perfil.nome || '';
      $('perfil-bio').value = perfil.bio || '';
      $('btn-salvar-perfil').addEventListener('click', async () => {
        perfil.nome = $('perfil-nome').value.trim();
        perfil.bio = $('perfil-bio').value.trim();
        perfil.email = user.email;
        await Guardar.gravar(CHAVE_PERFIL, perfil);
        $('selo-topo').textContent = perfil.nome ? esc(perfil.nome) : esc(user.email);
        fechar('overlay-perfil');
        toast('Salvo.');
      });
      $('btn-sair-conta').addEventListener('click', async () => {
        if(!confirm('Sair desta conta?')) return;
        await auth.signOut();
        toast('Você saiu.');
      });
    } else {
      area.innerHTML = abaConta('entrar');
      ligarEventosConta('entrar');
      if(auth && location.protocol === 'file:'){
        mostrarErroConta('Este arquivo está aberto direto (file://).', 'O login do Firebase não funciona assim — precisa ser https:// ou localhost. Publique o arquivo (Netlify Drop, por exemplo) e abra pelo link.');
      } else if(auth && typeof dentroDeIframe !== 'undefined' && dentroDeIframe){
        mostrarErroConta('O app está dentro de outro app (iframe).', 'O login com Google costuma ser bloqueado aqui dentro. Se o Google falhar, tente abrir o link publicado direto no navegador do celular.');
      }
    }
  }

  function ligarEventosConta(modo){
    $('conteudo-conta').querySelectorAll('[data-aba-conta]').forEach(b => b.addEventListener('click', () => {
      $('conteudo-conta').innerHTML = abaConta(b.dataset.abaConta);
      ligarEventosConta(b.dataset.abaConta);
    }));
    $('btn-entrar-email').addEventListener('click', async () => {
      if(!auth){ mostrarErroConta('Serviço de login indisponível agora.'); return; }
      const email = $('conta-email').value.trim();
      const senha = $('conta-senha').value;
      if(!email || senha.length < 6){ mostrarErroConta('Email e senha (mín. 6 caracteres) são obrigatórios.'); return; }
      const cadastro = $('conteudo-conta').querySelector('[data-aba-conta="cadastro"]').classList.contains('ativo');
      $('btn-entrar-email').disabled = true;
      try{
        if(cadastro) await auth.createUserWithEmailAndPassword(email, senha);
        else await auth.signInWithEmailAndPassword(email, senha);
      }catch(e){
        const msgs = {
          'auth/email-already-in-use':'Esse email já tem conta — toque em "Entrar".',
          'auth/invalid-email':'Email inválido.',
          'auth/weak-password':'Senha fraca — use pelo menos 6 caracteres.',
          'auth/wrong-password':'Senha incorreta.',
          'auth/user-not-found':'Não achei conta com esse email — toque em "Criar conta".',
          'auth/invalid-credential':'Email ou senha incorretos.',
          'auth/too-many-requests':'Muitas tentativas. Espere um pouco e tente de novo.',
          'auth/network-request-failed':'Sem conexão com o servidor do Firebase agora.',
          'auth/unauthorized-domain':'Este endereço não está autorizado no Firebase (Authentication → Settings → Authorized domains).',
          'auth/operation-not-allowed':'O login por Email/Senha não está ativado no Firebase ainda (Authentication → Sign-in method).'
        };
        mostrarErroConta(msgs[e.code] || 'Não consegui completar.', (e.code||'') + (e.message?' — '+e.message:''));
      }
      $('btn-entrar-email').disabled = false;
    });
    $('btn-entrar-google').addEventListener('click', async () => {
      if(!auth){ mostrarErroConta('Serviço de login indisponível agora.'); return; }
      try{
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      }catch(e){
        const msgs = {
          'auth/popup-blocked':'O navegador bloqueou a janela do Google. Permita pop-ups pra este site e tente de novo.',
          'auth/cancelled-popup-request':'A janela do Google foi cancelada. Tente de novo.',
          'auth/popup-closed-by-user':'Você fechou a janela do Google antes de terminar.',
          'auth/unauthorized-domain':'Este endereço não está autorizado no Firebase (Authentication → Settings → Authorized domains) — adicione o domínio de onde você está abrindo o app.',
          'auth/operation-not-allowed':'O login com Google não está ativado no Firebase ainda (Authentication → Sign-in method).'
        };
        mostrarErroConta(msgs[e.code] || 'Não consegui entrar com Google.', (e.code||'') + (e.message?' — '+e.message:''));
      }
    });
  }

  if(auth){
    auth.onAuthStateChanged(async (user) => {
      if(user){
        if(!perfil.email || perfil.email !== user.email) perfil.email = user.email;
        if(!perfil.nome) perfil.nome = user.displayName || user.email.split('@')[0];
        await Guardar.gravar(CHAVE_PERFIL, perfil);
        $('selo-topo').textContent = esc(perfil.nome);
      } else {
        perfil.email = '';
        $('selo-topo').textContent = perfil.nome ? esc(perfil.nome) : 'fontes verificadas · sem enrolação';
      }
      if($('overlay-perfil').classList.contains('aberto')) renderizarContaModal();
    });
  }

  $('btn-perfil').addEventListener('click', () => {
    renderizarContaModal();
    abrir('overlay-perfil');
  });

  function renderizarIdiomas(){
    $('lista-idiomas').innerHTML = IDIOMAS.map(i =>
      '<button class="opcao" data-idioma="'+i.codigo+'">'
      + '<span>'+esc(i.nome)+'</span>'
      + (i.codigo === idiomaAtual ? '<span style="margin-left:auto;color:var(--menta)">✓</span>' : '')
      + '</button>').join('');
    $('lista-idiomas').querySelectorAll('[data-idioma]').forEach(b => b.addEventListener('click', async () => {
      idiomaAtual = b.dataset.idioma;
      await Guardar.gravar(CHAVE_IDIOMA, idiomaAtual);
      if(rec) rec.lang = idiomaAtual;
      fechar('overlay-idioma');
      toast('Idioma do microfone: ' + IDIOMAS.find(i=>i.codigo===idiomaAtual).nome);
    }));
  }
  $('btn-idioma').addEventListener('click', () => { renderizarIdiomas(); abrir('overlay-idioma'); });

  const ICONE_SOL = '<circle cx="12" cy="12" r="4.3" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2.3M12 19.2v2.3M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
  const ICONE_LUA = '<path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>';
  const CHAVE_APARENCIA = 'bestsale:aparencia';
  const OPCOES_TEMA = [
    { codigo:'claro', nome:'Claro' },
    { codigo:'escuro', nome:'Escuro' },
    { codigo:'sistema', nome:'Sistema' }
  ];
  let aparenciaAtual = 'escuro'; // claro | escuro | sistema — o que a pessoa escolheu
  const combinacaoSistema = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function resolverTemaEfetivo(){
    if(aparenciaAtual === 'sistema') return (combinacaoSistema && combinacaoSistema.matches) ? 'escuro' : 'claro';
    return aparenciaAtual;
  }
  function aplicarTema(nome){
    if(nome === 'claro'){
      document.documentElement.setAttribute('data-tema', 'claro');
      $('icone-tema').innerHTML = ICONE_LUA;
    } else {
      document.documentElement.removeAttribute('data-tema');
      $('icone-tema').innerHTML = ICONE_SOL;
    }
  }
  function aplicarAparencia(){ aplicarTema(resolverTemaEfetivo()); }
  if(combinacaoSistema){
    combinacaoSistema.addEventListener ? combinacaoSistema.addEventListener('change', () => { if(aparenciaAtual==='sistema') aplicarAparencia(); })
      : combinacaoSistema.addListener(() => { if(aparenciaAtual==='sistema') aplicarAparencia(); });
  }

  function previaMiolo(codigo){
    if(codigo === 'sistema') return '<div class="previa-tema sistema"><div class="barra"></div></div>';
    return '<div class="previa-tema '+codigo+'"><div class="barra"></div></div>';
  }
  function renderizarCartoesTema(){
    $('cartoes-tema').innerHTML = OPCOES_TEMA.map(o =>
      '<button class="cartao-tema '+(o.codigo===aparenciaAtual?'selecionado':'')+'" data-aparencia="'+o.codigo+'">'
      + previaMiolo(o.codigo)
      + '<div class="rotulo-tema">'+o.nome+'</div></button>').join('');
    $('cartoes-tema').querySelectorAll('[data-aparencia]').forEach(b => b.addEventListener('click', async () => {
      aparenciaAtual = b.dataset.aparencia;
      aplicarAparencia();
      await Guardar.gravar(CHAVE_APARENCIA, aparenciaAtual);
      renderizarCartoesTema();
    }));
  }
  $('btn-tema').addEventListener('click', () => { renderizarCartoesTema(); abrir('overlay-aparencia'); });

  const Motor = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btnMic = $('btn-mic');
  const campo = $('input-barra');
  const placeholderPadrao = campo.placeholder;
  const dentroDeIframe = (function(){ try{ return window.self !== window.top; }catch(e){ return true; } })();

  function passosMic(motivo){
    const iOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    let subtitulo, passos;
    if(motivo === 'iframe'){
      subtitulo = 'o app está aberto dentro de outro aplicativo, e o microfone fica bloqueado aí';
      passos = [
        'Toque no botão de <strong>abrir em nova aba</strong> ou copie o endereço desta página.',
        'Cole o endereço no <strong>navegador do celular</strong> (Safari, Chrome).',
        'Quando o navegador perguntar, escolha <strong>Permitir</strong> para o microfone.',
        'Enquanto isso, você pode usar o <strong>microfone do próprio teclado</strong> para ditar aqui.'
      ];
    } else if(motivo === 'inseguro'){
      subtitulo = 'o microfone só funciona em endereço https';
      passos = [
        'Abra o <strong>link publicado</strong> do app, não o arquivo salvo no aparelho.',
        'Confira se o endereço começa com <strong>https://</strong>.',
        'Recarregue a página e toque no microfone de novo.'
      ];
    } else if(iOS){
      subtitulo = 'o navegador bloqueou o acesso — siga o passo a passo';
      passos = [
        'Abra os <strong>Ajustes</strong> do iPhone.',
        'Desça até <strong>Safari</strong> (ou o navegador que você usa) e toque nele.',
        'Toque em <strong>Microfone</strong> e escolha <strong>Permitir</strong>.',
        'Volte aqui, recarregue e toque no microfone de novo.'
      ];
    } else {
      subtitulo = 'o navegador bloqueou o acesso — siga o passo a passo';
      passos = [
        'Toque no cadeado ou no "ⓘ" ao lado do endereço, lá em cima.',
        'Procure <strong>Microfone</strong> nas permissões do site.',
        'Mude de "Bloquear" para <strong>Permitir</strong>.',
        'Recarregue a página e toque no microfone de novo.'
      ];
    }
    $('subtitulo-mic').textContent = subtitulo;
    $('passos-mic').innerHTML = passos.map((p,i) => '<div class="passo-permissao"><span class="num-passo">'+(i+1)+'</span><span>'+p+'</span></div>').join('');
    abrir('overlay-mic');
  }
  $('btn-tentar-mic').addEventListener('click', () => { fechar('overlay-mic'); btnMic.click(); });

  let rec = null;
  if(Motor){
    rec = new Motor();
    rec.lang = idiomaAtual; rec.continuous = false; rec.interimResults = true;
    let gravando = false;
    rec.addEventListener('result', ev => {
      let t = '';
      for(let i=0;i<ev.results.length;i++) t += ev.results[i][0].transcript;
      campo.value = t;
    });
    rec.addEventListener('end', () => { gravando = false; btnMic.classList.remove('gravando'); campo.placeholder = placeholderPadrao; });
    rec.addEventListener('error', ev => {
      gravando = false; btnMic.classList.remove('gravando'); campo.placeholder = placeholderPadrao;
      if(ev.error === 'not-allowed' || ev.error === 'service-not-allowed'){ passosMic(dentroDeIframe ? 'iframe' : 'bloqueado'); return; }
      const msgs = {
        'no-speech':'Não ouvi nada. Fale mais perto do microfone.',
        'audio-capture':'Nenhum microfone disponível neste aparelho.',
        'network':'Conexão insuficiente para reconhecer a voz agora.',
        'aborted':''
      };
      const m = msgs[ev.error] !== undefined ? msgs[ev.error] : 'O microfone não funcionou. Tente de novo ou digite.';
      if(m) toast(m, 4200);
    });
    btnMic.addEventListener('click', async () => {
      if(gravando){ rec.stop(); return; }
      if(!window.isSecureContext){ passosMic('inseguro'); return; }
      if(dentroDeIframe){
        try{
          if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
            const s = await navigator.mediaDevices.getUserMedia({ audio:true });
            s.getTracks().forEach(t => t.stop());
          } else { passosMic('iframe'); return; }
        }catch(e){ passosMic('iframe'); return; }
      }
      gravando = true;
      btnMic.classList.add('gravando');
      campo.placeholder = 'Ouvindo… pode falar';
      campo.focus();
      try{ rec.start(); }
      catch(e){ gravando = false; btnMic.classList.remove('gravando'); campo.placeholder = placeholderPadrao; toast('Não consegui iniciar o microfone. Tente de novo.'); }
    });
  } else {
    btnMic.classList.add('indisponivel');
    btnMic.addEventListener('click', () => passosMic(dentroDeIframe ? 'iframe' : 'bloqueado'));
  }

  const MAX = 8*1024*1024;
  function base64De(arq){
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result).split(',')[1]);
      r.onerror = () => rej(new Error('falha'));
      r.readAsDataURL(arq);
    });
  }
  function renderizarPreviaAnexo(){
    const area = $('previa-anexo');
    if(!anexoPendente){ area.innerHTML = ''; return; }
    const miolo = anexoPendente.tipo === 'image'
      ? '<img src="data:'+anexoPendente.mediaType+';base64,'+anexoPendente.dataBase64+'" alt="">'
      : '<span class="icone-pdf">PDF</span>';
    area.innerHTML = '<div class="chip-anexo">'+miolo+'<span class="nome-anexo">'+esc(anexoPendente.nomeArquivo)+'</span><button class="remover-anexo" id="rm-anexo">✕</button></div>';
    $('rm-anexo').addEventListener('click', () => { anexoPendente = null; renderizarPreviaAnexo(); });
  }
  async function tratarArquivo(arq){
    if(!arq) return;
    if(arq.size > MAX){ toast('Arquivo grande demais. Use um menor que 8MB.'); return; }
    const pdf = arq.type === 'application/pdf';
    const img = arq.type.indexOf('image/') === 0;
    if(!pdf && !img){ toast('Aqui só entra foto ou PDF.'); return; }
    try{
      anexoPendente = { tipo: pdf?'pdf':'image', mediaType: arq.type, dataBase64: await base64De(arq), nomeArquivo: arq.name || (pdf?'documento.pdf':'imagem.jpg') };
      renderizarPreviaAnexo();
      $('input-barra').focus();
    }catch(e){ toast('Não consegui carregar esse arquivo.'); }
  }
  $('input-camera').addEventListener('change', ev => { tratarArquivo(ev.target.files[0]); ev.target.value=''; });
  $('input-galeria').addEventListener('change', ev => { tratarArquivo(ev.target.files[0]); ev.target.value=''; });
  $('btn-anexo').addEventListener('click', () => abrir('overlay-anexo'));
  $('opcao-camera').addEventListener('click', () => { fechar('overlay-anexo'); $('input-camera').click(); });
  $('opcao-galeria').addEventListener('click', () => { fechar('overlay-anexo'); $('input-galeria').click(); });

  (async function iniciar(){
    const [c, p, l, pf, mt, idi, ap, mts, est, des, alp, lem] = await Promise.all([
      Guardar.ler(CHAVE_CHAT), Guardar.ler(CHAVE_PRODUTOS), Guardar.ler(CHAVE_LANC),
      Guardar.ler(CHAVE_PERFIL), Guardar.ler(CHAVE_MATRICULAS), Guardar.ler(CHAVE_IDIOMA), Guardar.ler(CHAVE_APARENCIA),
      Guardar.ler(CHAVE_METAS), Guardar.ler(CHAVE_ESTOQUE), Guardar.ler(CHAVE_DESAFIO),
      Guardar.ler(CHAVE_ALERTAS_PRECO), Guardar.ler(CHAVE_LEMBRETES)
    ]);
    mensagens = Array.isArray(c) ? c : [];
    produtos = Array.isArray(p) ? p : [];
    lancamentos = Array.isArray(l) ? l : [];
    perfil = pf && typeof pf === 'object' ? pf : { nome:'', bio:'' };
    matriculas = Array.isArray(mt) ? mt : [];
    metas = Array.isArray(mts) ? mts : [];
    estoque = Array.isArray(est) ? est : [];
    desafio = (des && typeof des === 'object' && des.tipo) ? des : null;
    alertasPreco = Array.isArray(alp) ? alp : [];
    lembretes = Array.isArray(lem) ? lem : [];
    produtos.forEach(x => { if(!Array.isArray(x.etapas)) x.etapas = etapasPadrao(); if(typeof x.vendas !== 'number') x.vendas = 0; });
    if(perfil.nome) $('selo-topo').textContent = perfil.nome;
    aparenciaAtual = (ap === 'claro' || ap === 'escuro' || ap === 'sistema') ? ap : 'escuro';
    aplicarAparencia();
    renderizarChat();

    if(typeof idi === 'string' && IDIOMAS.some(i=>i.codigo===idi)){
      idiomaAtual = idi;
      if(rec) rec.lang = idiomaAtual;
    } else {
      // primeira visita: pergunta o idioma
      renderizarIdiomas();
      abrir('overlay-idioma');
    }
  })();
})();
