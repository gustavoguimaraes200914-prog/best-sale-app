
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
  const CHAVE_CONVERSAS = 'bestsale:conversas';
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

  const TRADUCOES = {
    'pt-BR': { nav_conversa:'Conversa', nav_negocio:'Meu negócio', nav_comunidade:'Comunidade', nav_cursos:'Meus cursos', nav_conta:'Minha conta', secao_conversas:'Conversas', btn_nova_conversa:'Nova conversa', input_placeholder:'Me conta o que você precisa…' , desc_negocio:'Seus produtos, suas vendas e o saldo — tudo salvo neste dispositivo.', btn_criar_produto:'Criar produto', h3_tutor:'Tutor do negócio', lbl_pergunta_tutor:'Pergunte ao tutor', placeholder_pergunta_tutor:'Meu lucro está bom pra esse ramo? Como reduzo minha despesa?', btn_perguntar:'Perguntar', h3_vendas:'Vendas dos últimos 6 meses', h3_meus_produtos:'Meus produtos', btn_novo_produto:'Novo produto', h3_simulador:'Simulador de lucro', btn_abrir_simulador:'Abrir simulador', aviso_simulador:'Projete quanto um produto rende antes de começar: quanto investe, quanto lucra por mês, em quanto tempo se paga.', h3_precificador:'Precificador automático', btn_abrir_precificador:'Abrir precificador', aviso_precificador:'Diz quanto você pagou e o lucro que quer, e ele calcula o preço de venda já considerando a taxa da plataforma (Mercado Livre, Shopee, ou venda direta sem taxa).', h3_metas:'Metas de economia', btn_nova_meta:'Nova meta', h3_radar:'Radar de gasto fixo', h3_estoque:'Estoque pra revenda', btn_novo_item:'Novo item', h3_gerador_anuncio:'Gerador de anúncio', btn_criar_anuncio:'Criar anúncio', aviso_anuncio:'Descreve o produto e ele escreve o texto do anúncio pronto pra colar no Mercado Livre, Shopee ou OLX.', h3_parcelar:'Vale a pena parcelar?', btn_comparar:'Comparar', aviso_parcelar:'Compara o preço à vista com o parcelado e mostra quanto de juros você está pagando de verdade.', h3_comparador:'Comparador de produtos', aviso_comparador:'Coloca até 4 produtos e ele pesquisa e monta uma tabela com preço, prós e contras de cada um.', h3_desafio:'Desafio de economia', btn_ver_desafio:'Ver desafio', h3_relatorio:'Relatório do negócio', btn_gerar_relatorio:'Gerar relatório', aviso_relatorio:'Resumo em texto pronto pra baixar e mandar pro contador ou guardar de registro.', h3_produtos_olho:'Produtos de olho (preço)', btn_add_produto_olho:'Adicionar produto', aviso_produtos_olho:'Isto não fica checando preço sozinho o tempo todo — quando você tocar em "Verificar agora", eu pesquiso o preço atual de verdade e comparo com o que você quer pagar.', h3_lembretes:'Lembretes', btn_novo_lembrete:'Novo lembrete', aviso_lembretes:'Repor estoque, renovar assinatura de ferramenta, qualquer coisa com data pra não esquecer.', h3_movimentacoes:'Movimentações reais', lbl_tipo:'Tipo', opt_entrada:'Entrada', opt_saida:'Saída', lbl_valor_reais:'Valor (R$)', lbl_do_que_se_trata:'Do que se trata', btn_registrar_movimentacao:'Registrar movimentação', btn_publicar_curso:'Publicar curso', desc_comunidade:'Cursos criados por pessoas de verdade aqui dentro. Ensine o que você sabe, aprenda o que ainda não sabe.', desc_cursos:'O que você pegou na comunidade fica aqui.', tit_anexar:'Anexar', sub_anexar:'mande uma foto do produto ou um PDF', opc_tirar_foto:'Tirar foto', opc_galeria_pdf:'Galeria ou PDF', tit_idioma:'Escolha seu idioma', sub_idioma:'isso ajusta o reconhecimento de voz do microfone', tit_aparencia:'Aparência', sub_aparencia:'escolha como o app aparece pra você', tit_mic:'Liberar o microfone', btn_tentar_mic:'Já liberei, tentar de novo', sub_simulador:'projeção de 12 meses com números seus', lbl_investimento_inicial:'Investimento inicial (R$)', lbl_lucro_mes:'Lucro líquido por mês (R$)', lbl_horas_semana:'Horas por semana', btn_calcular:'Calcular', sub_precificador:'taxas reais de 2026 já embutidas no cálculo', lbl_quanto_pagou_produto:'Quanto você pagou pelo produto (R$)', lbl_lucro_percentual:'Lucro que você quer, sobre o que pagou (%)', lbl_onde_vai_vender:'Onde vai vender', opt_ml_classico:'Mercado Livre — Clássico', opt_ml_premium:'Mercado Livre — Premium', opt_shopee:'Shopee', opt_direto:'Direto (OLX, Enjoei, Instagram, WhatsApp) — sem taxa', btn_calcular_preco:'Calcular preço de venda', tit_nova_meta:'Nova meta de economia', sub_nova_meta:'ele calcula quanto guardar por mês pra chegar lá', lbl_nome_meta:'Nome da meta', lbl_valor_juntar:'Valor que você quer juntar (R$)', lbl_ate_quando:'Até quando', btn_criar_meta:'Criar meta', tit_guardar_meta:'Guardar valor na meta', lbl_quanto_guardou:'Quanto você guardou agora (R$)', btn_guardar:'Guardar', lbl_nome_item:'Nome do item', lbl_quanto_pagou:'Quanto pagou (R$)', btn_add_estoque:'Adicionar ao estoque', sub_anuncio:'texto pronto pra colar no anúncio', lbl_nome_produto:'Nome do produto', lbl_estado_produto:'Estado', opt_novo_caixa:'Novo, na caixa', opt_seminovo:'Seminovo', opt_usado_bom:'Usado, bom estado', opt_usado_marcas:'Usado, com marcas de uso', lbl_preco_reais:'Preço (R$)', lbl_detalhes_extras:'Detalhes extras (opcional)', btn_gerar_anuncio:'Gerar anúncio', sub_parcelar:'compara à vista com parcelado', lbl_preco_avista:'Preço à vista (R$)', lbl_numero_parcelas:'Número de parcelas', lbl_valor_parcela:'Valor de cada parcela (R$)', sub_comparador:'de 2 a 4 produtos — ele pesquisa e monta a tabela', lbl_produto_1:'Produto 1', lbl_produto_2:'Produto 2', lbl_produto_3:'Produto 3 (opcional)', lbl_produto_4:'Produto 4 (opcional)', btn_comparar_agora:'Comparar agora', sub_desafio:'toque em cada dia conforme for guardando o valor', lbl_escolha_desafio:'Escolha o desafio', opt_desafio_1:'R$1 a R$100 crescente (100 dias, junta R$5.050)', opt_desafio_2:'R$2 a R$200 crescente (100 dias, junta R$10.100)', opt_desafio_5:'R$5 fixo por semana (52 semanas, junta R$260)', btn_comecar_desafio:'Começar este desafio', sub_relatorio:'pronto pra baixar', btn_baixar_relatorio:'Baixar como arquivo de texto', tit_produto_olho:'Produto de olho', sub_produto_olho:'você mesmo toca em "verificar" quando quiser saber o preço de agora', lbl_nome_produto_alerta:'Nome do produto', lbl_link_opcional:'Link (opcional)', lbl_quanto_quer_pagar:'Quanto você quer pagar (R$)', btn_adicionar:'Adicionar', h3_lembretes_novo:'Novo lembrete', lbl_do_que_se_trata_2:'Do que se trata', lbl_tipo_lembrete:'Tipo', opt_repor_estoque:'Repor estoque', opt_renovar_assinatura:'Renovar assinatura/ferramenta', opt_outro:'Outro', lbl_data:'Data', btn_criar_lembrete:'Criar lembrete', sub_produto:'um produto = um curso, ebook ou mentoria que você vai vender', lbl_nome_produto_2:'Nome do produto', lbl_formato:'Formato', opt_curso_video:'Curso em vídeo', opt_ebook:'Ebook', opt_mentoria:'Mentoria', opt_planilha:'Planilha ou template', opt_comunidade_paga:'Comunidade paga', lbl_preco_reais_2:'Preço (R$)', lbl_categoria:'Categoria', lbl_para_quem_e:'Para quem é', lbl_horario_aulas:'Horário das aulas (se tiver)', lbl_contato_duvida:'Contato pra tirar dúvida (WhatsApp, Instagram, etc)', lbl_link_grupo:'Link do grupo (opcional)', lbl_meta_vendas:'Meta de vendas por mês', btn_salvar_produto:'Salvar produto', sub_etapas:'marque conforme for terminando', tit_registrar_venda:'Registrar venda', lbl_quantidade_vendida:'Quantidade vendida', lbl_valor_unidade:'Valor recebido por unidade (R$)', btn_confirmar_venda:'Confirmar venda', aba_entrar:'Entrar', aba_criar_conta:'Criar conta', lbl_email:'Email', placeholder_email:'voce@email.com', lbl_senha:'Senha', placeholder_senha:'mínimo 6 caracteres', btn_entrar:'Entrar', btn_criar_conta_2:'Criar conta', txt_ou:'ou', txt_continuar_google:'Continuar com Google', aviso_login_indisponivel:'Não consegui carregar o serviço de login agora (sem internet, ou o navegador bloqueou). Verifique a conexão e tente de novo.', logado_como:'logado como', lbl_como_chamado:'Como quer ser chamado', placeholder_nome_exemplo:'Ana Ribeiro', lbl_uma_linha_sobre_voce:'Uma linha sobre você', placeholder_bio_exemplo:'Trabalho com marcenaria há 12 anos', btn_salvar:'Salvar', btn_sair_conta:'Sair desta conta', toast_salvo:'Salvo.', confirm_sair_conta:'Sair desta conta?', toast_saiu:'Você saiu.', card_faturamento:'Faturamento', nota_faturamento:'tudo que entrou', card_vendas:'Vendas', nota_vendas:'unidades vendidas', card_ticket:'Ticket médio', nota_ticket:'por venda', card_saldo:'Saldo', nota_saldo:'entradas menos saídas', card_produtos:'Produtos', nota_produtos:'na comunidade', card_saidas:'Saídas', nota_saidas:'custos registrados', vazio_grafico:'Sem entradas ainda. Registre a primeira venda abaixo e o gráfico se preenche.', vazio_produtos:'Nenhum produto ainda.<br>Crie o primeiro e eu monto o plano de lançamento em etapas.', txt_vendas_min:'vendas', txt_meta_min:'meta', txt_mes_min:'mês', txt_etapas_min:'etapas', etq_na_comunidade:'na comunidade', etq_rascunho:'rascunho', btn_plano:'Plano', btn_mais_venda:'+ Venda', btn_publicado:'Publicado', btn_publicar:'Publicar', btn_excluir:'Excluir', vazio_lancamentos:'Nada registrado ainda.', tbl_descricao:'Descrição', tbl_valor:'Valor', vazio_metas:'Nenhuma meta ainda. Crie uma pra eu calcular quanto guardar por mês.', txt_de:'de', txt_ate:'até', txt_guarde:'Guarde', txt_pra_chegar_la:'pra chegar lá', txt_meta_batida:'Meta batida! 🎉', btn_mais_guardar:'+ Guardar', toast_preencha_meta:'Preencha o nome e o valor da meta.', toast_meta_criada:'Meta criada.', toast_informe_valor:'Informe um valor.', toast_guardado_total:'Guardado! Total na meta:', vazio_radar:'Ainda não detectei gasto recorrente — preciso da mesma despesa aparecer em pelo menos 2 meses diferentes.', txt_total_recorrente:'Total recorrente detectado:', etp_comprado:'Comprado', etp_anunciado:'Anunciado', etp_vendido:'Vendido', vazio_estoque:'Nenhum item ainda. Adicione o que você comprou pra revender.', txt_pago:'Pago:', btn_avancar:'Avançar', toast_de_nome_item:'Dê um nome ao item.', toast_nome_produto:'Diz o nome do produto.', aviso_preencha_tres:'Preencha os três campos.', vered_parcelar_bom:'Parcelar sai igual ou mais barato que à vista — geralmente vale a pena, contanto que você consiga pagar todas as parcelas em dia.', vered_juro_baixo:'O juro embutido é baixo. Se você não tem o dinheiro todo agora, parcelar é razoável.', vered_juro_alto:'O juro embutido é alto. Se você tem o valor à vista, quase sempre compensa mais pagar à vista (ou negociar desconto) do que parcelar.', txt_total_parcelado:'Total parcelado', txt_diferenca_avista:'Diferença pro à vista', txt_juro_embutido:'Juro embutido', toast_min_2_produtos:'Coloque pelo menos 2 produtos pra comparar.', vazio_desafio:'Nenhum desafio ativo. Toque em "Ver desafio" pra começar um.', txt_dias:'dias', txt_guardado_ate_agora:'Guardado até agora', txt_progresso:'Progresso', txt_guardado:'Guardado', btn_reiniciar_desafio:'Reiniciar desafio', confirm_reiniciar_desafio:'Reiniciar o desafio do zero?', vazio_alertas:'Nenhum produto na lista ainda.', txt_quer_pagar_ate:'Quer pagar até', txt_ultima_checagem:'Última checagem:', btn_verificar_agora:'Verificar agora', txt_verificando:'Verificando...', toast_preencha_alerta:'Preencha o nome e o preço que você quer pagar.', txt_renovar_assinatura:'Renovar assinatura', vazio_lembretes:'Nenhum lembrete ainda.', txt_em:'em', txt_atrasado_ha:'atrasado há', txt_e_hoje:'é hoje', txt_chegando:'chegando', toast_preencha_lembrete:'Preencha o nome e a data.', toast_nome_antes_publicar:'Coloque seu nome antes de publicar.', toast_descricao_antes_publicar:'Escreva "para quem é" antes de publicar. Toque no produto para editar.', toast_primeiro_curso:'🌱 Primeiro curso publicado!', toast_publicado_comunidade:'Publicado na comunidade.', toast_publicado_so_aparelho:'Publicado só neste aparelho.', toast_crie_produto_primeiro:'Crie o produto primeiro, depois publique.', toast_escolha_produto:'Escolha o produto e toque em "Publicar".', aviso_com_publico:'Tudo que você publica aqui fica visível para as outras pessoas que usam o app.', aviso_com_local:'Este aparelho está guardando os cursos só localmente, então você vê apenas os seus. Abra pelo link publicado para ver os de todo mundo.', txt_todos:'Todos', vazio_cursos_categoria:'Ainda não há curso nesta categoria.<br>Seja a primeira pessoa a publicar — vá em "Meu negócio", crie o produto e toque em Publicar.', txt_primeiro_curso:'primeiro curso', txt_por:'Por', txt_gratuito:'Gratuito', txt_alunos:'alunos', btn_seu_curso:'Seu curso', btn_abrir_curso:'Abrir curso', btn_ver_curso:'Ver curso', vazio_perguntas:'Nenhuma pergunta ainda. Seja a primeira pessoa a perguntar.', titulo_perguntas:'PERGUNTAS', placeholder_pergunta_curso:'Escreva sua dúvida sobre o curso', btn_enviar_pergunta:'Enviar pergunta', aviso_nome_para_perguntar:'Coloque seu nome no perfil pra poder perguntar.', titulo_avaliacoes:'AVALIAÇÕES', vazio_avaliacoes:'Ainda sem avaliação.', placeholder_comentario:'Comentário (opcional)', aviso_toque_nota:'Toque numa nota acima.', txt_sem_descricao:'Sem descrição.', txt_alunos_cap:'Alunos', txt_horario:'Horário', txt_falar_whatsapp:'Falar com quem criou (WhatsApp)', txt_contato:'Contato', txt_entrar_grupo:'Entrar no grupo do curso', aviso_curso_e_seu:'Este curso é seu. As vendas você registra em "Meu negócio".', aviso_ja_matriculado:'Você já está matriculado. O curso aparece em "Meus cursos".', btn_quero_curso:'Quero este curso', btn_entrar_curso:'Entrar no curso', aviso_pagamento_combinado:'O pagamento é combinado direto com quem criou o curso. Confira quem é a pessoa antes de transferir qualquer valor.', toast_esta_em_meus_cursos:'Pronto — está em "Meus cursos".', txt_nota_escolhida:'Nota escolhida:', txt_toque_enviar:'toque em "Enviar" abaixo.', btn_enviar_avaliacao:'Enviar avaliação', toast_avaliacao_enviada:'Avaliação enviada. Obrigado!', toast_pergunta_enviada:'Pergunta enviada.', vazio_matriculas:'Você ainda não pegou nenhum curso.<br>Dê uma olhada na Comunidade.', btn_sair:'Sair', vazio_lista_conversas:'Nenhuma conversa ainda.', confirm_excluir_conversa:'Excluir esta conversa?', confirm_apagar_conversa:'Apagar toda a conversa?', et_tema_texto:'Definir o tema e para quem é', et_tema_dica:'Uma frase: "ensino X para pessoas que querem Y".', et_roteiro_texto:'Montar o roteiro das aulas', et_roteiro_dica:'Liste os módulos antes de gravar qualquer coisa.', et_gravar_texto:'Gravar o conteúdo', et_gravar_dica:'Celular no tripé e boa luz já resolvem o começo.', et_preco_texto:'Definir o preço', et_preco_dica:'Use o simulador de lucro para checar se o preço fecha a conta.', et_pagina_texto:'Escrever a página de vendas', et_pagina_dica:'Promessa, para quem é, o que tem dentro, preço e garantia.', et_publicar_com_texto:'Publicar na Comunidade', et_publicar_com_dica:'Aparece para todo mundo aqui dentro, sem taxa.', et_publicar_fora_texto:'Publicar numa plataforma de fora', et_publicar_fora_dica:'Kiwify, Hotmart ou Eduzz cuidam de pagamento e hospedagem.', et_divulgar_texto:'Divulgar nos primeiros 7 dias', et_divulgar_dica:'Avise sua lista, poste nas redes, peça indicação.', tit_editar_produto:'Editar produto', toast_de_nome_produto:'Dê um nome ao produto para salvar.', toast_produto_salvo:'Produto salvo.', confirm_excluir_produto:'Excluir', toast_informe_valor_recebido:'Informe o valor recebido.', txt_venda_de:'Venda', toast_venda_registrada:'Venda registrada.', toast_valor_maior_zero:'Informe um valor maior que zero.', aviso_preencha_lucro:'Preencha ao menos o lucro mensal para eu simular.', txt_mes_min_cap:'Mês', txt_se_paga_em:'Se paga em', txt_menos_1_mes:'menos de 1 mês', txt_meses:'meses', txt_sem_investimento:'sem investimento', txt_por_hora_dedicada:'Por hora dedicada', txt_lucro_12_meses:'Lucro em 12 meses', txt_saldo_fim_ano:'Saldo no fim do ano', txt_saldo_mes_a_mes:'Saldo mês a mês', txt_venda_direta_sem_taxa:'venda direta (sem taxa)', aviso_preencha_pagou:'Preencha quanto você pagou pelo produto.', txt_preco_sugerido:'Preço de venda sugerido', txt_taxa_da:'Taxa da', txt_fixo:'fixo', txt_lucro_liquido_real:'Seu lucro líquido real', aviso_taxas_referencia:'Taxas de referência de 2026 — a plataforma pode cobrar um pouco diferente conforme a categoria exata do produto. Confirme no painel de vendedor antes de publicar o anúncio.', rel_titulo:'RELATÓRIO DO NEGÓCIO', rel_gerado_em:'Gerado em', rel_resumo_geral:'RESUMO GERAL', rel_faturamento_total:'Faturamento total:', rel_saidas_totais:'Saídas totais:', rel_saldo:'Saldo:', rel_vendas_totais:'Vendas totais:', rel_ticket_medio:'Ticket médio:', rel_ultimos_6_meses:'ÚLTIMOS 6 MESES', rel_entrou:'entrou', rel_saiu:'saiu', rel_nenhum_produto:'Nenhum produto cadastrado.', rel_ultimas_movimentacoes:'ÚLTIMAS MOVIMENTAÇÕES', rel_nenhuma_movimentacao:'Nenhuma movimentação registrada.', sug_investimento_sobra:'Sugestão de investimento pra sobra de caixa', sug_economizar_mais:'Como posso economizar mais esse mês?', sug_negocio_saudavel:'Meu negócio está saudável?', sug_aumentar_ticket:'Como aumentar meu ticket médio?', sug_baixar_preco:'Vale a pena baixar meu preço?', sug_priorizar_produto:'Qual produto devo priorizar agora?', erro_bloqueado_file:'O navegador bloqueou essa chamada — isso costuma acontecer quando o app é aberto direto do arquivo baixado (file://) em vez de um link publicado (https://). Suba este site num host como Netlify e abra por lá.', erro_sem_servidor:'Não consegui alcançar o servidor. Verifique a conexão e tente de novo.', erro_404_funcao:'Não achei a função do servidor (/.netlify/functions/chat). Se você está testando fora do Netlify publicado, isso é esperado — só funciona no site publicado de verdade.', erro_429_muitas_msgs:'Muitas mensagens em pouco tempo. Espere alguns segundos e envie de novo.', erro_recusado:'O servidor recusou a chamada', erro_erro:'Erro', erro_tente_novo_instantes:'Tente de novo em instantes.', erro_resposta_vazia:'A resposta veio vazia. Reformule a pergunta e tente de novo.', diag_sem_dados:'Ainda não há dados suficientes. Crie um produto e registre a primeira venda ou gasto pra eu conseguir avaliar sua saúde financeira.', diag_saldo_negativo:'Seu saldo está negativo: as saídas já passaram as entradas em', diag_entradas_cairam:'Suas entradas caíram bastante em relação ao mês passado', diag_saidas_altas:'Suas saídas deste mês já comem mais de 70% do que entrou.', diag_produto_abaixo_meta:'está com', diag_bem_abaixo_da_meta:'bem abaixo da meta de', diag_nenhum_alerta:'Nenhum alerta agora. Saldo positivo e nada fora do esperado nos seus produtos.', diag_sem_dados_ainda:'Sem dados ainda', diag_saude_boa:'Saúde financeira: boa', diag_saude_atencao:'Saúde financeira: atenção', diag_saude_risco:'Saúde financeira: risco', diag_comparado_mes_passado:'Comparado ao mês passado', erro_arquivo_direto:'Este arquivo está aberto direto (file://).', erro_arquivo_direto_detalhe:'O login do Firebase não funciona assim — precisa ser https:// ou localhost. Publique o arquivo (Netlify Drop, por exemplo) e abra pelo link.', erro_dentro_iframe:'O app está dentro de outro app (iframe).', erro_dentro_iframe_detalhe:'O login com Google costuma ser bloqueado aqui dentro. Se o Google falhar, tente abrir o link publicado direto no navegador do celular.', erro_login_indisponivel:'Serviço de login indisponível agora.', erro_email_senha_obrigatorios:'Email e senha (mín. 6 caracteres) são obrigatórios.', erro_email_ja_tem_conta:'Esse email já tem conta — toque em "Entrar".', erro_email_invalido:'Email inválido.', erro_senha_fraca:'Senha fraca — use pelo menos 6 caracteres.', erro_senha_incorreta:'Senha incorreta.', erro_conta_nao_encontrada:'Não achei conta com esse email — toque em "Criar conta".', erro_credenciais_incorretas:'Email ou senha incorretos.', erro_muitas_tentativas:'Muitas tentativas. Espere um pouco e tente de novo.', erro_sem_conexao_firebase:'Sem conexão com o servidor do Firebase agora.', erro_dominio_nao_autorizado:'Este endereço não está autorizado no Firebase (Authentication → Settings → Authorized domains).', erro_email_senha_desativado:'O login por Email/Senha não está ativado no Firebase ainda (Authentication → Sign-in method).', erro_nao_consegui_completar:'Não consegui completar.', erro_popup_bloqueado:'O navegador bloqueou a janela do Google. Permita pop-ups pra este site e tente de novo.', erro_popup_cancelado:'A janela do Google foi cancelada. Tente de novo.', erro_popup_fechado:'Você fechou a janela do Google antes de terminar.', erro_dominio_nao_autorizado_google:'Este endereço não está autorizado no Firebase (Authentication → Settings → Authorized domains) — adicione o domínio de onde você está abrindo o app.', erro_google_desativado:'O login com Google não está ativado no Firebase ainda (Authentication → Sign-in method).', erro_nao_consegui_google:'Não consegui entrar com Google.', mic_nao_ouvi:'Não ouvi nada. Fale mais perto do microfone.', mic_sem_disponivel:'Nenhum microfone disponível neste aparelho.', mic_conexao_insuficiente:'Conexão insuficiente para reconhecer a voz agora.', mic_nao_funcionou:'O microfone não funcionou. Tente de novo ou digite.', mic_sub_iframe:'o app está aberto dentro de outro aplicativo, e o microfone fica bloqueado aí', mic_passo_iframe_1:'Toque no botão de <strong>abrir em nova aba</strong> ou copie o endereço desta página.', mic_passo_iframe_2:'Cole o endereço no <strong>navegador do celular</strong> (Safari, Chrome).', mic_passo_iframe_3:'Quando o navegador perguntar, escolha <strong>Permitir</strong> para o microfone.', mic_passo_iframe_4:'Enquanto isso, você pode usar o <strong>microfone do próprio teclado</strong> para ditar aqui.', mic_sub_inseguro:'o microfone só funciona em endereço https', mic_passo_inseguro_1:'Abra o <strong>link publicado</strong> do app, não o arquivo salvo no aparelho.', mic_passo_inseguro_2:'Confira se o endereço começa com <strong>https://</strong>.', mic_passo_inseguro_3:'Recarregue a página e toque no microfone de novo.', mic_sub_bloqueado:'o navegador bloqueou o acesso — siga o passo a passo', mic_passo_ios_1:'Abra os <strong>Ajustes</strong> do iPhone.', mic_passo_ios_2:'Desça até <strong>Safari</strong> (ou o navegador que você usa) e toque nele.', mic_passo_ios_3:'Toque em <strong>Microfone</strong> e escolha <strong>Permitir</strong>.', mic_passo_ios_4:'Volte aqui, recarregue e toque no microfone de novo.', mic_passo_outro_1:'Toque no cadeado ou no "ⓘ" ao lado do endereço, lá em cima.', mic_passo_outro_2:'Procure <strong>Microfone</strong> nas permissões do site.', mic_passo_outro_3:'Mude de "Bloquear" para <strong>Permitir</strong>.', mic_passo_outro_4:'Recarregue a página e toque no microfone de novo.'},
    'pt-PT': { nav_conversa:'Conversa', nav_negocio:'O meu negócio', nav_comunidade:'Comunidade', nav_cursos:'Os meus cursos', nav_conta:'A minha conta', secao_conversas:'Conversas', btn_nova_conversa:'Nova conversa', input_placeholder:'Diz-me o que precisas…' , desc_negocio:'Os teus produtos, as tuas vendas e o saldo — tudo guardado neste dispositivo.', btn_criar_produto:'Criar produto', h3_tutor:'Tutor do negócio', lbl_pergunta_tutor:'Pergunta ao tutor', placeholder_pergunta_tutor:'O meu lucro está bom para este ramo? Como reduzo a minha despesa?', btn_perguntar:'Perguntar', h3_vendas:'Vendas dos últimos 6 meses', h3_meus_produtos:'Os meus produtos', btn_novo_produto:'Novo produto', h3_simulador:'Simulador de lucro', btn_abrir_simulador:'Abrir simulador', aviso_simulador:'Projeta quanto um produto rende antes de começar: quanto investes, quanto lucras por mês, em quanto tempo se paga.', h3_precificador:'Definidor de preços automático', btn_abrir_precificador:'Abrir definidor de preços', aviso_precificador:'Diz quanto pagaste e o lucro que queres, e calcula o preço de venda já considerando a taxa da plataforma.', h3_metas:'Metas de poupança', btn_nova_meta:'Nova meta', h3_radar:'Radar de despesa fixa', h3_estoque:'Stock para revenda', btn_novo_item:'Novo item', h3_gerador_anuncio:'Gerador de anúncio', btn_criar_anuncio:'Criar anúncio', aviso_anuncio:'Descreve o produto e ele escreve o texto do anúncio pronto a colar.', h3_parcelar:'Vale a pena parcelar?', btn_comparar:'Comparar', aviso_parcelar:'Compara o preço a pronto com o parcelado e mostra quanto de juros estás a pagar de verdade.', h3_comparador:'Comparador de produtos', aviso_comparador:'Coloca até 4 produtos e ele pesquisa e monta uma tabela com preço, prós e contras de cada um.', h3_desafio:'Desafio de poupança', btn_ver_desafio:'Ver desafio', h3_relatorio:'Relatório do negócio', btn_gerar_relatorio:'Gerar relatório', aviso_relatorio:'Resumo em texto pronto a descarregar e enviar ao contabilista ou guardar de registo.', h3_produtos_olho:'Produtos de olho (preço)', btn_add_produto_olho:'Adicionar produto', aviso_produtos_olho:'Isto não fica a verificar o preço sozinho — quando tocares em "Verificar agora", pesquiso o preço atual e comparo com o que queres pagar.', h3_lembretes:'Lembretes', btn_novo_lembrete:'Novo lembrete', aviso_lembretes:'Repor stock, renovar subscrição, qualquer coisa com data para não esquecer.', h3_movimentacoes:'Movimentações reais', lbl_tipo:'Tipo', opt_entrada:'Entrada', opt_saida:'Saída', lbl_valor_reais:'Valor (R$)', lbl_do_que_se_trata:'Do que se trata', btn_registrar_movimentacao:'Registar movimentação', btn_publicar_curso:'Publicar curso', desc_comunidade:'Cursos criados por pessoas reais aqui dentro. Ensina o que sabes, aprende o que ainda não sabes.', desc_cursos:'O que obtiveste na comunidade fica aqui.', tit_anexar:'Anexar', sub_anexar:'envia uma foto do produto ou um PDF', opc_tirar_foto:'Tirar foto', opc_galeria_pdf:'Galeria ou PDF', tit_idioma:'Escolhe o teu idioma', sub_idioma:'isto ajusta o reconhecimento de voz do microfone', tit_aparencia:'Aparência', sub_aparencia:'escolhe como a app aparece para ti', tit_mic:'Libertar o microfone', btn_tentar_mic:'Já libertei, tentar de novo', sub_simulador:'projeção de 12 meses com os teus números', lbl_investimento_inicial:'Investimento inicial (R$)', lbl_lucro_mes:'Lucro líquido por mês (R$)', lbl_horas_semana:'Horas por semana', btn_calcular:'Calcular', sub_precificador:'taxas reais de 2026 já incluídas no cálculo', lbl_quanto_pagou_produto:'Quanto pagaste pelo produto (R$)', lbl_lucro_percentual:'Lucro que queres, sobre o que pagaste (%)', lbl_onde_vai_vender:'Onde vais vender', opt_ml_classico:'Mercado Livre — Clássico', opt_ml_premium:'Mercado Livre — Premium', opt_shopee:'Shopee', opt_direto:'Direto (OLX, Enjoei, Instagram, WhatsApp) — sem taxa', btn_calcular_preco:'Calcular preço de venda', tit_nova_meta:'Nova meta de poupança', sub_nova_meta:'calcula quanto guardar por mês para lá chegar', lbl_nome_meta:'Nome da meta', lbl_valor_juntar:'Valor que queres juntar (R$)', lbl_ate_quando:'Até quando', btn_criar_meta:'Criar meta', tit_guardar_meta:'Guardar valor na meta', lbl_quanto_guardou:'Quanto guardaste agora (R$)', btn_guardar:'Guardar', lbl_nome_item:'Nome do item', lbl_quanto_pagou:'Quanto pagaste (R$)', btn_add_estoque:'Adicionar ao stock', sub_anuncio:'texto pronto a colar no anúncio', lbl_nome_produto:'Nome do produto', lbl_estado_produto:'Estado', opt_novo_caixa:'Novo, na caixa', opt_seminovo:'Seminovo', opt_usado_bom:'Usado, bom estado', opt_usado_marcas:'Usado, com marcas de uso', lbl_preco_reais:'Preço (R$)', lbl_detalhes_extras:'Detalhes extra (opcional)', btn_gerar_anuncio:'Gerar anúncio', sub_parcelar:'compara a pronto com parcelado', lbl_preco_avista:'Preço a pronto (R$)', lbl_numero_parcelas:'Número de prestações', lbl_valor_parcela:'Valor de cada prestação (R$)', sub_comparador:'de 2 a 4 produtos — pesquisa e monta a tabela', lbl_produto_1:'Produto 1', lbl_produto_2:'Produto 2', lbl_produto_3:'Produto 3 (opcional)', lbl_produto_4:'Produto 4 (opcional)', btn_comparar_agora:'Comparar agora', sub_desafio:'toca em cada dia à medida que fores guardando o valor', lbl_escolha_desafio:'Escolhe o desafio', opt_desafio_1:'R$1 a R$100 crescente (100 dias, junta R$5.050)', opt_desafio_2:'R$2 a R$200 crescente (100 dias, junta R$10.100)', opt_desafio_5:'R$5 fixo por semana (52 semanas, junta R$260)', btn_comecar_desafio:'Começar este desafio', sub_relatorio:'pronto a descarregar', btn_baixar_relatorio:'Descarregar como ficheiro de texto', tit_produto_olho:'Produto de olho', sub_produto_olho:'tocas em "verificar" quando quiseres saber o preço de agora', lbl_nome_produto_alerta:'Nome do produto', lbl_link_opcional:'Link (opcional)', lbl_quanto_quer_pagar:'Quanto queres pagar (R$)', btn_adicionar:'Adicionar', h3_lembretes_novo:'Novo lembrete', lbl_do_que_se_trata_2:'Do que se trata', lbl_tipo_lembrete:'Tipo', opt_repor_estoque:'Repor stock', opt_renovar_assinatura:'Renovar subscrição/ferramenta', opt_outro:'Outro', lbl_data:'Data', btn_criar_lembrete:'Criar lembrete', sub_produto:'um produto = um curso, ebook ou mentoria que vais vender', lbl_nome_produto_2:'Nome do produto', lbl_formato:'Formato', opt_curso_video:'Curso em vídeo', opt_ebook:'Ebook', opt_mentoria:'Mentoria', opt_planilha:'Folha de cálculo ou template', opt_comunidade_paga:'Comunidade paga', lbl_preco_reais_2:'Preço (R$)', lbl_categoria:'Categoria', lbl_para_quem_e:'Para quem é', lbl_horario_aulas:'Horário das aulas (se houver)', lbl_contato_duvida:'Contacto para tirar dúvidas (WhatsApp, Instagram, etc)', lbl_link_grupo:'Link do grupo (opcional)', lbl_meta_vendas:'Meta de vendas por mês', btn_salvar_produto:'Guardar produto', sub_etapas:'marca à medida que fores terminando', tit_registrar_venda:'Registar venda', lbl_quantidade_vendida:'Quantidade vendida', lbl_valor_unidade:'Valor recebido por unidade (R$)', btn_confirmar_venda:'Confirmar venda', aba_entrar:'Entrar', aba_criar_conta:'Criar conta', lbl_email:'Email', placeholder_email:'tu@email.com', lbl_senha:'Palavra-passe', placeholder_senha:'mínimo 6 caracteres', btn_entrar:'Entrar', btn_criar_conta_2:'Criar conta', txt_ou:'ou', txt_continuar_google:'Continuar com Google', aviso_login_indisponivel:'Não consegui carregar o serviço de login agora (sem internet, ou o navegador bloqueou). Verifica a ligação e tenta novamente.', logado_como:'sessão iniciada como', lbl_como_chamado:'Como queres ser chamado', placeholder_nome_exemplo:'Ana Ribeiro', lbl_uma_linha_sobre_voce:'Uma linha sobre ti', placeholder_bio_exemplo:'Trabalho com marcenaria há 12 anos', btn_salvar:'Guardar', btn_sair_conta:'Sair desta conta', toast_salvo:'Guardado.', confirm_sair_conta:'Sair desta conta?', toast_saiu:'Saíste.', card_faturamento:'Faturação', nota_faturamento:'tudo o que entrou', card_vendas:'Vendas', nota_vendas:'unidades vendidas', card_ticket:'Ticket médio', nota_ticket:'por venda', card_saldo:'Saldo', nota_saldo:'entradas menos saídas', card_produtos:'Produtos', nota_produtos:'na comunidade', card_saidas:'Saídas', nota_saidas:'custos registados', vazio_grafico:'Ainda sem entradas. Regista a primeira venda abaixo e o gráfico preenche-se.', vazio_produtos:'Ainda nenhum produto.<br>Cria o primeiro e eu monto o plano de lançamento em etapas.', txt_vendas_min:'vendas', txt_meta_min:'meta', txt_mes_min:'mês', txt_etapas_min:'etapas', etq_na_comunidade:'na comunidade', etq_rascunho:'rascunho', btn_plano:'Plano', btn_mais_venda:'+ Venda', btn_publicado:'Publicado', btn_publicar:'Publicar', btn_excluir:'Excluir', vazio_lancamentos:'Nada registado ainda.', tbl_descricao:'Descrição', tbl_valor:'Valor', vazio_metas:'Ainda nenhuma meta. Cria uma para eu calcular quanto guardar por mês.', txt_de:'de', txt_ate:'até', txt_guarde:'Guarda', txt_pra_chegar_la:'para lá chegar', txt_meta_batida:'Meta atingida! 🎉', btn_mais_guardar:'+ Guardar', toast_preencha_meta:'Preenche o nome e o valor da meta.', toast_meta_criada:'Meta criada.', toast_informe_valor:'Indica um valor.', toast_guardado_total:'Guardado! Total na meta:', vazio_radar:'Ainda não detetei despesa recorrente — preciso que a mesma despesa apareça em pelo menos 2 meses diferentes.', txt_total_recorrente:'Total recorrente detetado:', etp_comprado:'Comprado', etp_anunciado:'Anunciado', etp_vendido:'Vendido', vazio_estoque:'Ainda nenhum item. Adiciona o que compraste para revender.', txt_pago:'Pago:', btn_avancar:'Avançar', toast_de_nome_item:'Dá um nome ao item.', toast_nome_produto:'Diz o nome do produto.', aviso_preencha_tres:'Preenche os três campos.', vered_parcelar_bom:'Parcelar sai igual ou mais barato que a pronto — geralmente vale a pena, desde que consigas pagar todas as prestações a tempo.', vered_juro_baixo:'O juro embutido é baixo. Se não tens o dinheiro todo agora, parcelar é razoável.', vered_juro_alto:'O juro embutido é alto. Se tens o valor a pronto, quase sempre compensa mais pagar a pronto (ou negociar desconto) do que parcelar.', txt_total_parcelado:'Total parcelado', txt_diferenca_avista:'Diferença para o a pronto', txt_juro_embutido:'Juro embutido', toast_min_2_produtos:'Coloca pelo menos 2 produtos para comparar.', vazio_desafio:'Nenhum desafio ativo. Toca em "Ver desafio" para começar um.', txt_dias:'dias', txt_guardado_ate_agora:'Guardado até agora', txt_progresso:'Progresso', txt_guardado:'Guardado', btn_reiniciar_desafio:'Reiniciar desafio', confirm_reiniciar_desafio:'Reiniciar o desafio do zero?', vazio_alertas:'Ainda nenhum produto na lista.', txt_quer_pagar_ate:'Quer pagar até', txt_ultima_checagem:'Última verificação:', btn_verificar_agora:'Verificar agora', txt_verificando:'A verificar...', toast_preencha_alerta:'Preenche o nome e o preço que queres pagar.', txt_renovar_assinatura:'Renovar subscrição', vazio_lembretes:'Ainda nenhum lembrete.', txt_em:'em', txt_atrasado_ha:'atrasado há', txt_e_hoje:'é hoje', txt_chegando:'a chegar', toast_preencha_lembrete:'Preenche o nome e a data.', toast_nome_antes_publicar:'Coloca o teu nome antes de publicar.', toast_descricao_antes_publicar:'Escreve "para quem é" antes de publicar. Toca no produto para editar.', toast_primeiro_curso:'🌱 Primeiro curso publicado!', toast_publicado_comunidade:'Publicado na comunidade.', toast_publicado_so_aparelho:'Publicado só neste aparelho.', toast_crie_produto_primeiro:'Cria o produto primeiro, depois publica.', toast_escolha_produto:'Escolhe o produto e toca em "Publicar".', aviso_com_publico:'Tudo o que publicas aqui fica visível para as outras pessoas que usam a app.', aviso_com_local:'Este aparelho está a guardar os cursos só localmente, por isso só vês os teus. Abre pelo link publicado para ver os de todos.', txt_todos:'Todos', vazio_cursos_categoria:'Ainda não há curso nesta categoria.<br>Sê a primeira pessoa a publicar — vai a "O meu negócio", cria o produto e toca em Publicar.', txt_primeiro_curso:'primeiro curso', txt_por:'Por', txt_gratuito:'Gratuito', txt_alunos:'alunos', btn_seu_curso:'O teu curso', btn_abrir_curso:'Abrir curso', btn_ver_curso:'Ver curso', vazio_perguntas:'Ainda nenhuma pergunta. Sê a primeira pessoa a perguntar.', titulo_perguntas:'PERGUNTAS', placeholder_pergunta_curso:'Escreve a tua dúvida sobre o curso', btn_enviar_pergunta:'Enviar pergunta', aviso_nome_para_perguntar:'Coloca o teu nome no perfil para poderes perguntar.', titulo_avaliacoes:'AVALIAÇÕES', vazio_avaliacoes:'Ainda sem avaliação.', placeholder_comentario:'Comentário (opcional)', aviso_toque_nota:'Toca numa nota acima.', txt_sem_descricao:'Sem descrição.', txt_alunos_cap:'Alunos', txt_horario:'Horário', txt_falar_whatsapp:'Falar com quem criou (WhatsApp)', txt_contato:'Contacto', txt_entrar_grupo:'Entrar no grupo do curso', aviso_curso_e_seu:'Este curso é teu. As vendas registas em "O meu negócio".', aviso_ja_matriculado:'Já estás inscrito. O curso aparece em "Os meus cursos".', btn_quero_curso:'Quero este curso', btn_entrar_curso:'Entrar no curso', aviso_pagamento_combinado:'O pagamento é combinado diretamente com quem criou o curso. Confirma quem é a pessoa antes de transferires qualquer valor.', toast_esta_em_meus_cursos:'Pronto — está em "Os meus cursos".', txt_nota_escolhida:'Nota escolhida:', txt_toque_enviar:'toca em "Enviar" abaixo.', btn_enviar_avaliacao:'Enviar avaliação', toast_avaliacao_enviada:'Avaliação enviada. Obrigado!', toast_pergunta_enviada:'Pergunta enviada.', vazio_matriculas:'Ainda não obtiveste nenhum curso.<br>Dá uma vista de olhos na Comunidade.', btn_sair:'Sair', vazio_lista_conversas:'Ainda nenhuma conversa.', confirm_excluir_conversa:'Excluir esta conversa?', confirm_apagar_conversa:'Apagar toda a conversa?', et_tema_texto:'Definir o tema e para quem é', et_tema_dica:'Uma frase: "ensino X para pessoas que querem Y".', et_roteiro_texto:'Montar o guião das aulas', et_roteiro_dica:'Lista os módulos antes de gravar seja o que for.', et_gravar_texto:'Gravar o conteúdo', et_gravar_dica:'Telemóvel no tripé e boa luz já resolvem o começo.', et_preco_texto:'Definir o preço', et_preco_dica:'Usa o simulador de lucro para verificar se o preço fecha as contas.', et_pagina_texto:'Escrever a página de vendas', et_pagina_dica:'Promessa, para quem é, o que tem dentro, preço e garantia.', et_publicar_com_texto:'Publicar na Comunidade', et_publicar_com_dica:'Aparece para todos aqui dentro, sem taxa.', et_publicar_fora_texto:'Publicar numa plataforma externa', et_publicar_fora_dica:'Kiwify, Hotmart ou Eduzz tratam do pagamento e alojamento.', et_divulgar_texto:'Divulgar nos primeiros 7 dias', et_divulgar_dica:'Avisa a tua lista, publica nas redes, pede indicações.', tit_editar_produto:'Editar produto', toast_de_nome_produto:'Dá um nome ao produto para guardar.', toast_produto_salvo:'Produto guardado.', confirm_excluir_produto:'Excluir', toast_informe_valor_recebido:'Indica o valor recebido.', txt_venda_de:'Venda', toast_venda_registrada:'Venda registada.', toast_valor_maior_zero:'Indica um valor maior que zero.', aviso_preencha_lucro:'Preenche pelo menos o lucro mensal para eu simular.', txt_mes_min_cap:'Mês', txt_se_paga_em:'Paga-se em', txt_menos_1_mes:'menos de 1 mês', txt_meses:'meses', txt_sem_investimento:'sem investimento', txt_por_hora_dedicada:'Por hora dedicada', txt_lucro_12_meses:'Lucro em 12 meses', txt_saldo_fim_ano:'Saldo no fim do ano', txt_saldo_mes_a_mes:'Saldo mês a mês', txt_venda_direta_sem_taxa:'venda direta (sem taxa)', aviso_preencha_pagou:'Preenche quanto pagaste pelo produto.', txt_preco_sugerido:'Preço de venda sugerido', txt_taxa_da:'Taxa da', txt_fixo:'fixo', txt_lucro_liquido_real:'O teu lucro líquido real', aviso_taxas_referencia:'Taxas de referência de 2026 — a plataforma pode cobrar um pouco diferente conforme a categoria exata do produto. Confirma no painel de vendedor antes de publicar o anúncio.', rel_titulo:'RELATÓRIO DO NEGÓCIO', rel_gerado_em:'Gerado em', rel_resumo_geral:'RESUMO GERAL', rel_faturamento_total:'Faturação total:', rel_saidas_totais:'Saídas totais:', rel_saldo:'Saldo:', rel_vendas_totais:'Vendas totais:', rel_ticket_medio:'Ticket médio:', rel_ultimos_6_meses:'ÚLTIMOS 6 MESES', rel_entrou:'entrou', rel_saiu:'saiu', rel_nenhum_produto:'Nenhum produto registado.', rel_ultimas_movimentacoes:'ÚLTIMAS MOVIMENTAÇÕES', rel_nenhuma_movimentacao:'Nenhuma movimentação registada.', sug_investimento_sobra:'Sugestão de investimento para sobra de caixa', sug_economizar_mais:'Como posso poupar mais este mês?', sug_negocio_saudavel:'O meu negócio está saudável?', sug_aumentar_ticket:'Como aumentar o meu ticket médio?', sug_baixar_preco:'Vale a pena baixar o meu preço?', sug_priorizar_produto:'Que produto devo priorizar agora?', erro_bloqueado_file:'O navegador bloqueou esta chamada — isto costuma acontecer quando a app é aberta diretamente a partir do ficheiro descarregado (file://) em vez de um link publicado (https://). Coloca este site num alojamento como o Netlify e abre por lá.', erro_sem_servidor:'Não consegui alcançar o servidor. Verifica a ligação e tenta novamente.', erro_404_funcao:'Não encontrei a função do servidor (/.netlify/functions/chat). Se estás a testar fora do Netlify publicado, isto é esperado — só funciona no site publicado real.', erro_429_muitas_msgs:'Muitas mensagens em pouco tempo. Espera alguns segundos e envia novamente.', erro_recusado:'O servidor recusou a chamada', erro_erro:'Erro', erro_tente_novo_instantes:'Tenta novamente daqui a pouco.', erro_resposta_vazia:'A resposta veio vazia. Reformula a pergunta e tenta novamente.', diag_sem_dados:'Ainda não há dados suficientes. Cria um produto e regista a primeira venda ou despesa para eu conseguir avaliar a tua saúde financeira.', diag_saldo_negativo:'O teu saldo está negativo: as saídas já ultrapassaram as entradas em', diag_entradas_cairam:'As tuas entradas caíram bastante em relação ao mês passado', diag_saidas_altas:'As tuas saídas deste mês já consomem mais de 70% do que entrou.', diag_produto_abaixo_meta:'está com', diag_bem_abaixo_da_meta:'bem abaixo da meta de', diag_nenhum_alerta:'Nenhum alerta agora. Saldo positivo e nada fora do esperado nos teus produtos.', diag_sem_dados_ainda:'Ainda sem dados', diag_saude_boa:'Saúde financeira: boa', diag_saude_atencao:'Saúde financeira: atenção', diag_saude_risco:'Saúde financeira: risco', diag_comparado_mes_passado:'Comparado ao mês passado', erro_arquivo_direto:'Este ficheiro está aberto diretamente (file://).', erro_arquivo_direto_detalhe:'O login do Firebase não funciona assim — precisa de ser https:// ou localhost. Publica o ficheiro (Netlify Drop, por exemplo) e abre pelo link.', erro_dentro_iframe:'A app está dentro de outra app (iframe).', erro_dentro_iframe_detalhe:'O login com Google costuma ser bloqueado aqui dentro. Se o Google falhar, tenta abrir o link publicado diretamente no navegador do telemóvel.', erro_login_indisponivel:'Serviço de login indisponível agora.', erro_email_senha_obrigatorios:'Email e palavra-passe (mín. 6 caracteres) são obrigatórios.', erro_email_ja_tem_conta:'Esse email já tem conta — toca em "Entrar".', erro_email_invalido:'Email inválido.', erro_senha_fraca:'Palavra-passe fraca — usa pelo menos 6 caracteres.', erro_senha_incorreta:'Palavra-passe incorreta.', erro_conta_nao_encontrada:'Não encontrei conta com esse email — toca em "Criar conta".', erro_credenciais_incorretas:'Email ou palavra-passe incorretos.', erro_muitas_tentativas:'Muitas tentativas. Espera um pouco e tenta novamente.', erro_sem_conexao_firebase:'Sem ligação ao servidor do Firebase agora.', erro_dominio_nao_autorizado:'Este endereço não está autorizado no Firebase (Authentication → Settings → Authorized domains).', erro_email_senha_desativado:'O login por Email/Palavra-passe ainda não está ativado no Firebase (Authentication → Sign-in method).', erro_nao_consegui_completar:'Não consegui completar.', erro_popup_bloqueado:'O navegador bloqueou a janela do Google. Permite pop-ups para este site e tenta novamente.', erro_popup_cancelado:'A janela do Google foi cancelada. Tenta novamente.', erro_popup_fechado:'Fechaste a janela do Google antes de terminar.', erro_dominio_nao_autorizado_google:'Este endereço não está autorizado no Firebase (Authentication → Settings → Authorized domains) — adiciona o domínio de onde estás a abrir a app.', erro_google_desativado:'O login com Google ainda não está ativado no Firebase (Authentication → Sign-in method).', erro_nao_consegui_google:'Não consegui entrar com Google.', mic_nao_ouvi:'Não ouvi nada. Fala mais perto do microfone.', mic_sem_disponivel:'Nenhum microfone disponível neste aparelho.', mic_conexao_insuficiente:'Ligação insuficiente para reconhecer a voz agora.', mic_nao_funcionou:'O microfone não funcionou. Tenta novamente ou escreve.', mic_sub_iframe:'a app está aberta dentro de outra aplicação, e o microfone fica bloqueado aí', mic_passo_iframe_1:'Toca no botão de <strong>abrir em novo separador</strong> ou copia o endereço desta página.', mic_passo_iframe_2:'Cola o endereço no <strong>navegador do telemóvel</strong> (Safari, Chrome).', mic_passo_iframe_3:'Quando o navegador perguntar, escolhe <strong>Permitir</strong> para o microfone.', mic_passo_iframe_4:'Entretanto, podes usar o <strong>microfone do próprio teclado</strong> para ditar aqui.', mic_sub_inseguro:'o microfone só funciona em endereço https', mic_passo_inseguro_1:'Abre o <strong>link publicado</strong> da app, não o ficheiro guardado no aparelho.', mic_passo_inseguro_2:'Confirma se o endereço começa com <strong>https://</strong>.', mic_passo_inseguro_3:'Recarrega a página e toca no microfone de novo.', mic_sub_bloqueado:'o navegador bloqueou o acesso — segue o passo a passo', mic_passo_ios_1:'Abre as <strong>Definições</strong> do iPhone.', mic_passo_ios_2:'Desce até <strong>Safari</strong> (ou o navegador que usas) e toca nele.', mic_passo_ios_3:'Toca em <strong>Microfone</strong> e escolhe <strong>Permitir</strong>.', mic_passo_ios_4:'Volta aqui, recarrega e toca no microfone de novo.', mic_passo_outro_1:'Toca no cadeado ou no "ⓘ" ao lado do endereço, lá em cima.', mic_passo_outro_2:'Procura <strong>Microfone</strong> nas permissões do site.', mic_passo_outro_3:'Muda de "Bloquear" para <strong>Permitir</strong>.', mic_passo_outro_4:'Recarrega a página e toca no microfone de novo.'},
    'en-US': { nav_conversa:'Chat', nav_negocio:'My business', nav_comunidade:'Community', nav_cursos:'My courses', nav_conta:'My account', secao_conversas:'Conversations', btn_nova_conversa:'New chat', input_placeholder:'Tell me what you need…' , desc_negocio:'Your products, your sales, and the balance — all saved on this device.', btn_criar_produto:'Create product', h3_tutor:'Business tutor', lbl_pergunta_tutor:'Ask the tutor', placeholder_pergunta_tutor:'Is my profit good for this niche? How do I cut my expenses?', btn_perguntar:'Ask', h3_vendas:'Sales over the last 6 months', h3_meus_produtos:'My products', btn_novo_produto:'New product', h3_simulador:'Profit simulator', btn_abrir_simulador:'Open simulator', aviso_simulador:'Project how much a product earns before you start: how much to invest, how much you’ll profit monthly, and how long until it pays off.', h3_precificador:'Automatic pricing tool', btn_abrir_precificador:'Open pricing tool', aviso_precificador:'Tell it what you paid and the profit you want, and it calculates the sale price already factoring in the platform fee.', h3_metas:'Savings goals', btn_nova_meta:'New goal', h3_radar:'Fixed expense radar', h3_estoque:'Resale inventory', btn_novo_item:'New item', h3_gerador_anuncio:'Listing generator', btn_criar_anuncio:'Create listing', aviso_anuncio:'Describe the product and it writes the listing text ready to paste on Mercado Livre, Shopee, or OLX.', h3_parcelar:'Is it worth splitting the payment?', btn_comparar:'Compare', aviso_parcelar:'Compares the cash price with the installment price and shows how much interest you’re really paying.', h3_comparador:'Product comparator', aviso_comparador:'Add up to 4 products and it researches and builds a table with price, pros and cons of each.', h3_desafio:'Savings challenge', btn_ver_desafio:'View challenge', h3_relatorio:'Business report', btn_gerar_relatorio:'Generate report', aviso_relatorio:'Text summary ready to download and send to your accountant or keep on record.', h3_produtos_olho:'Watched products (price)', btn_add_produto_olho:'Add product', aviso_produtos_olho:'This doesn’t keep checking prices on its own all the time — when you tap "Check now", I really look up the current price and compare it with what you want to pay.', h3_lembretes:'Reminders', btn_novo_lembrete:'New reminder', aviso_lembretes:'Restocking, renewing a tool subscription, anything with a date so you don’t forget.', h3_movimentacoes:'Actual transactions', lbl_tipo:'Type', opt_entrada:'Income', opt_saida:'Expense', lbl_valor_reais:'Amount (R$)', lbl_do_que_se_trata:'What is it about', btn_registrar_movimentacao:'Record transaction', btn_publicar_curso:'Publish course', desc_comunidade:'Courses created by real people right here. Teach what you know, learn what you don’t yet.', desc_cursos:'What you got from the community stays here.', tit_anexar:'Attach', sub_anexar:'send a photo of the product or a PDF', opc_tirar_foto:'Take photo', opc_galeria_pdf:'Gallery or PDF', tit_idioma:'Choose your language', sub_idioma:'this adjusts the microphone’s voice recognition', tit_aparencia:'Appearance', sub_aparencia:'choose how the app looks for you', tit_mic:'Enable the microphone', btn_tentar_mic:'Already enabled it, try again', sub_simulador:'12-month projection with your own numbers', lbl_investimento_inicial:'Initial investment ($)', lbl_lucro_mes:'Net profit per month ($)', lbl_horas_semana:'Hours per week', btn_calcular:'Calculate', sub_precificador:'real 2026 fees already built into the calculation', lbl_quanto_pagou_produto:'How much you paid for the product ($)', lbl_lucro_percentual:'Profit you want, over what you paid (%)', lbl_onde_vai_vender:'Where you’ll sell', opt_ml_classico:'Mercado Livre — Classic', opt_ml_premium:'Mercado Livre — Premium', opt_shopee:'Shopee', opt_direto:'Direct (OLX, Enjoei, Instagram, WhatsApp) — no fee', btn_calcular_preco:'Calculate sale price', tit_nova_meta:'New savings goal', sub_nova_meta:'it calculates how much to save per month to get there', lbl_nome_meta:'Goal name', lbl_valor_juntar:'Amount you want to save ($)', lbl_ate_quando:'By when', btn_criar_meta:'Create goal', tit_guardar_meta:'Add money to the goal', lbl_quanto_guardou:'How much you just saved ($)', btn_guardar:'Save', lbl_nome_item:'Item name', lbl_quanto_pagou:'How much you paid ($)', btn_add_estoque:'Add to inventory', sub_anuncio:'text ready to paste into the listing', lbl_nome_produto:'Product name', lbl_estado_produto:'Condition', opt_novo_caixa:'New, in the box', opt_seminovo:'Like new', opt_usado_bom:'Used, good condition', opt_usado_marcas:'Used, with signs of wear', lbl_preco_reais:'Price ($)', lbl_detalhes_extras:'Extra details (optional)', btn_gerar_anuncio:'Generate listing', sub_parcelar:'compares cash price with installments', lbl_preco_avista:'Cash price ($)', lbl_numero_parcelas:'Number of installments', lbl_valor_parcela:'Amount of each installment ($)', sub_comparador:'2 to 4 products — it researches and builds the table', lbl_produto_1:'Product 1', lbl_produto_2:'Product 2', lbl_produto_3:'Product 3 (optional)', lbl_produto_4:'Product 4 (optional)', btn_comparar_agora:'Compare now', sub_desafio:'tap each day as you save the amount', lbl_escolha_desafio:'Choose the challenge', opt_desafio_1:'$1 to $100 increasing (100 days, saves $5,050)', opt_desafio_2:'$2 to $200 increasing (100 days, saves $10,100)', opt_desafio_5:'$5 fixed per week (52 weeks, saves $260)', btn_comecar_desafio:'Start this challenge', sub_relatorio:'ready to download', btn_baixar_relatorio:'Download as text file', tit_produto_olho:'Watched product', sub_produto_olho:'you tap "check now" whenever you want today’s price', lbl_nome_produto_alerta:'Product name', lbl_link_opcional:'Link (optional)', lbl_quanto_quer_pagar:'How much you want to pay ($)', btn_adicionar:'Add', h3_lembretes_novo:'New reminder', lbl_do_que_se_trata_2:'What it’s about', lbl_tipo_lembrete:'Type', opt_repor_estoque:'Restock', opt_renovar_assinatura:'Renew subscription/tool', opt_outro:'Other', lbl_data:'Date', btn_criar_lembrete:'Create reminder', sub_produto:'a product = a course, ebook, or mentorship you’ll sell', lbl_nome_produto_2:'Product name', lbl_formato:'Format', opt_curso_video:'Video course', opt_ebook:'Ebook', opt_mentoria:'Mentorship', opt_planilha:'Spreadsheet or template', opt_comunidade_paga:'Paid community', lbl_preco_reais_2:'Price ($)', lbl_categoria:'Category', lbl_para_quem_e:'Who it’s for', lbl_horario_aulas:'Class schedule (if any)', lbl_contato_duvida:'Contact for questions (WhatsApp, Instagram, etc)', lbl_link_grupo:'Group link (optional)', lbl_meta_vendas:'Monthly sales goal', btn_salvar_produto:'Save product', sub_etapas:'check off as you finish', tit_registrar_venda:'Record sale', lbl_quantidade_vendida:'Quantity sold', lbl_valor_unidade:'Amount received per unit ($)', btn_confirmar_venda:'Confirm sale', aba_entrar:'Sign in', aba_criar_conta:'Create account', lbl_email:'Email', placeholder_email:'you@email.com', lbl_senha:'Password', placeholder_senha:'minimum 6 characters', btn_entrar:'Sign in', btn_criar_conta_2:'Create account', txt_ou:'or', txt_continuar_google:'Continue with Google', aviso_login_indisponivel:'Couldn’t load the login service right now (no internet, or the browser blocked it). Check your connection and try again.', logado_como:'signed in as', lbl_como_chamado:'What should we call you', placeholder_nome_exemplo:'Ana Ribeiro', lbl_uma_linha_sobre_voce:'One line about you', placeholder_bio_exemplo:'I’ve worked in woodworking for 12 years', btn_salvar:'Save', btn_sair_conta:'Sign out of this account', toast_salvo:'Saved.', confirm_sair_conta:'Sign out of this account?', toast_saiu:'You’re signed out.', card_faturamento:'Revenue', nota_faturamento:'everything that came in', card_vendas:'Sales', nota_vendas:'units sold', card_ticket:'Average ticket', nota_ticket:'per sale', card_saldo:'Balance', nota_saldo:'income minus expenses', card_produtos:'Products', nota_produtos:'in the community', card_saidas:'Expenses', nota_saidas:'recorded costs', vazio_grafico:'No income yet. Record your first sale below and the chart fills in.', vazio_produtos:'No products yet.<br>Create the first one and I’ll build the launch plan in steps.', txt_vendas_min:'sales', txt_meta_min:'goal', txt_mes_min:'month', txt_etapas_min:'steps', etq_na_comunidade:'in the community', etq_rascunho:'draft', btn_plano:'Plan', btn_mais_venda:'+ Sale', btn_publicado:'Published', btn_publicar:'Publish', btn_excluir:'Delete', vazio_lancamentos:'Nothing recorded yet.', tbl_descricao:'Description', tbl_valor:'Amount', vazio_metas:'No goals yet. Create one so I can calculate how much to save per month.', txt_de:'of', txt_ate:'by', txt_guarde:'Save', txt_pra_chegar_la:'to get there', txt_meta_batida:'Goal reached! 🎉', btn_mais_guardar:'+ Save', toast_preencha_meta:'Fill in the goal name and amount.', toast_meta_criada:'Goal created.', toast_informe_valor:'Enter an amount.', toast_guardado_total:'Saved! Total in the goal:', vazio_radar:'No recurring expense detected yet — I need the same expense to appear in at least 2 different months.', txt_total_recorrente:'Recurring total detected:', etp_comprado:'Bought', etp_anunciado:'Listed', etp_vendido:'Sold', vazio_estoque:'No items yet. Add what you bought to resell.', txt_pago:'Paid:', btn_avancar:'Advance', toast_de_nome_item:'Give the item a name.', toast_nome_produto:'Enter the product name.', aviso_preencha_tres:'Fill in all three fields.', vered_parcelar_bom:'Installments end up the same or cheaper than cash — usually worth it, as long as you can pay every installment on time.', vered_juro_baixo:'The built-in interest is low. If you don’t have the full amount now, installments are reasonable.', vered_juro_alto:'The built-in interest is high. If you have the cash amount, it almost always pays off more to pay cash (or negotiate a discount) than to split it.', txt_total_parcelado:'Total installments', txt_diferenca_avista:'Difference vs. cash', txt_juro_embutido:'Built-in interest', toast_min_2_produtos:'Add at least 2 products to compare.', vazio_desafio:'No active challenge. Tap "View challenge" to start one.', txt_dias:'days', txt_guardado_ate_agora:'Saved so far', txt_progresso:'Progress', txt_guardado:'Saved', btn_reiniciar_desafio:'Restart challenge', confirm_reiniciar_desafio:'Restart the challenge from scratch?', vazio_alertas:'No products on the list yet.', txt_quer_pagar_ate:'Wants to pay up to', txt_ultima_checagem:'Last check:', btn_verificar_agora:'Check now', txt_verificando:'Checking...', toast_preencha_alerta:'Fill in the name and the price you want to pay.', txt_renovar_assinatura:'Renew subscription', vazio_lembretes:'No reminders yet.', txt_em:'in', txt_atrasado_ha:'overdue by', txt_e_hoje:'is today', txt_chegando:'coming up', toast_preencha_lembrete:'Fill in the name and the date.', toast_nome_antes_publicar:'Set your name before publishing.', toast_descricao_antes_publicar:'Write "who it’s for" before publishing. Tap the product to edit.', toast_primeiro_curso:'🌱 First course published!', toast_publicado_comunidade:'Published to the community.', toast_publicado_so_aparelho:'Published on this device only.', toast_crie_produto_primeiro:'Create the product first, then publish it.', toast_escolha_produto:'Choose the product and tap "Publish".', aviso_com_publico:'Everything you publish here is visible to other people using the app.', aviso_com_local:'This device is storing courses only locally, so you only see your own. Open via the published link to see everyone’s.', txt_todos:'All', vazio_cursos_categoria:'No course in this category yet.<br>Be the first to publish — go to "My business", create the product, and tap Publish.', txt_primeiro_curso:'first course', txt_por:'By', txt_gratuito:'Free', txt_alunos:'students', btn_seu_curso:'Your course', btn_abrir_curso:'Open course', btn_ver_curso:'View course', vazio_perguntas:'No questions yet. Be the first to ask.', titulo_perguntas:'QUESTIONS', placeholder_pergunta_curso:'Write your question about the course', btn_enviar_pergunta:'Send question', aviso_nome_para_perguntar:'Set your name in your profile so you can ask.', titulo_avaliacoes:'REVIEWS', vazio_avaliacoes:'No reviews yet.', placeholder_comentario:'Comment (optional)', aviso_toque_nota:'Tap a rating above.', txt_sem_descricao:'No description.', txt_alunos_cap:'Students', txt_horario:'Schedule', txt_falar_whatsapp:'Talk to the creator (WhatsApp)', txt_contato:'Contact', txt_entrar_grupo:'Join the course group', aviso_curso_e_seu:'This course is yours. Record sales in "My business".', aviso_ja_matriculado:'You’re already enrolled. The course appears in "My courses".', btn_quero_curso:'I want this course', btn_entrar_curso:'Join the course', aviso_pagamento_combinado:'Payment is arranged directly with the course creator. Verify who the person is before transferring any amount.', toast_esta_em_meus_cursos:'Done — it’s in "My courses".', txt_nota_escolhida:'Rating chosen:', txt_toque_enviar:'tap "Send" below.', btn_enviar_avaliacao:'Send review', toast_avaliacao_enviada:'Review sent. Thank you!', toast_pergunta_enviada:'Question sent.', vazio_matriculas:'You haven’t taken any course yet.<br>Check out the Community.', btn_sair:'Leave', vazio_lista_conversas:'No conversations yet.', confirm_excluir_conversa:'Delete this conversation?', confirm_apagar_conversa:'Clear the whole conversation?', et_tema_texto:'Define the topic and who it’s for', et_tema_dica:'One sentence: "I teach X to people who want Y".', et_roteiro_texto:'Build the lesson outline', et_roteiro_dica:'List the modules before recording anything.', et_gravar_texto:'Record the content', et_gravar_dica:'Phone on a tripod and good lighting already solve the start.', et_preco_texto:'Set the price', et_preco_dica:'Use the profit simulator to check if the price adds up.', et_pagina_texto:'Write the sales page', et_pagina_dica:'Promise, who it’s for, what’s included, price and guarantee.', et_publicar_com_texto:'Publish to the Community', et_publicar_com_dica:'Shows up for everyone in here, no fee.', et_publicar_fora_texto:'Publish on an outside platform', et_publicar_fora_dica:'Kiwify, Hotmart, or Eduzz handle payment and hosting.', et_divulgar_texto:'Promote it in the first 7 days', et_divulgar_dica:'Tell your list, post on social media, ask for referrals.', tit_editar_produto:'Edit product', toast_de_nome_produto:'Give the product a name to save it.', toast_produto_salvo:'Product saved.', confirm_excluir_produto:'Delete', toast_informe_valor_recebido:'Enter the amount received.', txt_venda_de:'Sale', toast_venda_registrada:'Sale recorded.', toast_valor_maior_zero:'Enter an amount greater than zero.', aviso_preencha_lucro:'Fill in at least the monthly profit for me to simulate.', txt_mes_min_cap:'Month', txt_se_paga_em:'Pays off in', txt_menos_1_mes:'less than 1 month', txt_meses:'months', txt_sem_investimento:'no investment', txt_por_hora_dedicada:'Per hour dedicated', txt_lucro_12_meses:'Profit over 12 months', txt_saldo_fim_ano:'Balance at year end', txt_saldo_mes_a_mes:'Balance month by month', txt_venda_direta_sem_taxa:'direct sale (no fee)', aviso_preencha_pagou:'Fill in how much you paid for the product.', txt_preco_sugerido:'Suggested sale price', txt_taxa_da:'Fee from', txt_fixo:'fixed', txt_lucro_liquido_real:'Your real net profit', aviso_taxas_referencia:'2026 reference fees — the platform may charge slightly differently depending on the exact product category. Confirm in the seller panel before publishing the listing.', rel_titulo:'BUSINESS REPORT', rel_gerado_em:'Generated on', rel_resumo_geral:'GENERAL SUMMARY', rel_faturamento_total:'Total revenue:', rel_saidas_totais:'Total expenses:', rel_saldo:'Balance:', rel_vendas_totais:'Total sales:', rel_ticket_medio:'Average ticket:', rel_ultimos_6_meses:'LAST 6 MONTHS', rel_entrou:'in', rel_saiu:'out', rel_nenhum_produto:'No products registered.', rel_ultimas_movimentacoes:'RECENT TRANSACTIONS', rel_nenhuma_movimentacao:'No transactions recorded.', sug_investimento_sobra:'Investment suggestion for spare cash', sug_economizar_mais:'How can I save more this month?', sug_negocio_saudavel:'Is my business healthy?', sug_aumentar_ticket:'How do I increase my average ticket?', sug_baixar_preco:'Is it worth lowering my price?', sug_priorizar_produto:'Which product should I prioritize now?', erro_bloqueado_file:'The browser blocked this request — this usually happens when the app is opened directly from the downloaded file (file://) instead of a published link (https://). Host this site somewhere like Netlify and open it from there.', erro_sem_servidor:'Couldn’t reach the server. Check your connection and try again.', erro_404_funcao:'Couldn’t find the server function (/.netlify/functions/chat). If you’re testing outside the published Netlify site, this is expected — it only works on the actually published site.', erro_429_muitas_msgs:'Too many messages in a short time. Wait a few seconds and send again.', erro_recusado:'The server refused the request', erro_erro:'Error', erro_tente_novo_instantes:'Try again in a moment.', erro_resposta_vazia:'The response came back empty. Rephrase your question and try again.', diag_sem_dados:'Not enough data yet. Create a product and record the first sale or expense so I can assess your financial health.', diag_saldo_negativo:'Your balance is negative: expenses have already exceeded income by', diag_entradas_cairam:'Your income dropped significantly compared to last month', diag_saidas_altas:'Your expenses this month already eat up more than 70% of what came in.', diag_produto_abaixo_meta:'has', diag_bem_abaixo_da_meta:'well below the goal of', diag_nenhum_alerta:'No alerts right now. Positive balance and nothing unexpected in your products.', diag_sem_dados_ainda:'No data yet', diag_saude_boa:'Financial health: good', diag_saude_atencao:'Financial health: caution', diag_saude_risco:'Financial health: risk', diag_comparado_mes_passado:'Compared to last month', erro_arquivo_direto:'This file is open directly (file://).', erro_arquivo_direto_detalhe:'Firebase login doesn’t work this way — it needs to be https:// or localhost. Publish the file (e.g. Netlify Drop) and open it via the link.', erro_dentro_iframe:'The app is inside another app (iframe).', erro_dentro_iframe_detalhe:'Google sign-in is usually blocked in here. If Google fails, try opening the published link directly in your phone’s browser.', erro_login_indisponivel:'Login service unavailable right now.', erro_email_senha_obrigatorios:'Email and password (min. 6 characters) are required.', erro_email_ja_tem_conta:'This email already has an account — tap "Sign in".', erro_email_invalido:'Invalid email.', erro_senha_fraca:'Weak password — use at least 6 characters.', erro_senha_incorreta:'Incorrect password.', erro_conta_nao_encontrada:'No account found with this email — tap "Create account".', erro_credenciais_incorretas:'Incorrect email or password.', erro_muitas_tentativas:'Too many attempts. Wait a bit and try again.', erro_sem_conexao_firebase:'No connection to the Firebase server right now.', erro_dominio_nao_autorizado:'This domain isn’t authorized in Firebase (Authentication → Settings → Authorized domains).', erro_email_senha_desativado:'Email/Password sign-in isn’t enabled in Firebase yet (Authentication → Sign-in method).', erro_nao_consegui_completar:'Couldn’t complete this.', erro_popup_bloqueado:'The browser blocked the Google window. Allow pop-ups for this site and try again.', erro_popup_cancelado:'The Google window was cancelled. Try again.', erro_popup_fechado:'You closed the Google window before finishing.', erro_dominio_nao_autorizado_google:'This domain isn’t authorized in Firebase (Authentication → Settings → Authorized domains) — add the domain you’re opening the app from.', erro_google_desativado:'Google sign-in isn’t enabled in Firebase yet (Authentication → Sign-in method).', erro_nao_consegui_google:'Couldn’t sign in with Google.', mic_nao_ouvi:'I didn’t hear anything. Speak closer to the microphone.', mic_sem_disponivel:'No microphone available on this device.', mic_conexao_insuficiente:'Not enough connection to recognize speech right now.', mic_nao_funcionou:'The microphone didn’t work. Try again or type instead.', mic_sub_iframe:'the app is open inside another app, and the microphone is blocked there', mic_passo_iframe_1:'Tap the <strong>open in new tab</strong> button or copy this page’s address.', mic_passo_iframe_2:'Paste the address into your <strong>phone’s browser</strong> (Safari, Chrome).', mic_passo_iframe_3:'When the browser asks, choose <strong>Allow</strong> for the microphone.', mic_passo_iframe_4:'Meanwhile, you can use your <strong>keyboard’s own microphone</strong> to dictate here.', mic_sub_inseguro:'the microphone only works on an https address', mic_passo_inseguro_1:'Open the app’s <strong>published link</strong>, not the file saved on the device.', mic_passo_inseguro_2:'Check that the address starts with <strong>https://</strong>.', mic_passo_inseguro_3:'Reload the page and tap the microphone again.', mic_sub_bloqueado:'the browser blocked access — follow the steps below', mic_passo_ios_1:'Open the iPhone’s <strong>Settings</strong>.', mic_passo_ios_2:'Scroll down to <strong>Safari</strong> (or the browser you use) and tap it.', mic_passo_ios_3:'Tap <strong>Microphone</strong> and choose <strong>Allow</strong>.', mic_passo_ios_4:'Come back here, reload, and tap the microphone again.', mic_passo_outro_1:'Tap the padlock or the "ⓘ" icon next to the address bar up top.', mic_passo_outro_2:'Look for <strong>Microphone</strong> in the site’s permissions.', mic_passo_outro_3:'Change it from "Block" to <strong>Allow</strong>.', mic_passo_outro_4:'Reload the page and tap the microphone again.'},
    'es-ES': { nav_conversa:'Conversación', nav_negocio:'Mi negocio', nav_comunidade:'Comunidad', nav_cursos:'Mis cursos', nav_conta:'Mi cuenta', secao_conversas:'Conversaciones', btn_nova_conversa:'Nueva conversación', input_placeholder:'Cuéntame qué necesitas…' , desc_negocio:'Tus productos, tus ventas y el saldo — todo guardado en este dispositivo.', btn_criar_produto:'Crear producto', h3_tutor:'Tutor del negocio', lbl_pergunta_tutor:'Pregúntale al tutor', placeholder_pergunta_tutor:'¿Mi ganancia es buena para este rubro? ¿Cómo reduzco mis gastos?', btn_perguntar:'Preguntar', h3_vendas:'Ventas de los últimos 6 meses', h3_meus_produtos:'Mis productos', btn_novo_produto:'Nuevo producto', h3_simulador:'Simulador de ganancias', btn_abrir_simulador:'Abrir simulador', aviso_simulador:'Proyecta cuánto rinde un producto antes de empezar: cuánto inviertes, cuánto ganas al mes, en cuánto tiempo se paga.', h3_precificador:'Calculador de precios automático', btn_abrir_precificador:'Abrir calculador', aviso_precificador:'Dile cuánto pagaste y la ganancia que quieres, y calcula el precio de venta considerando la comisión de la plataforma.', h3_metas:'Metas de ahorro', btn_nova_meta:'Nueva meta', h3_radar:'Radar de gastos fijos', h3_estoque:'Inventario para reventa', btn_novo_item:'Nuevo artículo', h3_gerador_anuncio:'Generador de anuncios', btn_criar_anuncio:'Crear anuncio', aviso_anuncio:'Describe el producto y escribe el texto del anuncio listo para pegar en Mercado Libre, Shopee u OLX.', h3_parcelar:'¿Vale la pena pagar a plazos?', btn_comparar:'Comparar', aviso_parcelar:'Compara el precio de contado con el de plazos y muestra cuánto interés estás pagando de verdad.', h3_comparador:'Comparador de productos', aviso_comparador:'Agrega hasta 4 productos y él investiga y arma una tabla con precio, pros y contras de cada uno.', h3_desafio:'Reto de ahorro', btn_ver_desafio:'Ver reto', h3_relatorio:'Informe del negocio', btn_gerar_relatorio:'Generar informe', aviso_relatorio:'Resumen en texto listo para descargar y enviar al contador o guardar como registro.', h3_produtos_olho:'Productos vigilados (precio)', btn_add_produto_olho:'Agregar producto', aviso_produtos_olho:'Esto no revisa el precio solo todo el tiempo — cuando toques "Verificar ahora", investigo el precio actual real y lo comparo con lo que quieres pagar.', h3_lembretes:'Recordatorios', btn_novo_lembrete:'Nuevo recordatorio', aviso_lembretes:'Reponer inventario, renovar la suscripción de una herramienta, cualquier cosa con fecha para no olvidar.', h3_movimentacoes:'Movimientos reales', lbl_tipo:'Tipo', opt_entrada:'Ingreso', opt_saida:'Gasto', lbl_valor_reais:'Valor (R$)', lbl_do_que_se_trata:'De qué se trata', btn_registrar_movimentacao:'Registrar movimiento', btn_publicar_curso:'Publicar curso', desc_comunidade:'Cursos creados por personas reales aquí dentro. Enseña lo que sabes, aprende lo que aún no sabes.', desc_cursos:'Lo que obtuviste en la comunidad queda aquí.', tit_anexar:'Adjuntar', sub_anexar:'envía una foto del producto o un PDF', opc_tirar_foto:'Tomar foto', opc_galeria_pdf:'Galería o PDF', tit_idioma:'Elige tu idioma', sub_idioma:'esto ajusta el reconocimiento de voz del micrófono', tit_aparencia:'Apariencia', sub_aparencia:'elige cómo se ve la app para ti', tit_mic:'Habilitar el micrófono', btn_tentar_mic:'Ya lo habilité, intentar de nuevo', sub_simulador:'proyección de 12 meses con tus propios números', lbl_investimento_inicial:'Inversión inicial (R$)', lbl_lucro_mes:'Ganancia neta al mes (R$)', lbl_horas_semana:'Horas por semana', btn_calcular:'Calcular', sub_precificador:'comisiones reales de 2026 ya incluidas en el cálculo', lbl_quanto_pagou_produto:'Cuánto pagaste por el producto (R$)', lbl_lucro_percentual:'Ganancia que quieres, sobre lo pagado (%)', lbl_onde_vai_vender:'Dónde vas a vender', opt_ml_classico:'Mercado Libre — Clásico', opt_ml_premium:'Mercado Libre — Premium', opt_shopee:'Shopee', opt_direto:'Directo (OLX, Enjoei, Instagram, WhatsApp) — sin comisión', btn_calcular_preco:'Calcular precio de venta', tit_nova_meta:'Nueva meta de ahorro', sub_nova_meta:'calcula cuánto ahorrar al mes para llegar', lbl_nome_meta:'Nombre de la meta', lbl_valor_juntar:'Monto que quieres juntar (R$)', lbl_ate_quando:'Hasta cuándo', btn_criar_meta:'Crear meta', tit_guardar_meta:'Guardar monto en la meta', lbl_quanto_guardou:'Cuánto ahorraste ahora (R$)', btn_guardar:'Guardar', lbl_nome_item:'Nombre del artículo', lbl_quanto_pagou:'Cuánto pagaste (R$)', btn_add_estoque:'Añadir al inventario', sub_anuncio:'texto listo para pegar en el anuncio', lbl_nome_produto:'Nombre del producto', lbl_estado_produto:'Estado', opt_novo_caixa:'Nuevo, en caja', opt_seminovo:'Casi nuevo', opt_usado_bom:'Usado, buen estado', opt_usado_marcas:'Usado, con marcas de uso', lbl_preco_reais:'Precio (R$)', lbl_detalhes_extras:'Detalles extra (opcional)', btn_gerar_anuncio:'Generar anuncio', sub_parcelar:'compara el contado con las cuotas', lbl_preco_avista:'Precio de contado (R$)', lbl_numero_parcelas:'Número de cuotas', lbl_valor_parcela:'Valor de cada cuota (R$)', sub_comparador:'de 2 a 4 productos — investiga y arma la tabla', lbl_produto_1:'Producto 1', lbl_produto_2:'Producto 2', lbl_produto_3:'Producto 3 (opcional)', lbl_produto_4:'Producto 4 (opcional)', btn_comparar_agora:'Comparar ahora', sub_desafio:'toca cada día conforme vayas ahorrando el monto', lbl_escolha_desafio:'Elige el reto', opt_desafio_1:'R$1 a R$100 creciente (100 días, junta R$5.050)', opt_desafio_2:'R$2 a R$200 creciente (100 días, junta R$10.100)', opt_desafio_5:'R$5 fijo por semana (52 semanas, junta R$260)', btn_comecar_desafio:'Empezar este reto', sub_relatorio:'listo para descargar', btn_baixar_relatorio:'Descargar como archivo de texto', tit_produto_olho:'Producto vigilado', sub_produto_olho:'tú mismo tocas "verificar" cuando quieras saber el precio de ahora', lbl_nome_produto_alerta:'Nombre del producto', lbl_link_opcional:'Enlace (opcional)', lbl_quanto_quer_pagar:'Cuánto quieres pagar (R$)', btn_adicionar:'Añadir', h3_lembretes_novo:'Nuevo recordatorio', lbl_do_que_se_trata_2:'De qué se trata', lbl_tipo_lembrete:'Tipo', opt_repor_estoque:'Reponer inventario', opt_renovar_assinatura:'Renovar suscripción/herramienta', opt_outro:'Otro', lbl_data:'Fecha', btn_criar_lembrete:'Crear recordatorio', sub_produto:'un producto = un curso, ebook o mentoría que vas a vender', lbl_nome_produto_2:'Nombre del producto', lbl_formato:'Formato', opt_curso_video:'Curso en video', opt_ebook:'Ebook', opt_mentoria:'Mentoría', opt_planilha:'Hoja de cálculo o plantilla', opt_comunidade_paga:'Comunidad de pago', lbl_preco_reais_2:'Precio (R$)', lbl_categoria:'Categoría', lbl_para_quem_e:'Para quién es', lbl_horario_aulas:'Horario de las clases (si aplica)', lbl_contato_duvida:'Contacto para dudas (WhatsApp, Instagram, etc)', lbl_link_grupo:'Enlace del grupo (opcional)', lbl_meta_vendas:'Meta de ventas por mes', btn_salvar_produto:'Guardar producto', sub_etapas:'marca conforme vayas terminando', tit_registrar_venda:'Registrar venta', lbl_quantidade_vendida:'Cantidad vendida', lbl_valor_unidade:'Valor recibido por unidad (R$)', btn_confirmar_venda:'Confirmar venta', aba_entrar:'Iniciar sesión', aba_criar_conta:'Crear cuenta', lbl_email:'Correo', placeholder_email:'tu@email.com', lbl_senha:'Contraseña', placeholder_senha:'mínimo 6 caracteres', btn_entrar:'Iniciar sesión', btn_criar_conta_2:'Crear cuenta', txt_ou:'o', txt_continuar_google:'Continuar con Google', aviso_login_indisponivel:'No pude cargar el servicio de inicio de sesión ahora (sin internet, o el navegador lo bloqueó). Verifica tu conexión e inténtalo de nuevo.', logado_como:'sesión iniciada como', lbl_como_chamado:'Cómo quieres que te llamemos', placeholder_nome_exemplo:'Ana Ribeiro', lbl_uma_linha_sobre_voce:'Una línea sobre ti', placeholder_bio_exemplo:'Trabajo en carpintería desde hace 12 años', btn_salvar:'Guardar', btn_sair_conta:'Cerrar sesión', toast_salvo:'Guardado.', confirm_sair_conta:'¿Cerrar sesión de esta cuenta?', toast_saiu:'Sesión cerrada.', card_faturamento:'Facturación', nota_faturamento:'todo lo que entró', card_vendas:'Ventas', nota_vendas:'unidades vendidas', card_ticket:'Ticket promedio', nota_ticket:'por venta', card_saldo:'Saldo', nota_saldo:'ingresos menos gastos', card_produtos:'Productos', nota_produtos:'en la comunidad', card_saidas:'Gastos', nota_saidas:'costos registrados', vazio_grafico:'Aún sin ingresos. Registra la primera venta abajo y el gráfico se completa.', vazio_produtos:'Aún no hay productos.<br>Crea el primero y armo el plan de lanzamiento en pasos.', txt_vendas_min:'ventas', txt_meta_min:'meta', txt_mes_min:'mes', txt_etapas_min:'pasos', etq_na_comunidade:'en la comunidad', etq_rascunho:'borrador', btn_plano:'Plan', btn_mais_venda:'+ Venta', btn_publicado:'Publicado', btn_publicar:'Publicar', btn_excluir:'Eliminar', vazio_lancamentos:'Nada registrado aún.', tbl_descricao:'Descripción', tbl_valor:'Valor', vazio_metas:'Aún no hay metas. Crea una para que calcule cuánto ahorrar al mes.', txt_de:'de', txt_ate:'hasta', txt_guarde:'Ahorra', txt_pra_chegar_la:'para llegar', txt_meta_batida:'¡Meta cumplida! 🎉', btn_mais_guardar:'+ Guardar', toast_preencha_meta:'Completa el nombre y el monto de la meta.', toast_meta_criada:'Meta creada.', toast_informe_valor:'Indica un monto.', toast_guardado_total:'¡Guardado! Total en la meta:', vazio_radar:'Aún no detecté gasto recurrente — necesito que el mismo gasto aparezca en al menos 2 meses distintos.', txt_total_recorrente:'Total recurrente detectado:', etp_comprado:'Comprado', etp_anunciado:'Publicado', etp_vendido:'Vendido', vazio_estoque:'Aún no hay artículos. Añade lo que compraste para revender.', txt_pago:'Pagado:', btn_avancar:'Avanzar', toast_de_nome_item:'Dale un nombre al artículo.', toast_nome_produto:'Escribe el nombre del producto.', aviso_preencha_tres:'Completa los tres campos.', vered_parcelar_bom:'Pagar a plazos sale igual o más barato que de contado — generalmente vale la pena, siempre que puedas pagar todas las cuotas a tiempo.', vered_juro_baixo:'El interés incluido es bajo. Si no tienes todo el dinero ahora, pagar a plazos es razonable.', vered_juro_alto:'El interés incluido es alto. Si tienes el monto de contado, casi siempre conviene más pagar de contado (o negociar descuento) que a plazos.', txt_total_parcelado:'Total a plazos', txt_diferenca_avista:'Diferencia con el contado', txt_juro_embutido:'Interés incluido', toast_min_2_produtos:'Agrega al menos 2 productos para comparar.', vazio_desafio:'No hay reto activo. Toca "Ver reto" para empezar uno.', txt_dias:'días', txt_guardado_ate_agora:'Ahorrado hasta ahora', txt_progresso:'Progreso', txt_guardado:'Ahorrado', btn_reiniciar_desafio:'Reiniciar reto', confirm_reiniciar_desafio:'¿Reiniciar el reto desde cero?', vazio_alertas:'Aún no hay productos en la lista.', txt_quer_pagar_ate:'Quiere pagar hasta', txt_ultima_checagem:'Última verificación:', btn_verificar_agora:'Verificar ahora', txt_verificando:'Verificando...', toast_preencha_alerta:'Completa el nombre y el precio que quieres pagar.', txt_renovar_assinatura:'Renovar suscripción', vazio_lembretes:'Aún no hay recordatorios.', txt_em:'en', txt_atrasado_ha:'atrasado hace', txt_e_hoje:'es hoy', txt_chegando:'próximo', toast_preencha_lembrete:'Completa el nombre y la fecha.', toast_nome_antes_publicar:'Pon tu nombre antes de publicar.', toast_descricao_antes_publicar:'Escribe "para quién es" antes de publicar. Toca el producto para editar.', toast_primeiro_curso:'🌱 ¡Primer curso publicado!', toast_publicado_comunidade:'Publicado en la comunidad.', toast_publicado_so_aparelho:'Publicado solo en este dispositivo.', toast_crie_produto_primeiro:'Crea el producto primero y luego publícalo.', toast_escolha_produto:'Elige el producto y toca "Publicar".', aviso_com_publico:'Todo lo que publiques aquí queda visible para las demás personas que usan la app.', aviso_com_local:'Este dispositivo está guardando los cursos solo localmente, así que solo ves los tuyos. Abre el enlace publicado para ver los de todos.', txt_todos:'Todos', vazio_cursos_categoria:'Aún no hay curso en esta categoría.<br>Sé la primera persona en publicar — ve a "Mi negocio", crea el producto y toca Publicar.', txt_primeiro_curso:'primer curso', txt_por:'Por', txt_gratuito:'Gratis', txt_alunos:'alumnos', btn_seu_curso:'Tu curso', btn_abrir_curso:'Abrir curso', btn_ver_curso:'Ver curso', vazio_perguntas:'Aún no hay preguntas. Sé la primera persona en preguntar.', titulo_perguntas:'PREGUNTAS', placeholder_pergunta_curso:'Escribe tu duda sobre el curso', btn_enviar_pergunta:'Enviar pregunta', aviso_nome_para_perguntar:'Pon tu nombre en el perfil para poder preguntar.', titulo_avaliacoes:'RESEÑAS', vazio_avaliacoes:'Aún sin reseñas.', placeholder_comentario:'Comentario (opcional)', aviso_toque_nota:'Toca una calificación arriba.', txt_sem_descricao:'Sin descripción.', txt_alunos_cap:'Alumnos', txt_horario:'Horario', txt_falar_whatsapp:'Hablar con quien lo creó (WhatsApp)', txt_contato:'Contacto', txt_entrar_grupo:'Unirse al grupo del curso', aviso_curso_e_seu:'Este curso es tuyo. Las ventas se registran en "Mi negocio".', aviso_ja_matriculado:'Ya estás inscrito. El curso aparece en "Mis cursos".', btn_quero_curso:'Quiero este curso', btn_entrar_curso:'Unirme al curso', aviso_pagamento_combinado:'El pago se acuerda directamente con quien creó el curso. Verifica quién es la persona antes de transferir cualquier monto.', toast_esta_em_meus_cursos:'Listo — está en "Mis cursos".', txt_nota_escolhida:'Calificación elegida:', txt_toque_enviar:'toca "Enviar" abajo.', btn_enviar_avaliacao:'Enviar reseña', toast_avaliacao_enviada:'¡Reseña enviada. Gracias!', toast_pergunta_enviada:'Pregunta enviada.', vazio_matriculas:'Aún no tomaste ningún curso.<br>Echa un vistazo a la Comunidad.', btn_sair:'Salir', vazio_lista_conversas:'Aún no hay conversaciones.', confirm_excluir_conversa:'¿Eliminar esta conversación?', confirm_apagar_conversa:'¿Borrar toda la conversación?', et_tema_texto:'Definir el tema y para quién es', et_tema_dica:'Una frase: "enseño X a personas que quieren Y".', et_roteiro_texto:'Armar el guion de las clases', et_roteiro_dica:'Enumera los módulos antes de grabar cualquier cosa.', et_gravar_texto:'Grabar el contenido', et_gravar_dica:'Celular en trípode y buena luz ya resuelven el comienzo.', et_preco_texto:'Definir el precio', et_preco_dica:'Usa el simulador de ganancias para ver si el precio cuadra.', et_pagina_texto:'Escribir la página de ventas', et_pagina_dica:'Promesa, para quién es, qué incluye, precio y garantía.', et_publicar_com_texto:'Publicar en la Comunidad', et_publicar_com_dica:'Aparece para todos aquí dentro, sin comisión.', et_publicar_fora_texto:'Publicar en una plataforma externa', et_publicar_fora_dica:'Kiwify, Hotmart o Eduzz se encargan del pago y alojamiento.', et_divulgar_texto:'Difundirlo en los primeros 7 días', et_divulgar_dica:'Avisa a tu lista, publica en redes, pide recomendaciones.', tit_editar_produto:'Editar producto', toast_de_nome_produto:'Dale un nombre al producto para guardarlo.', toast_produto_salvo:'Producto guardado.', confirm_excluir_produto:'Eliminar', toast_informe_valor_recebido:'Indica el monto recibido.', txt_venda_de:'Venta', toast_venda_registrada:'Venta registrada.', toast_valor_maior_zero:'Indica un monto mayor que cero.', aviso_preencha_lucro:'Completa al menos la ganancia mensual para que pueda simular.', txt_mes_min_cap:'Mes', txt_se_paga_em:'Se paga en', txt_menos_1_mes:'menos de 1 mes', txt_meses:'meses', txt_sem_investimento:'sin inversión', txt_por_hora_dedicada:'Por hora dedicada', txt_lucro_12_meses:'Ganancia en 12 meses', txt_saldo_fim_ano:'Saldo a fin de año', txt_saldo_mes_a_mes:'Saldo mes a mes', txt_venda_direta_sem_taxa:'venta directa (sin comisión)', aviso_preencha_pagou:'Completa cuánto pagaste por el producto.', txt_preco_sugerido:'Precio de venta sugerido', txt_taxa_da:'Comisión de', txt_fixo:'fijo', txt_lucro_liquido_real:'Tu ganancia neta real', aviso_taxas_referencia:'Comisiones de referencia de 2026 — la plataforma puede cobrar un poco diferente según la categoría exacta del producto. Confirma en el panel de vendedor antes de publicar el anuncio.', rel_titulo:'INFORME DEL NEGOCIO', rel_gerado_em:'Generado el', rel_resumo_geral:'RESUMEN GENERAL', rel_faturamento_total:'Facturación total:', rel_saidas_totais:'Gastos totales:', rel_saldo:'Saldo:', rel_vendas_totais:'Ventas totales:', rel_ticket_medio:'Ticket promedio:', rel_ultimos_6_meses:'ÚLTIMOS 6 MESES', rel_entrou:'entró', rel_saiu:'salió', rel_nenhum_produto:'Ningún producto registrado.', rel_ultimas_movimentacoes:'ÚLTIMOS MOVIMIENTOS', rel_nenhuma_movimentacao:'Ningún movimiento registrado.', sug_investimento_sobra:'Sugerencia de inversión para el sobrante de caja', sug_economizar_mais:'¿Cómo puedo ahorrar más este mes?', sug_negocio_saudavel:'¿Mi negocio está saludable?', sug_aumentar_ticket:'¿Cómo aumento mi ticket promedio?', sug_baixar_preco:'¿Vale la pena bajar mi precio?', sug_priorizar_produto:'¿Qué producto debo priorizar ahora?', erro_bloqueado_file:'El navegador bloqueó esta llamada — esto suele pasar cuando la app se abre directamente desde el archivo descargado (file://) en lugar de un enlace publicado (https://). Aloja este sitio en algo como Netlify y ábrelo desde allí.', erro_sem_servidor:'No pude comunicarme con el servidor. Verifica la conexión e inténtalo de nuevo.', erro_404_funcao:'No encontré la función del servidor (/.netlify/functions/chat). Si estás probando fuera del Netlify publicado, esto es esperado — solo funciona en el sitio realmente publicado.', erro_429_muitas_msgs:'Demasiados mensajes en poco tiempo. Espera unos segundos y envía de nuevo.', erro_recusado:'El servidor rechazó la llamada', erro_erro:'Error', erro_tente_novo_instantes:'Inténtalo de nuevo en un momento.', erro_resposta_vazia:'La respuesta llegó vacía. Reformula la pregunta e inténtalo de nuevo.', diag_sem_dados:'Aún no hay datos suficientes. Crea un producto y registra la primera venta o gasto para que pueda evaluar tu salud financiera.', diag_saldo_negativo:'Tu saldo está negativo: los gastos ya superaron los ingresos en', diag_entradas_cairam:'Tus ingresos bajaron bastante respecto al mes pasado', diag_saidas_altas:'Tus gastos de este mes ya consumen más del 70% de lo que entró.', diag_produto_abaixo_meta:'tiene', diag_bem_abaixo_da_meta:'muy por debajo de la meta de', diag_nenhum_alerta:'Sin alertas por ahora. Saldo positivo y nada fuera de lo esperado en tus productos.', diag_sem_dados_ainda:'Aún sin datos', diag_saude_boa:'Salud financiera: buena', diag_saude_atencao:'Salud financiera: atención', diag_saude_risco:'Salud financiera: riesgo', diag_comparado_mes_passado:'Comparado con el mes pasado', erro_arquivo_direto:'Este archivo está abierto directamente (file://).', erro_arquivo_direto_detalhe:'El login de Firebase no funciona así — necesita ser https:// o localhost. Publica el archivo (por ejemplo, Netlify Drop) y ábrelo desde el enlace.', erro_dentro_iframe:'La app está dentro de otra app (iframe).', erro_dentro_iframe_detalhe:'El inicio de sesión con Google suele bloquearse aquí dentro. Si Google falla, intenta abrir el enlace publicado directamente en el navegador del celular.', erro_login_indisponivel:'Servicio de inicio de sesión no disponible ahora.', erro_email_senha_obrigatorios:'Correo y contraseña (mín. 6 caracteres) son obligatorios.', erro_email_ja_tem_conta:'Ese correo ya tiene cuenta — toca "Iniciar sesión".', erro_email_invalido:'Correo inválido.', erro_senha_fraca:'Contraseña débil — usa al menos 6 caracteres.', erro_senha_incorreta:'Contraseña incorrecta.', erro_conta_nao_encontrada:'No encontré cuenta con ese correo — toca "Crear cuenta".', erro_credenciais_incorretas:'Correo o contraseña incorrectos.', erro_muitas_tentativas:'Demasiados intentos. Espera un poco e inténtalo de nuevo.', erro_sem_conexao_firebase:'Sin conexión con el servidor de Firebase ahora.', erro_dominio_nao_autorizado:'Este dominio no está autorizado en Firebase (Authentication → Settings → Authorized domains).', erro_email_senha_desativado:'El inicio de sesión por Correo/Contraseña aún no está activado en Firebase (Authentication → Sign-in method).', erro_nao_consegui_completar:'No pude completar esto.', erro_popup_bloqueado:'El navegador bloqueó la ventana de Google. Permite ventanas emergentes para este sitio e inténtalo de nuevo.', erro_popup_cancelado:'La ventana de Google fue cancelada. Inténtalo de nuevo.', erro_popup_fechado:'Cerraste la ventana de Google antes de terminar.', erro_dominio_nao_autorizado_google:'Este dominio no está autorizado en Firebase (Authentication → Settings → Authorized domains) — agrega el dominio desde donde abres la app.', erro_google_desativado:'El inicio de sesión con Google aún no está activado en Firebase (Authentication → Sign-in method).', erro_nao_consegui_google:'No pude iniciar sesión con Google.', mic_nao_ouvi:'No escuché nada. Habla más cerca del micrófono.', mic_sem_disponivel:'No hay micrófono disponible en este dispositivo.', mic_conexao_insuficiente:'Conexión insuficiente para reconocer la voz ahora.', mic_nao_funcionou:'El micrófono no funcionó. Inténtalo de nuevo o escribe.', mic_sub_iframe:'la app está abierta dentro de otra aplicación, y ahí el micrófono queda bloqueado', mic_passo_iframe_1:'Toca el botón de <strong>abrir en pestaña nueva</strong> o copia la dirección de esta página.', mic_passo_iframe_2:'Pega la dirección en el <strong>navegador del celular</strong> (Safari, Chrome).', mic_passo_iframe_3:'Cuando el navegador pregunte, elige <strong>Permitir</strong> para el micrófono.', mic_passo_iframe_4:'Mientras tanto, puedes usar el <strong>micrófono del propio teclado</strong> para dictar aquí.', mic_sub_inseguro:'el micrófono solo funciona en una dirección https', mic_passo_inseguro_1:'Abre el <strong>enlace publicado</strong> de la app, no el archivo guardado en el dispositivo.', mic_passo_inseguro_2:'Verifica que la dirección empiece con <strong>https://</strong>.', mic_passo_inseguro_3:'Recarga la página y toca el micrófono de nuevo.', mic_sub_bloqueado:'el navegador bloqueó el acceso — sigue los pasos', mic_passo_ios_1:'Abre los <strong>Ajustes</strong> del iPhone.', mic_passo_ios_2:'Baja hasta <strong>Safari</strong> (o el navegador que uses) y tócalo.', mic_passo_ios_3:'Toca en <strong>Micrófono</strong> y elige <strong>Permitir</strong>.', mic_passo_ios_4:'Vuelve aquí, recarga y toca el micrófono de nuevo.', mic_passo_outro_1:'Toca el candado o el "ⓘ" junto a la dirección, arriba.', mic_passo_outro_2:'Busca <strong>Micrófono</strong> en los permisos del sitio.', mic_passo_outro_3:'Cambia de "Bloquear" a <strong>Permitir</strong>.', mic_passo_outro_4:'Recarga la página y toca el micrófono de nuevo.'},
    'fr-FR': { nav_conversa:'Conversation', nav_negocio:'Mon activité', nav_comunidade:'Communauté', nav_cursos:'Mes cours', nav_conta:'Mon compte', secao_conversas:'Conversations', btn_nova_conversa:'Nouvelle conversation', input_placeholder:'Dites-moi ce dont vous avez besoin…' , desc_negocio:'Vos produits, vos ventes et le solde — tout est enregistré sur cet appareil.', btn_criar_produto:'Créer un produit', h3_tutor:'Tuteur d’activité', lbl_pergunta_tutor:'Posez une question au tuteur', placeholder_pergunta_tutor:'Mon profit est-il bon pour ce secteur ? Comment réduire mes dépenses ?', btn_perguntar:'Demander', h3_vendas:'Ventes des 6 derniers mois', h3_meus_produtos:'Mes produits', btn_novo_produto:'Nouveau produit', h3_simulador:'Simulateur de profit', btn_abrir_simulador:'Ouvrir le simulateur', aviso_simulador:'Projetez combien un produit rapporte avant de commencer : combien investir, combien vous gagnerez par mois, en combien de temps il se rentabilise.', h3_precificador:'Calculateur de prix automatique', btn_abrir_precificador:'Ouvrir le calculateur', aviso_precificador:'Indiquez combien vous avez payé et le profit souhaité, il calcule le prix de vente en tenant compte des frais de la plateforme.', h3_metas:'Objectifs d’épargne', btn_nova_meta:'Nouvel objectif', h3_radar:'Radar des dépenses fixes', h3_estoque:'Stock pour revente', btn_novo_item:'Nouvel article', h3_gerador_anuncio:'Générateur d’annonce', btn_criar_anuncio:'Créer une annonce', aviso_anuncio:'Décrivez le produit et il rédige le texte de l’annonce prêt à coller.', h3_parcelar:'Vaut-il la peine de payer en plusieurs fois ?', btn_comparar:'Comparer', aviso_parcelar:'Compare le prix comptant avec le prix à crédit et montre les intérêts réellement payés.', h3_comparador:'Comparateur de produits', aviso_comparador:'Ajoutez jusqu’à 4 produits, il fait des recherches et construit un tableau avec prix, avantages et inconvénients de chacun.', h3_desafio:'Défi d’épargne', btn_ver_desafio:'Voir le défi', h3_relatorio:'Rapport d’activité', btn_gerar_relatorio:'Générer le rapport', aviso_relatorio:'Résumé texte prêt à télécharger et à envoyer au comptable ou à conserver.', h3_produtos_olho:'Produits surveillés (prix)', btn_add_produto_olho:'Ajouter un produit', aviso_produtos_olho:'Cela ne vérifie pas le prix tout seul en permanence — quand vous appuyez sur « Vérifier maintenant », je recherche vraiment le prix actuel et le compare à ce que vous voulez payer.', h3_lembretes:'Rappels', btn_novo_lembrete:'Nouveau rappel', aviso_lembretes:'Réapprovisionner le stock, renouveler un abonnement, tout ce qui a une date à ne pas oublier.', h3_movimentacoes:'Mouvements réels', lbl_tipo:'Type', opt_entrada:'Entrée', opt_saida:'Sortie', lbl_valor_reais:'Montant (R$)', lbl_do_que_se_trata:'De quoi s’agit-il', btn_registrar_movimentacao:'Enregistrer le mouvement', btn_publicar_curso:'Publier un cours', desc_comunidade:'Des cours créés par de vraies personnes ici même. Enseignez ce que vous savez, apprenez ce que vous ne savez pas encore.', desc_cursos:'Ce que vous avez récupéré dans la communauté reste ici.', tit_anexar:'Joindre', sub_anexar:'envoyez une photo du produit ou un PDF', opc_tirar_foto:'Prendre une photo', opc_galeria_pdf:'Galerie ou PDF', tit_idioma:'Choisissez votre langue', sub_idioma:'cela ajuste la reconnaissance vocale du microphone', tit_aparencia:'Apparence', sub_aparencia:'choisissez l’apparence de l’application', tit_mic:'Activer le microphone', btn_tentar_mic:'Déjà activé, réessayer', sub_simulador:'projection sur 12 mois avec vos propres chiffres', lbl_investimento_inicial:'Investissement initial (R$)', lbl_lucro_mes:'Profit net par mois (R$)', lbl_horas_semana:'Heures par semaine', btn_calcular:'Calculer', sub_precificador:'frais réels de 2026 déjà intégrés au calcul', lbl_quanto_pagou_produto:'Combien vous avez payé le produit (R$)', lbl_lucro_percentual:'Profit souhaité, sur le montant payé (%)', lbl_onde_vai_vender:'Où vous allez vendre', opt_ml_classico:'Mercado Livre — Classique', opt_ml_premium:'Mercado Livre — Premium', opt_shopee:'Shopee', opt_direto:'Direct (OLX, Enjoei, Instagram, WhatsApp) — sans frais', btn_calcular_preco:'Calculer le prix de vente', tit_nova_meta:'Nouvel objectif d’épargne', sub_nova_meta:'il calcule combien épargner par mois pour y arriver', lbl_nome_meta:'Nom de l’objectif', lbl_valor_juntar:'Montant à économiser (R$)', lbl_ate_quando:'Jusqu’à quand', btn_criar_meta:'Créer l’objectif', tit_guardar_meta:'Ajouter un montant à l’objectif', lbl_quanto_guardou:'Combien vous venez d’épargner (R$)', btn_guardar:'Enregistrer', lbl_nome_item:'Nom de l’article', lbl_quanto_pagou:'Combien vous avez payé (R$)', btn_add_estoque:'Ajouter au stock', sub_anuncio:'texte prêt à coller dans l’annonce', lbl_nome_produto:'Nom du produit', lbl_estado_produto:'État', opt_novo_caixa:'Neuf, dans la boîte', opt_seminovo:'Comme neuf', opt_usado_bom:'Occasion, bon état', opt_usado_marcas:'Occasion, avec traces d’usure', lbl_preco_reais:'Prix (R$)', lbl_detalhes_extras:'Détails supplémentaires (facultatif)', btn_gerar_anuncio:'Générer l’annonce', sub_parcelar:'compare le comptant avec le paiement échelonné', lbl_preco_avista:'Prix comptant (R$)', lbl_numero_parcelas:'Nombre de versements', lbl_valor_parcela:'Montant de chaque versement (R$)', sub_comparador:'de 2 à 4 produits — il fait des recherches et construit le tableau', lbl_produto_1:'Produit 1', lbl_produto_2:'Produit 2', lbl_produto_3:'Produit 3 (facultatif)', lbl_produto_4:'Produit 4 (facultatif)', btn_comparar_agora:'Comparer maintenant', sub_desafio:'cochez chaque jour au fur et à mesure que vous épargnez le montant', lbl_escolha_desafio:'Choisissez le défi', opt_desafio_1:'1 à 100 R$ croissant (100 jours, cumule 5 050 R$)', opt_desafio_2:'2 à 200 R$ croissant (100 jours, cumule 10 100 R$)', opt_desafio_5:'5 R$ fixe par semaine (52 semaines, cumule 260 R$)', btn_comecar_desafio:'Commencer ce défi', sub_relatorio:'prêt à télécharger', btn_baixar_relatorio:'Télécharger en fichier texte', tit_produto_olho:'Produit surveillé', sub_produto_olho:'vous appuyez vous-même sur « vérifier » quand vous voulez le prix actuel', lbl_nome_produto_alerta:'Nom du produit', lbl_link_opcional:'Lien (facultatif)', lbl_quanto_quer_pagar:'Combien vous voulez payer (R$)', btn_adicionar:'Ajouter', h3_lembretes_novo:'Nouveau rappel', lbl_do_que_se_trata_2:'De quoi il s’agit', lbl_tipo_lembrete:'Type', opt_repor_estoque:'Réapprovisionner le stock', opt_renovar_assinatura:'Renouveler un abonnement/outil', opt_outro:'Autre', lbl_data:'Date', btn_criar_lembrete:'Créer le rappel', sub_produto:'un produit = un cours, ebook ou mentorat que vous allez vendre', lbl_nome_produto_2:'Nom du produit', lbl_formato:'Format', opt_curso_video:'Cours vidéo', opt_ebook:'Ebook', opt_mentoria:'Mentorat', opt_planilha:'Feuille de calcul ou modèle', opt_comunidade_paga:'Communauté payante', lbl_preco_reais_2:'Prix (R$)', lbl_categoria:'Catégorie', lbl_para_quem_e:'Pour qui c’est', lbl_horario_aulas:'Horaire des cours (le cas échéant)', lbl_contato_duvida:'Contact pour questions (WhatsApp, Instagram, etc.)', lbl_link_grupo:'Lien du groupe (facultatif)', lbl_meta_vendas:'Objectif de ventes mensuel', btn_salvar_produto:'Enregistrer le produit', sub_etapas:'cochez au fur et à mesure', tit_registrar_venda:'Enregistrer une vente', lbl_quantidade_vendida:'Quantité vendue', lbl_valor_unidade:'Montant reçu par unité (R$)', btn_confirmar_venda:'Confirmer la vente', aba_entrar:'Se connecter', aba_criar_conta:'Créer un compte', lbl_email:'E-mail', placeholder_email:'vous@email.com', lbl_senha:'Mot de passe', placeholder_senha:'6 caractères minimum', btn_entrar:'Se connecter', btn_criar_conta_2:'Créer un compte', txt_ou:'ou', txt_continuar_google:'Continuer avec Google', aviso_login_indisponivel:'Impossible de charger le service de connexion maintenant (pas d’internet, ou bloqué par le navigateur). Vérifiez votre connexion et réessayez.', logado_como:'connecté en tant que', lbl_como_chamado:'Comment souhaitez-vous être appelé', placeholder_nome_exemplo:'Ana Ribeiro', lbl_uma_linha_sobre_voce:'Une ligne à propos de vous', placeholder_bio_exemplo:'Je travaille dans la menuiserie depuis 12 ans', btn_salvar:'Enregistrer', btn_sair_conta:'Se déconnecter de ce compte', toast_salvo:'Enregistré.', confirm_sair_conta:'Se déconnecter de ce compte ?', toast_saiu:'Vous êtes déconnecté.', card_faturamento:'Chiffre d’affaires', nota_faturamento:'tout ce qui est entré', card_vendas:'Ventes', nota_vendas:'unités vendues', card_ticket:'Panier moyen', nota_ticket:'par vente', card_saldo:'Solde', nota_saldo:'entrées moins sorties', card_produtos:'Produits', nota_produtos:'dans la communauté', card_saidas:'Sorties', nota_saidas:'coûts enregistrés', vazio_grafico:'Pas encore de revenus. Enregistrez la première vente ci-dessous et le graphique se remplit.', vazio_produtos:'Aucun produit pour l’instant.<br>Créez le premier et je construis le plan de lancement en étapes.', txt_vendas_min:'ventes', txt_meta_min:'objectif', txt_mes_min:'mois', txt_etapas_min:'étapes', etq_na_comunidade:'dans la communauté', etq_rascunho:'brouillon', btn_plano:'Plan', btn_mais_venda:'+ Vente', btn_publicado:'Publié', btn_publicar:'Publier', btn_excluir:'Supprimer', vazio_lancamentos:'Rien d’enregistré pour l’instant.', tbl_descricao:'Description', tbl_valor:'Montant', vazio_metas:'Pas encore d’objectif. Créez-en un pour que je calcule combien épargner par mois.', txt_de:'de', txt_ate:'jusqu’au', txt_guarde:'Épargnez', txt_pra_chegar_la:'pour y arriver', txt_meta_batida:'Objectif atteint ! 🎉', btn_mais_guardar:'+ Épargner', toast_preencha_meta:'Remplissez le nom et le montant de l’objectif.', toast_meta_criada:'Objectif créé.', toast_informe_valor:'Indiquez un montant.', toast_guardado_total:'Enregistré ! Total sur l’objectif :', vazio_radar:'Pas encore de dépense récurrente détectée — il faut que la même dépense apparaisse sur au moins 2 mois différents.', txt_total_recorrente:'Total récurrent détecté :', etp_comprado:'Acheté', etp_anunciado:'Annoncé', etp_vendido:'Vendu', vazio_estoque:'Pas encore d’article. Ajoutez ce que vous avez acheté pour revendre.', txt_pago:'Payé :', btn_avancar:'Avancer', toast_de_nome_item:'Donnez un nom à l’article.', toast_nome_produto:'Indiquez le nom du produit.', aviso_preencha_tres:'Remplissez les trois champs.', vered_parcelar_bom:'Le paiement échelonné revient au même prix ou moins cher que comptant — généralement rentable, tant que vous pouvez payer chaque échéance à temps.', vered_juro_baixo:'L’intérêt inclus est faible. Si vous n’avez pas toute la somme maintenant, échelonner est raisonnable.', vered_juro_alto:'L’intérêt inclus est élevé. Si vous avez la somme comptant, il vaut presque toujours mieux payer comptant (ou négocier une remise) que d’échelonner.', txt_total_parcelado:'Total échelonné', txt_diferenca_avista:'Différence avec le comptant', txt_juro_embutido:'Intérêt inclus', toast_min_2_produtos:'Ajoutez au moins 2 produits à comparer.', vazio_desafio:'Aucun défi actif. Appuyez sur « Voir le défi » pour en commencer un.', txt_dias:'jours', txt_guardado_ate_agora:'Épargné jusqu’à présent', txt_progresso:'Progression', txt_guardado:'Épargné', btn_reiniciar_desafio:'Recommencer le défi', confirm_reiniciar_desafio:'Recommencer le défi depuis le début ?', vazio_alertas:'Aucun produit dans la liste pour l’instant.', txt_quer_pagar_ate:'Veut payer jusqu’à', txt_ultima_checagem:'Dernière vérification :', btn_verificar_agora:'Vérifier maintenant', txt_verificando:'Vérification...', toast_preencha_alerta:'Remplissez le nom et le prix que vous voulez payer.', txt_renovar_assinatura:'Renouveler l’abonnement', vazio_lembretes:'Pas encore de rappel.', txt_em:'dans', txt_atrasado_ha:'en retard de', txt_e_hoje:'c’est aujourd’hui', txt_chegando:'bientôt', toast_preencha_lembrete:'Remplissez le nom et la date.', toast_nome_antes_publicar:'Indiquez votre nom avant de publier.', toast_descricao_antes_publicar:'Écrivez « pour qui c’est » avant de publier. Touchez le produit pour modifier.', toast_primeiro_curso:'🌱 Premier cours publié !', toast_publicado_comunidade:'Publié dans la communauté.', toast_publicado_so_aparelho:'Publié uniquement sur cet appareil.', toast_crie_produto_primeiro:'Créez d’abord le produit, puis publiez-le.', toast_escolha_produto:'Choisissez le produit et appuyez sur « Publier ».', aviso_com_publico:'Tout ce que vous publiez ici est visible par les autres personnes utilisant l’application.', aviso_com_local:'Cet appareil stocke les cours uniquement en local, vous ne voyez donc que les vôtres. Ouvrez le lien publié pour voir ceux de tout le monde.', txt_todos:'Tous', vazio_cursos_categoria:'Aucun cours dans cette catégorie pour l’instant.<br>Soyez la première personne à publier — allez dans « Mon activité », créez le produit et appuyez sur Publier.', txt_primeiro_curso:'premier cours', txt_por:'Par', txt_gratuito:'Gratuit', txt_alunos:'élèves', btn_seu_curso:'Votre cours', btn_abrir_curso:'Ouvrir le cours', btn_ver_curso:'Voir le cours', vazio_perguntas:'Aucune question pour l’instant. Soyez la première personne à demander.', titulo_perguntas:'QUESTIONS', placeholder_pergunta_curso:'Écrivez votre question sur le cours', btn_enviar_pergunta:'Envoyer la question', aviso_nome_para_perguntar:'Indiquez votre nom dans le profil pour pouvoir poser une question.', titulo_avaliacoes:'AVIS', vazio_avaliacoes:'Pas encore d’avis.', placeholder_comentario:'Commentaire (facultatif)', aviso_toque_nota:'Touchez une note ci-dessus.', txt_sem_descricao:'Pas de description.', txt_alunos_cap:'Élèves', txt_horario:'Horaire', txt_falar_whatsapp:'Parler au créateur (WhatsApp)', txt_contato:'Contact', txt_entrar_grupo:'Rejoindre le groupe du cours', aviso_curso_e_seu:'Ce cours vous appartient. Enregistrez les ventes dans « Mon activité ».', aviso_ja_matriculado:'Vous êtes déjà inscrit. Le cours apparaît dans « Mes cours ».', btn_quero_curso:'Je veux ce cours', btn_entrar_curso:'Rejoindre le cours', aviso_pagamento_combinado:'Le paiement est convenu directement avec le créateur du cours. Vérifiez qui est la personne avant de transférer un quelconque montant.', toast_esta_em_meus_cursos:'C’est fait — il est dans « Mes cours ».', txt_nota_escolhida:'Note choisie :', txt_toque_enviar:'appuyez sur « Envoyer » ci-dessous.', btn_enviar_avaliacao:'Envoyer l’avis', toast_avaliacao_enviada:'Avis envoyé. Merci !', toast_pergunta_enviada:'Question envoyée.', vazio_matriculas:'Vous n’avez encore suivi aucun cours.<br>Jetez un œil à la Communauté.', btn_sair:'Quitter', vazio_lista_conversas:'Pas encore de conversation.', confirm_excluir_conversa:'Supprimer cette conversation ?', confirm_apagar_conversa:'Effacer toute la conversation ?', et_tema_texto:'Définir le thème et le public', et_tema_dica:'Une phrase : « j’enseigne X aux personnes qui veulent Y ».', et_roteiro_texto:'Construire le plan des cours', et_roteiro_dica:'Listez les modules avant de filmer quoi que ce soit.', et_gravar_texto:'Enregistrer le contenu', et_gravar_dica:'Téléphone sur trépied et bon éclairage suffisent pour commencer.', et_preco_texto:'Définir le prix', et_preco_dica:'Utilisez le simulateur de profit pour vérifier si le prix est cohérent.', et_pagina_texto:'Rédiger la page de vente', et_pagina_dica:'Promesse, public visé, contenu, prix et garantie.', et_publicar_com_texto:'Publier dans la Communauté', et_publicar_com_dica:'Visible par tout le monde ici, sans frais.', et_publicar_fora_texto:'Publier sur une plateforme externe', et_publicar_fora_dica:'Kiwify, Hotmart ou Eduzz s’occupent du paiement et de l’hébergement.', et_divulgar_texto:'Faire la promotion dans les 7 premiers jours', et_divulgar_dica:'Prévenez votre liste, publiez sur les réseaux, demandez des recommandations.', tit_editar_produto:'Modifier le produit', toast_de_nome_produto:'Donnez un nom au produit pour l’enregistrer.', toast_produto_salvo:'Produit enregistré.', confirm_excluir_produto:'Supprimer', toast_informe_valor_recebido:'Indiquez le montant reçu.', txt_venda_de:'Vente', toast_venda_registrada:'Vente enregistrée.', toast_valor_maior_zero:'Indiquez un montant supérieur à zéro.', aviso_preencha_lucro:'Renseignez au moins le profit mensuel pour que je puisse simuler.', txt_mes_min_cap:'Mois', txt_se_paga_em:'Se rentabilise en', txt_menos_1_mes:'moins d’un mois', txt_meses:'mois', txt_sem_investimento:'sans investissement', txt_por_hora_dedicada:'Par heure consacrée', txt_lucro_12_meses:'Profit sur 12 mois', txt_saldo_fim_ano:'Solde en fin d’année', txt_saldo_mes_a_mes:'Solde mois par mois', txt_venda_direta_sem_taxa:'vente directe (sans frais)', aviso_preencha_pagou:'Renseignez combien vous avez payé le produit.', txt_preco_sugerido:'Prix de vente suggéré', txt_taxa_da:'Frais de', txt_fixo:'fixe', txt_lucro_liquido_real:'Votre profit net réel', aviso_taxas_referencia:'Frais de référence 2026 — la plateforme peut facturer un peu différemment selon la catégorie exacte du produit. Vérifiez dans le panneau vendeur avant de publier l’annonce.', rel_titulo:'RAPPORT D’ACTIVITÉ', rel_gerado_em:'Généré le', rel_resumo_geral:'RÉSUMÉ GÉNÉRAL', rel_faturamento_total:'Chiffre d’affaires total :', rel_saidas_totais:'Dépenses totales :', rel_saldo:'Solde :', rel_vendas_totais:'Ventes totales :', rel_ticket_medio:'Panier moyen :', rel_ultimos_6_meses:'6 DERNIERS MOIS', rel_entrou:'entré', rel_saiu:'sorti', rel_nenhum_produto:'Aucun produit enregistré.', rel_ultimas_movimentacoes:'DERNIERS MOUVEMENTS', rel_nenhuma_movimentacao:'Aucun mouvement enregistré.', sug_investimento_sobra:'Suggestion d’investissement pour l’excédent de trésorerie', sug_economizar_mais:'Comment puis-je économiser plus ce mois-ci ?', sug_negocio_saudavel:'Mon activité est-elle en bonne santé ?', sug_aumentar_ticket:'Comment augmenter mon panier moyen ?', sug_baixar_preco:'Vaut-il la peine de baisser mon prix ?', sug_priorizar_produto:'Quel produit devrais-je privilégier maintenant ?', erro_bloqueado_file:'Le navigateur a bloqué cette requête — cela arrive généralement quand l’application est ouverte directement depuis le fichier téléchargé (file://) au lieu d’un lien publié (https://). Hébergez ce site sur une plateforme comme Netlify et ouvrez-le depuis là.', erro_sem_servidor:'Impossible de joindre le serveur. Vérifiez la connexion et réessayez.', erro_404_funcao:'Fonction du serveur introuvable (/.netlify/functions/chat). Si vous testez en dehors du site Netlify publié, c’est normal — cela ne fonctionne que sur le site réellement publié.', erro_429_muitas_msgs:'Trop de messages en peu de temps. Attendez quelques secondes et renvoyez.', erro_recusado:'Le serveur a refusé la requête', erro_erro:'Erreur', erro_tente_novo_instantes:'Réessayez dans un instant.', erro_resposta_vazia:'La réponse est revenue vide. Reformulez la question et réessayez.', diag_sem_dados:'Pas encore assez de données. Créez un produit et enregistrez la première vente ou dépense pour que je puisse évaluer votre santé financière.', diag_saldo_negativo:'Votre solde est négatif : les sorties ont déjà dépassé les entrées de', diag_entradas_cairam:'Vos entrées ont fortement baissé par rapport au mois dernier', diag_saidas_altas:'Vos dépenses de ce mois représentent déjà plus de 70 % de ce qui est entré.', diag_produto_abaixo_meta:'a', diag_bem_abaixo_da_meta:'bien en dessous de l’objectif de', diag_nenhum_alerta:'Aucune alerte pour l’instant. Solde positif et rien d’inattendu dans vos produits.', diag_sem_dados_ainda:'Pas encore de données', diag_saude_boa:'Santé financière : bonne', diag_saude_atencao:'Santé financière : attention', diag_saude_risco:'Santé financière : risque', diag_comparado_mes_passado:'Par rapport au mois dernier', erro_arquivo_direto:'Ce fichier est ouvert directement (file://).', erro_arquivo_direto_detalhe:'La connexion Firebase ne fonctionne pas ainsi — il faut du https:// ou localhost. Publiez le fichier (par exemple via Netlify Drop) et ouvrez-le via le lien.', erro_dentro_iframe:'L’application est dans une autre application (iframe).', erro_dentro_iframe_detalhe:'La connexion Google est généralement bloquée ici. Si Google échoue, essayez d’ouvrir le lien publié directement dans le navigateur du téléphone.', erro_login_indisponivel:'Service de connexion indisponible pour le moment.', erro_email_senha_obrigatorios:'L’e-mail et le mot de passe (min. 6 caractères) sont obligatoires.', erro_email_ja_tem_conta:'Cet e-mail a déjà un compte — appuyez sur « Se connecter ».', erro_email_invalido:'E-mail invalide.', erro_senha_fraca:'Mot de passe faible — utilisez au moins 6 caractères.', erro_senha_incorreta:'Mot de passe incorrect.', erro_conta_nao_encontrada:'Aucun compte trouvé avec cet e-mail — appuyez sur « Créer un compte ».', erro_credenciais_incorretas:'E-mail ou mot de passe incorrects.', erro_muitas_tentativas:'Trop de tentatives. Attendez un peu et réessayez.', erro_sem_conexao_firebase:'Pas de connexion avec le serveur Firebase pour le moment.', erro_dominio_nao_autorizado:'Ce domaine n’est pas autorisé dans Firebase (Authentication → Settings → Authorized domains).', erro_email_senha_desativado:'La connexion par E-mail/Mot de passe n’est pas encore activée dans Firebase (Authentication → Sign-in method).', erro_nao_consegui_completar:'Impossible de terminer cette action.', erro_popup_bloqueado:'Le navigateur a bloqué la fenêtre Google. Autorisez les pop-ups pour ce site et réessayez.', erro_popup_cancelado:'La fenêtre Google a été annulée. Réessayez.', erro_popup_fechado:'Vous avez fermé la fenêtre Google avant la fin.', erro_dominio_nao_autorizado_google:'Ce domaine n’est pas autorisé dans Firebase (Authentication → Settings → Authorized domains) — ajoutez le domaine depuis lequel vous ouvrez l’application.', erro_google_desativado:'La connexion Google n’est pas encore activée dans Firebase (Authentication → Sign-in method).', erro_nao_consegui_google:'Impossible de se connecter avec Google.', mic_nao_ouvi:'Je n’ai rien entendu. Parlez plus près du microphone.', mic_sem_disponivel:'Aucun microphone disponible sur cet appareil.', mic_conexao_insuficiente:'Connexion insuffisante pour reconnaître la voix pour le moment.', mic_nao_funcionou:'Le microphone n’a pas fonctionné. Réessayez ou tapez votre message.', mic_sub_iframe:'l’application est ouverte dans une autre application, et le microphone y est bloqué', mic_passo_iframe_1:'Appuyez sur le bouton <strong>ouvrir dans un nouvel onglet</strong> ou copiez l’adresse de cette page.', mic_passo_iframe_2:'Collez l’adresse dans le <strong>navigateur du téléphone</strong> (Safari, Chrome).', mic_passo_iframe_3:'Quand le navigateur le demande, choisissez <strong>Autoriser</strong> pour le microphone.', mic_passo_iframe_4:'En attendant, vous pouvez utiliser le <strong>microphone de votre clavier</strong> pour dicter ici.', mic_sub_inseguro:'le microphone ne fonctionne que sur une adresse https', mic_passo_inseguro_1:'Ouvrez le <strong>lien publié</strong> de l’application, pas le fichier enregistré sur l’appareil.', mic_passo_inseguro_2:'Vérifiez que l’adresse commence par <strong>https://</strong>.', mic_passo_inseguro_3:'Rechargez la page et appuyez de nouveau sur le microphone.', mic_sub_bloqueado:'le navigateur a bloqué l’accès — suivez les étapes', mic_passo_ios_1:'Ouvrez les <strong>Réglages</strong> de l’iPhone.', mic_passo_ios_2:'Descendez jusqu’à <strong>Safari</strong> (ou le navigateur que vous utilisez) et appuyez dessus.', mic_passo_ios_3:'Appuyez sur <strong>Microphone</strong> et choisissez <strong>Autoriser</strong>.', mic_passo_ios_4:'Revenez ici, rechargez et appuyez de nouveau sur le microphone.', mic_passo_outro_1:'Appuyez sur le cadenas ou le « ⓘ » à côté de l’adresse, en haut.', mic_passo_outro_2:'Cherchez <strong>Microphone</strong> dans les autorisations du site.', mic_passo_outro_3:'Passez de « Bloquer » à <strong>Autoriser</strong>.', mic_passo_outro_4:'Rechargez la page et appuyez de nouveau sur le microphone.'},
    'it-IT': { nav_conversa:'Conversazione', nav_negocio:'La mia attività', nav_comunidade:'Comunità', nav_cursos:'I miei corsi', nav_conta:'Il mio account', secao_conversas:'Conversazioni', btn_nova_conversa:'Nuova conversazione', input_placeholder:'Dimmi cosa ti serve…' , desc_negocio:'I tuoi prodotti, le tue vendite e il saldo — tutto salvato su questo dispositivo.', btn_criar_produto:'Crea prodotto', h3_tutor:'Tutor del business', lbl_pergunta_tutor:'Chiedi al tutor', placeholder_pergunta_tutor:'Il mio profitto va bene per questo settore? Come riduco le spese?', btn_perguntar:'Chiedi', h3_vendas:'Vendite degli ultimi 6 mesi', h3_meus_produtos:'I miei prodotti', btn_novo_produto:'Nuovo prodotto', h3_simulador:'Simulatore di profitto', btn_abrir_simulador:'Apri simulatore', aviso_simulador:'Stima quanto rende un prodotto prima di iniziare: quanto investire, quanto guadagni al mese, in quanto tempo si ripaga.', h3_precificador:'Calcolatore di prezzo automatico', btn_abrir_precificador:'Apri calcolatore', aviso_precificador:'Digli quanto hai pagato e il profitto desiderato, calcola il prezzo di vendita considerando la commissione della piattaforma.', h3_metas:'Obiettivi di risparmio', btn_nova_meta:'Nuovo obiettivo', h3_radar:'Radar delle spese fisse', h3_estoque:'Magazzino per rivendita', btn_novo_item:'Nuovo articolo', h3_gerador_anuncio:'Generatore di annunci', btn_criar_anuncio:'Crea annuncio', aviso_anuncio:'Descrivi il prodotto e scrive il testo dell’annuncio pronto da incollare.', h3_parcelar:'Conviene pagare a rate?', btn_comparar:'Confronta', aviso_parcelar:'Confronta il prezzo in contanti con quello a rate e mostra quanti interessi stai davvero pagando.', h3_comparador:'Comparatore di prodotti', aviso_comparador:'Aggiungi fino a 4 prodotti e cerca e crea una tabella con prezzo, pro e contro di ciascuno.', h3_desafio:'Sfida di risparmio', btn_ver_desafio:'Vedi sfida', h3_relatorio:'Rapporto del business', btn_gerar_relatorio:'Genera rapporto', aviso_relatorio:'Riepilogo in testo pronto da scaricare e inviare al commercialista o conservare come registro.', h3_produtos_olho:'Prodotti monitorati (prezzo)', btn_add_produto_olho:'Aggiungi prodotto', aviso_produtos_olho:'Questo non controlla il prezzo da solo continuamente — quando tocchi "Verifica ora", cerco davvero il prezzo attuale e lo confronto con quanto vuoi pagare.', h3_lembretes:'Promemoria', btn_novo_lembrete:'Nuovo promemoria', aviso_lembretes:'Rifornire il magazzino, rinnovare un abbonamento, qualsiasi cosa con una data da non dimenticare.', h3_movimentacoes:'Movimenti reali', lbl_tipo:'Tipo', opt_entrada:'Entrata', opt_saida:'Uscita', lbl_valor_reais:'Importo (R$)', lbl_do_que_se_trata:'Di cosa si tratta', btn_registrar_movimentacao:'Registra movimento', btn_publicar_curso:'Pubblica corso', desc_comunidade:'Corsi creati da persone reali qui dentro. Insegna ciò che sai, impara ciò che ancora non sai.', desc_cursos:'Ciò che hai ottenuto dalla community resta qui.', tit_anexar:'Allega', sub_anexar:'invia una foto del prodotto o un PDF', opc_tirar_foto:'Scatta foto', opc_galeria_pdf:'Galleria o PDF', tit_idioma:'Scegli la tua lingua', sub_idioma:'questo regola il riconoscimento vocale del microfono', tit_aparencia:'Aspetto', sub_aparencia:'scegli come appare l’app per te', tit_mic:'Abilita il microfono', btn_tentar_mic:'Già abilitato, riprova', sub_simulador:'proiezione di 12 mesi con i tuoi numeri', lbl_investimento_inicial:'Investimento iniziale (R$)', lbl_lucro_mes:'Profitto netto al mese (R$)', lbl_horas_semana:'Ore a settimana', btn_calcular:'Calcola', sub_precificador:'commissioni reali del 2026 già incluse nel calcolo', lbl_quanto_pagou_produto:'Quanto hai pagato il prodotto (R$)', lbl_lucro_percentual:'Profitto desiderato, sul pagato (%)', lbl_onde_vai_vender:'Dove venderai', opt_ml_classico:'Mercado Livre — Classico', opt_ml_premium:'Mercado Livre — Premium', opt_shopee:'Shopee', opt_direto:'Diretto (OLX, Enjoei, Instagram, WhatsApp) — senza commissione', btn_calcular_preco:'Calcola prezzo di vendita', tit_nova_meta:'Nuovo obiettivo di risparmio', sub_nova_meta:'calcola quanto risparmiare al mese per arrivarci', lbl_nome_meta:'Nome dell’obiettivo', lbl_valor_juntar:'Importo da risparmiare (R$)', lbl_ate_quando:'Entro quando', btn_criar_meta:'Crea obiettivo', tit_guardar_meta:'Aggiungi importo all’obiettivo', lbl_quanto_guardou:'Quanto hai appena risparmiato (R$)', btn_guardar:'Salva', lbl_nome_item:'Nome dell’articolo', lbl_quanto_pagou:'Quanto hai pagato (R$)', btn_add_estoque:'Aggiungi al magazzino', sub_anuncio:'testo pronto da incollare nell’annuncio', lbl_nome_produto:'Nome del prodotto', lbl_estado_produto:'Condizione', opt_novo_caixa:'Nuovo, in scatola', opt_seminovo:'Come nuovo', opt_usado_bom:'Usato, buone condizioni', opt_usado_marcas:'Usato, con segni di usura', lbl_preco_reais:'Prezzo (R$)', lbl_detalhes_extras:'Dettagli extra (opzionale)', btn_gerar_anuncio:'Genera annuncio', sub_parcelar:'confronta il contanti con le rate', lbl_preco_avista:'Prezzo in contanti (R$)', lbl_numero_parcelas:'Numero di rate', lbl_valor_parcela:'Importo di ogni rata (R$)', sub_comparador:'da 2 a 4 prodotti — cerca e crea la tabella', lbl_produto_1:'Prodotto 1', lbl_produto_2:'Prodotto 2', lbl_produto_3:'Prodotto 3 (opzionale)', lbl_produto_4:'Prodotto 4 (opzionale)', btn_comparar_agora:'Confronta ora', sub_desafio:'spunta ogni giorno man mano che risparmi l’importo', lbl_escolha_desafio:'Scegli la sfida', opt_desafio_1:'R$1 a R$100 crescente (100 giorni, totale R$5.050)', opt_desafio_2:'R$2 a R$200 crescente (100 giorni, totale R$10.100)', opt_desafio_5:'R$5 fisso a settimana (52 settimane, totale R$260)', btn_comecar_desafio:'Inizia questa sfida', sub_relatorio:'pronto da scaricare', btn_baixar_relatorio:'Scarica come file di testo', tit_produto_olho:'Prodotto monitorato', sub_produto_olho:'tocchi tu stesso "verifica ora" quando vuoi sapere il prezzo attuale', lbl_nome_produto_alerta:'Nome del prodotto', lbl_link_opcional:'Link (opzionale)', lbl_quanto_quer_pagar:'Quanto vuoi pagare (R$)', btn_adicionar:'Aggiungi', h3_lembretes_novo:'Nuovo promemoria', lbl_do_que_se_trata_2:'Di cosa si tratta', lbl_tipo_lembrete:'Tipo', opt_repor_estoque:'Rifornire magazzino', opt_renovar_assinatura:'Rinnovare abbonamento/strumento', opt_outro:'Altro', lbl_data:'Data', btn_criar_lembrete:'Crea promemoria', sub_produto:'un prodotto = un corso, ebook o mentoring che venderai', lbl_nome_produto_2:'Nome del prodotto', lbl_formato:'Formato', opt_curso_video:'Corso video', opt_ebook:'Ebook', opt_mentoria:'Mentoring', opt_planilha:'Foglio di calcolo o modello', opt_comunidade_paga:'Community a pagamento', lbl_preco_reais_2:'Prezzo (R$)', lbl_categoria:'Categoria', lbl_para_quem_e:'Per chi è', lbl_horario_aulas:'Orario delle lezioni (se presente)', lbl_contato_duvida:'Contatto per domande (WhatsApp, Instagram, ecc.)', lbl_link_grupo:'Link del gruppo (opzionale)', lbl_meta_vendas:'Obiettivo vendite mensile', btn_salvar_produto:'Salva prodotto', sub_etapas:'spunta man mano che finisci', tit_registrar_venda:'Registra vendita', lbl_quantidade_vendida:'Quantità venduta', lbl_valor_unidade:'Importo ricevuto per unità (R$)', btn_confirmar_venda:'Conferma vendita', aba_entrar:'Accedi', aba_criar_conta:'Crea account', lbl_email:'Email', placeholder_email:'tu@email.com', lbl_senha:'Password', placeholder_senha:'minimo 6 caratteri', btn_entrar:'Accedi', btn_criar_conta_2:'Crea account', txt_ou:'oppure', txt_continuar_google:'Continua con Google', aviso_login_indisponivel:'Impossibile caricare il servizio di accesso ora (nessuna connessione, o bloccato dal browser). Controlla la connessione e riprova.', logado_como:'accesso effettuato come', lbl_como_chamado:'Come vuoi essere chiamato', placeholder_nome_exemplo:'Ana Ribeiro', lbl_uma_linha_sobre_voce:'Una riga su di te', placeholder_bio_exemplo:'Lavoro nella falegnameria da 12 anni', btn_salvar:'Salva', btn_sair_conta:'Esci da questo account', toast_salvo:'Salvato.', confirm_sair_conta:'Uscire da questo account?', toast_saiu:'Hai effettuato il logout.', card_faturamento:'Fatturato', nota_faturamento:'tutto ciò che è entrato', card_vendas:'Vendite', nota_vendas:'unità vendute', card_ticket:'Scontrino medio', nota_ticket:'per vendita', card_saldo:'Saldo', nota_saldo:'entrate meno uscite', card_produtos:'Prodotti', nota_produtos:'nella community', card_saidas:'Uscite', nota_saidas:'costi registrati', vazio_grafico:'Ancora nessuna entrata. Registra la prima vendita qui sotto e il grafico si riempie.', vazio_produtos:'Ancora nessun prodotto.<br>Crea il primo e costruisco il piano di lancio a tappe.', txt_vendas_min:'vendite', txt_meta_min:'obiettivo', txt_mes_min:'mese', txt_etapas_min:'tappe', etq_na_comunidade:'nella community', etq_rascunho:'bozza', btn_plano:'Piano', btn_mais_venda:'+ Vendita', btn_publicado:'Pubblicato', btn_publicar:'Pubblica', btn_excluir:'Elimina', vazio_lancamentos:'Ancora nulla registrato.', tbl_descricao:'Descrizione', tbl_valor:'Importo', vazio_metas:'Ancora nessun obiettivo. Creane uno perché io calcoli quanto risparmiare al mese.', txt_de:'di', txt_ate:'entro', txt_guarde:'Risparmia', txt_pra_chegar_la:'per arrivarci', txt_meta_batida:'Obiettivo raggiunto! 🎉', btn_mais_guardar:'+ Risparmia', toast_preencha_meta:'Compila il nome e l’importo dell’obiettivo.', toast_meta_criada:'Obiettivo creato.', toast_informe_valor:'Indica un importo.', toast_guardado_total:'Salvato! Totale nell’obiettivo:', vazio_radar:'Ancora nessuna spesa ricorrente rilevata — serve che la stessa spesa compaia in almeno 2 mesi diversi.', txt_total_recorrente:'Totale ricorrente rilevato:', etp_comprado:'Comprato', etp_anunciado:'In vendita', etp_vendido:'Venduto', vazio_estoque:'Ancora nessun articolo. Aggiungi ciò che hai comprato per rivendere.', txt_pago:'Pagato:', btn_avancar:'Avanza', toast_de_nome_item:'Dai un nome all’articolo.', toast_nome_produto:'Indica il nome del prodotto.', aviso_preencha_tres:'Compila tutti e tre i campi.', vered_parcelar_bom:'Le rate risultano uguali o più economiche del contanti — di solito conviene, purché tu riesca a pagare tutte le rate in tempo.', vered_juro_baixo:'L’interesse incluso è basso. Se non hai tutta la somma ora, le rate sono ragionevoli.', vered_juro_alto:'L’interesse incluso è alto. Se hai la somma in contanti, quasi sempre conviene di più pagare in contanti (o negoziare uno sconto) piuttosto che a rate.', txt_total_parcelado:'Totale a rate', txt_diferenca_avista:'Differenza rispetto al contanti', txt_juro_embutido:'Interesse incluso', toast_min_2_produtos:'Aggiungi almeno 2 prodotti da confrontare.', vazio_desafio:'Nessuna sfida attiva. Tocca "Vedi sfida" per iniziarne una.', txt_dias:'giorni', txt_guardado_ate_agora:'Risparmiato finora', txt_progresso:'Progresso', txt_guardado:'Risparmiato', btn_reiniciar_desafio:'Ricomincia sfida', confirm_reiniciar_desafio:'Ricominciare la sfida da zero?', vazio_alertas:'Ancora nessun prodotto nella lista.', txt_quer_pagar_ate:'Vuole pagare fino a', txt_ultima_checagem:'Ultimo controllo:', btn_verificar_agora:'Verifica ora', txt_verificando:'Verifica in corso...', toast_preencha_alerta:'Compila il nome e il prezzo che vuoi pagare.', txt_renovar_assinatura:'Rinnova abbonamento', vazio_lembretes:'Ancora nessun promemoria.', txt_em:'tra', txt_atrasado_ha:'in ritardo da', txt_e_hoje:'è oggi', txt_chegando:'in arrivo', toast_preencha_lembrete:'Compila il nome e la data.', toast_nome_antes_publicar:'Imposta il tuo nome prima di pubblicare.', toast_descricao_antes_publicar:'Scrivi "per chi è" prima di pubblicare. Tocca il prodotto per modificare.', toast_primeiro_curso:'🌱 Primo corso pubblicato!', toast_publicado_comunidade:'Pubblicato nella community.', toast_publicado_so_aparelho:'Pubblicato solo su questo dispositivo.', toast_crie_produto_primeiro:'Crea prima il prodotto, poi pubblicalo.', toast_escolha_produto:'Scegli il prodotto e tocca "Pubblica".', aviso_com_publico:'Tutto ciò che pubblichi qui è visibile alle altre persone che usano l’app.', aviso_com_local:'Questo dispositivo sta salvando i corsi solo localmente, quindi vedi solo i tuoi. Apri tramite il link pubblicato per vedere quelli di tutti.', txt_todos:'Tutti', vazio_cursos_categoria:'Ancora nessun corso in questa categoria.<br>Sii la prima persona a pubblicare — vai su "La mia attività", crea il prodotto e tocca Pubblica.', txt_primeiro_curso:'primo corso', txt_por:'Di', txt_gratuito:'Gratuito', txt_alunos:'studenti', btn_seu_curso:'Il tuo corso', btn_abrir_curso:'Apri corso', btn_ver_curso:'Vedi corso', vazio_perguntas:'Ancora nessuna domanda. Sii la prima persona a chiedere.', titulo_perguntas:'DOMANDE', placeholder_pergunta_curso:'Scrivi la tua domanda sul corso', btn_enviar_pergunta:'Invia domanda', aviso_nome_para_perguntar:'Imposta il tuo nome nel profilo per poter chiedere.', titulo_avaliacoes:'RECENSIONI', vazio_avaliacoes:'Ancora nessuna recensione.', placeholder_comentario:'Commento (opzionale)', aviso_toque_nota:'Tocca un voto sopra.', txt_sem_descricao:'Nessuna descrizione.', txt_alunos_cap:'Studenti', txt_horario:'Orario', txt_falar_whatsapp:'Parla con chi l’ha creato (WhatsApp)', txt_contato:'Contatto', txt_entrar_grupo:'Entra nel gruppo del corso', aviso_curso_e_seu:'Questo corso è tuo. Registra le vendite in "La mia attività".', aviso_ja_matriculado:'Sei già iscritto. Il corso appare in "I miei corsi".', btn_quero_curso:'Voglio questo corso', btn_entrar_curso:'Iscriviti al corso', aviso_pagamento_combinado:'Il pagamento viene concordato direttamente con chi ha creato il corso. Verifica chi è la persona prima di trasferire qualsiasi importo.', toast_esta_em_meus_cursos:'Fatto — è in "I miei corsi".', txt_nota_escolhida:'Voto scelto:', txt_toque_enviar:'tocca "Invia" qui sotto.', btn_enviar_avaliacao:'Invia recensione', toast_avaliacao_enviada:'Recensione inviata. Grazie!', toast_pergunta_enviada:'Domanda inviata.', vazio_matriculas:'Non hai ancora seguito nessun corso.<br>Dai un’occhiata alla Community.', btn_sair:'Esci', vazio_lista_conversas:'Ancora nessuna conversazione.', confirm_excluir_conversa:'Eliminare questa conversazione?', confirm_apagar_conversa:'Cancellare tutta la conversazione?', et_tema_texto:'Definisci il tema e per chi è', et_tema_dica:'Una frase: "insegno X a persone che vogliono Y".', et_roteiro_texto:'Crea la scaletta delle lezioni', et_roteiro_dica:'Elenca i moduli prima di registrare qualsiasi cosa.', et_gravar_texto:'Registra il contenuto', et_gravar_dica:'Telefono su treppiede e buona luce risolvono già l’inizio.', et_preco_texto:'Definisci il prezzo', et_preco_dica:'Usa il simulatore di profitto per verificare se il prezzo torna.', et_pagina_texto:'Scrivi la pagina di vendita', et_pagina_dica:'Promessa, per chi è, cosa include, prezzo e garanzia.', et_publicar_com_texto:'Pubblica nella Community', et_publicar_com_dica:'Visibile a tutti qui dentro, senza commissioni.', et_publicar_fora_texto:'Pubblica su una piattaforma esterna', et_publicar_fora_dica:'Kiwify, Hotmart o Eduzz gestiscono pagamento e hosting.', et_divulgar_texto:'Promuovilo nei primi 7 giorni', et_divulgar_dica:'Avvisa la tua lista, pubblica sui social, chiedi passaparola.', tit_editar_produto:'Modifica prodotto', toast_de_nome_produto:'Dai un nome al prodotto per salvarlo.', toast_produto_salvo:'Prodotto salvato.', confirm_excluir_produto:'Elimina', toast_informe_valor_recebido:'Indica l’importo ricevuto.', txt_venda_de:'Vendita', toast_venda_registrada:'Vendita registrata.', toast_valor_maior_zero:'Indica un importo maggiore di zero.', aviso_preencha_lucro:'Compila almeno il profitto mensile perché io possa simulare.', txt_mes_min_cap:'Mese', txt_se_paga_em:'Si ripaga in', txt_menos_1_mes:'meno di 1 mese', txt_meses:'mesi', txt_sem_investimento:'senza investimento', txt_por_hora_dedicada:'Per ora dedicata', txt_lucro_12_meses:'Profitto in 12 mesi', txt_saldo_fim_ano:'Saldo a fine anno', txt_saldo_mes_a_mes:'Saldo mese per mese', txt_venda_direta_sem_taxa:'vendita diretta (senza commissione)', aviso_preencha_pagou:'Compila quanto hai pagato per il prodotto.', txt_preco_sugerido:'Prezzo di vendita suggerito', txt_taxa_da:'Commissione di', txt_fixo:'fisso', txt_lucro_liquido_real:'Il tuo profitto netto reale', aviso_taxas_referencia:'Commissioni di riferimento 2026 — la piattaforma può addebitare un po’ diversamente a seconda della categoria esatta del prodotto. Conferma nel pannello venditore prima di pubblicare l’annuncio.', rel_titulo:'RAPPORTO DEL BUSINESS', rel_gerado_em:'Generato il', rel_resumo_geral:'RIEPILOGO GENERALE', rel_faturamento_total:'Fatturato totale:', rel_saidas_totais:'Uscite totali:', rel_saldo:'Saldo:', rel_vendas_totais:'Vendite totali:', rel_ticket_medio:'Scontrino medio:', rel_ultimos_6_meses:'ULTIMI 6 MESI', rel_entrou:'entrato', rel_saiu:'uscito', rel_nenhum_produto:'Nessun prodotto registrato.', rel_ultimas_movimentacoes:'ULTIMI MOVIMENTI', rel_nenhuma_movimentacao:'Nessun movimento registrato.', sug_investimento_sobra:'Suggerimento di investimento per la liquidità in eccesso', sug_economizar_mais:'Come posso risparmiare di più questo mese?', sug_negocio_saudavel:'La mia attività è in salute?', sug_aumentar_ticket:'Come aumento il mio scontrino medio?', sug_baixar_preco:'Conviene abbassare il mio prezzo?', sug_priorizar_produto:'Quale prodotto dovrei privilegiare ora?', erro_bloqueado_file:'Il browser ha bloccato questa richiesta — accade di solito quando l’app viene aperta direttamente dal file scaricato (file://) invece che da un link pubblicato (https://). Carica questo sito su un host come Netlify e aprilo da lì.', erro_sem_servidor:'Impossibile raggiungere il server. Controlla la connessione e riprova.', erro_404_funcao:'Funzione del server non trovata (/.netlify/functions/chat). Se stai testando fuori dal sito Netlify pubblicato, è normale — funziona solo sul sito effettivamente pubblicato.', erro_429_muitas_msgs:'Troppi messaggi in poco tempo. Aspetta qualche secondo e invia di nuovo.', erro_recusado:'Il server ha rifiutato la richiesta', erro_erro:'Errore', erro_tente_novo_instantes:'Riprova tra un momento.', erro_resposta_vazia:'La risposta è arrivata vuota. Riformula la domanda e riprova.', diag_sem_dados:'Non ci sono ancora abbastanza dati. Crea un prodotto e registra la prima vendita o spesa perché io possa valutare la tua salute finanziaria.', diag_saldo_negativo:'Il tuo saldo è negativo: le uscite hanno già superato le entrate di', diag_entradas_cairam:'Le tue entrate sono calate molto rispetto al mese scorso', diag_saidas_altas:'Le tue uscite di questo mese consumano già più del 70% di quanto è entrato.', diag_produto_abaixo_meta:'ha', diag_bem_abaixo_da_meta:'ben al di sotto dell’obiettivo di', diag_nenhum_alerta:'Nessun avviso al momento. Saldo positivo e nulla di inaspettato nei tuoi prodotti.', diag_sem_dados_ainda:'Ancora nessun dato', diag_saude_boa:'Salute finanziaria: buona', diag_saude_atencao:'Salute finanziaria: attenzione', diag_saude_risco:'Salute finanziaria: rischio', diag_comparado_mes_passado:'Rispetto al mese scorso', erro_arquivo_direto:'Questo file è aperto direttamente (file://).', erro_arquivo_direto_detalhe:'L’accesso Firebase non funziona così — deve essere https:// o localhost. Pubblica il file (ad esempio con Netlify Drop) e aprilo tramite il link.', erro_dentro_iframe:'L’app è all’interno di un’altra app (iframe).', erro_dentro_iframe_detalhe:'L’accesso con Google viene solitamente bloccato qui dentro. Se Google fallisce, prova ad aprire il link pubblicato direttamente nel browser del telefono.', erro_login_indisponivel:'Servizio di accesso non disponibile al momento.', erro_email_senha_obrigatorios:'Email e password (min. 6 caratteri) sono obbligatori.', erro_email_ja_tem_conta:'Questa email ha già un account — tocca "Accedi".', erro_email_invalido:'Email non valida.', erro_senha_fraca:'Password debole — usa almeno 6 caratteri.', erro_senha_incorreta:'Password errata.', erro_conta_nao_encontrada:'Nessun account trovato con questa email — tocca "Crea account".', erro_credenciais_incorretas:'Email o password errati.', erro_muitas_tentativas:'Troppi tentativi. Aspetta un po’ e riprova.', erro_sem_conexao_firebase:'Nessuna connessione al server Firebase al momento.', erro_dominio_nao_autorizado:'Questo dominio non è autorizzato in Firebase (Authentication → Settings → Authorized domains).', erro_email_senha_desativado:'L’accesso con Email/Password non è ancora attivato in Firebase (Authentication → Sign-in method).', erro_nao_consegui_completar:'Non sono riuscito a completare.', erro_popup_bloqueado:'Il browser ha bloccato la finestra di Google. Consenti i popup per questo sito e riprova.', erro_popup_cancelado:'La finestra di Google è stata annullata. Riprova.', erro_popup_fechado:'Hai chiuso la finestra di Google prima di terminare.', erro_dominio_nao_autorizado_google:'Questo dominio non è autorizzato in Firebase (Authentication → Settings → Authorized domains) — aggiungi il dominio da cui stai aprendo l’app.', erro_google_desativado:'L’accesso con Google non è ancora attivato in Firebase (Authentication → Sign-in method).', erro_nao_consegui_google:'Non sono riuscito ad accedere con Google.', mic_nao_ouvi:'Non ho sentito nulla. Parla più vicino al microfono.', mic_sem_disponivel:'Nessun microfono disponibile su questo dispositivo.', mic_conexao_insuficiente:'Connessione insufficiente per riconoscere la voce ora.', mic_nao_funcionou:'Il microfono non ha funzionato. Riprova o scrivi.', mic_sub_iframe:'l’app è aperta dentro un’altra applicazione, e lì il microfono resta bloccato', mic_passo_iframe_1:'Tocca il pulsante <strong>apri in una nuova scheda</strong> o copia l’indirizzo di questa pagina.', mic_passo_iframe_2:'Incolla l’indirizzo nel <strong>browser del telefono</strong> (Safari, Chrome).', mic_passo_iframe_3:'Quando il browser chiede, scegli <strong>Consenti</strong> per il microfono.', mic_passo_iframe_4:'Nel frattempo, puoi usare il <strong>microfono della tastiera</strong> per dettare qui.', mic_sub_inseguro:'il microfono funziona solo su un indirizzo https', mic_passo_inseguro_1:'Apri il <strong>link pubblicato</strong> dell’app, non il file salvato sul dispositivo.', mic_passo_inseguro_2:'Controlla che l’indirizzo inizi con <strong>https://</strong>.', mic_passo_inseguro_3:'Ricarica la pagina e tocca di nuovo il microfono.', mic_sub_bloqueado:'il browser ha bloccato l’accesso — segui i passaggi', mic_passo_ios_1:'Apri le <strong>Impostazioni</strong> dell’iPhone.', mic_passo_ios_2:'Scendi fino a <strong>Safari</strong> (o il browser che usi) e toccalo.', mic_passo_ios_3:'Tocca <strong>Microfono</strong> e scegli <strong>Consenti</strong>.', mic_passo_ios_4:'Torna qui, ricarica e tocca di nuovo il microfono.', mic_passo_outro_1:'Tocca il lucchetto o la "ⓘ" accanto all’indirizzo, in alto.', mic_passo_outro_2:'Cerca <strong>Microfono</strong> nei permessi del sito.', mic_passo_outro_3:'Cambia da "Blocca" a <strong>Consenti</strong>.', mic_passo_outro_4:'Ricarica la pagina e tocca di nuovo il microfono.'},
    'de-DE': { nav_conversa:'Unterhaltung', nav_negocio:'Mein Geschäft', nav_comunidade:'Community', nav_cursos:'Meine Kurse', nav_conta:'Mein Konto', secao_conversas:'Unterhaltungen', btn_nova_conversa:'Neue Unterhaltung', input_placeholder:'Sag mir, was du brauchst…' , desc_negocio:'Deine Produkte, deine Verkäufe und der Kontostand — alles auf diesem Gerät gespeichert.', btn_criar_produto:'Produkt erstellen', h3_tutor:'Geschäfts-Tutor', lbl_pergunta_tutor:'Frag den Tutor', placeholder_pergunta_tutor:'Ist mein Gewinn für diese Branche gut? Wie senke ich meine Ausgaben?', btn_perguntar:'Fragen', h3_vendas:'Verkäufe der letzten 6 Monate', h3_meus_produtos:'Meine Produkte', btn_novo_produto:'Neues Produkt', h3_simulador:'Gewinnsimulator', btn_abrir_simulador:'Simulator öffnen', aviso_simulador:'Plane, wie viel ein Produkt einbringt, bevor du startest: wie viel investieren, wie viel Gewinn im Monat, wie lange bis es sich amortisiert.', h3_precificador:'Automatischer Preisrechner', btn_abrir_precificador:'Preisrechner öffnen', aviso_precificador:'Gib an, was du bezahlt hast und welchen Gewinn du willst — er berechnet den Verkaufspreis inklusive Plattformgebühr.', h3_metas:'Sparziele', btn_nova_meta:'Neues Ziel', h3_radar:'Fixkosten-Radar', h3_estoque:'Lager für Weiterverkauf', btn_novo_item:'Neuer Artikel', h3_gerador_anuncio:'Anzeigengenerator', btn_criar_anuncio:'Anzeige erstellen', aviso_anuncio:'Beschreibe das Produkt, und er schreibt den fertigen Anzeigentext zum Einfügen.', h3_parcelar:'Lohnt sich die Ratenzahlung?', btn_comparar:'Vergleichen', aviso_parcelar:'Vergleicht den Barpreis mit dem Ratenpreis und zeigt, wie viel Zinsen du wirklich zahlst.', h3_comparador:'Produktvergleich', aviso_comparador:'Füge bis zu 4 Produkte hinzu — er recherchiert und erstellt eine Tabelle mit Preis, Vor- und Nachteilen jedes einzelnen.', h3_desafio:'Spar-Challenge', btn_ver_desafio:'Challenge ansehen', h3_relatorio:'Geschäftsbericht', btn_gerar_relatorio:'Bericht erstellen', aviso_relatorio:'Textzusammenfassung, fertig zum Herunterladen und an den Buchhalter senden oder als Beleg aufbewahren.', h3_produtos_olho:'Beobachtete Produkte (Preis)', btn_add_produto_olho:'Produkt hinzufügen', aviso_produtos_olho:'Das prüft den Preis nicht ständig von selbst — wenn du auf „Jetzt prüfen" tippst, recherchiere ich den aktuellen Preis wirklich und vergleiche ihn mit dem, was du zahlen willst.', h3_lembretes:'Erinnerungen', btn_novo_lembrete:'Neue Erinnerung', aviso_lembretes:'Lager auffüllen, ein Tool-Abo verlängern, alles mit Datum, das du nicht vergessen sollst.', h3_movimentacoes:'Tatsächliche Bewegungen', lbl_tipo:'Typ', opt_entrada:'Einnahme', opt_saida:'Ausgabe', lbl_valor_reais:'Betrag (R$)', lbl_do_que_se_trata:'Worum es geht', btn_registrar_movimentacao:'Bewegung erfassen', btn_publicar_curso:'Kurs veröffentlichen', desc_comunidade:'Kurse von echten Menschen genau hier. Unterrichte, was du weißt, lerne, was du noch nicht weißt.', desc_cursos:'Was du aus der Community bekommen hast, bleibt hier.', tit_anexar:'Anhängen', sub_anexar:'sende ein Produktfoto oder ein PDF', opc_tirar_foto:'Foto aufnehmen', opc_galeria_pdf:'Galerie oder PDF', tit_idioma:'Wähle deine Sprache', sub_idioma:'das passt die Spracherkennung des Mikrofons an', tit_aparencia:'Erscheinungsbild', sub_aparencia:'wähle, wie die App für dich aussieht', tit_mic:'Mikrofon freigeben', btn_tentar_mic:'Bereits freigegeben, erneut versuchen', sub_simulador:'12-Monats-Prognose mit deinen eigenen Zahlen', lbl_investimento_inicial:'Anfangsinvestition (R$)', lbl_lucro_mes:'Nettogewinn pro Monat (R$)', lbl_horas_semana:'Stunden pro Woche', btn_calcular:'Berechnen', sub_precificador:'echte Gebühren von 2026 bereits in der Berechnung enthalten', lbl_quanto_pagou_produto:'Wie viel du für das Produkt bezahlt hast (R$)', lbl_lucro_percentual:'Gewünschter Gewinn, auf den bezahlten Betrag (%)', lbl_onde_vai_vender:'Wo du verkaufen wirst', opt_ml_classico:'Mercado Livre — Classic', opt_ml_premium:'Mercado Livre — Premium', opt_shopee:'Shopee', opt_direto:'Direkt (OLX, Enjoei, Instagram, WhatsApp) — ohne Gebühr', btn_calcular_preco:'Verkaufspreis berechnen', tit_nova_meta:'Neues Sparziel', sub_nova_meta:'berechnet, wie viel du monatlich sparen musst, um es zu erreichen', lbl_nome_meta:'Zielname', lbl_valor_juntar:'Betrag, den du sparen willst (R$)', lbl_ate_quando:'Bis wann', btn_criar_meta:'Ziel erstellen', tit_guardar_meta:'Betrag zum Ziel hinzufügen', lbl_quanto_guardou:'Wie viel du gerade gespart hast (R$)', btn_guardar:'Speichern', lbl_nome_item:'Artikelname', lbl_quanto_pagou:'Wie viel du bezahlt hast (R$)', btn_add_estoque:'Zum Lager hinzufügen', sub_anuncio:'Text bereit zum Einfügen in die Anzeige', lbl_nome_produto:'Produktname', lbl_estado_produto:'Zustand', opt_novo_caixa:'Neu, in der Verpackung', opt_seminovo:'Wie neu', opt_usado_bom:'Gebraucht, guter Zustand', opt_usado_marcas:'Gebraucht, mit Gebrauchsspuren', lbl_preco_reais:'Preis (R$)', lbl_detalhes_extras:'Zusätzliche Details (optional)', btn_gerar_anuncio:'Anzeige erstellen', sub_parcelar:'vergleicht Barpreis mit Ratenzahlung', lbl_preco_avista:'Barpreis (R$)', lbl_numero_parcelas:'Anzahl der Raten', lbl_valor_parcela:'Betrag jeder Rate (R$)', sub_comparador:'2 bis 4 Produkte — es recherchiert und erstellt die Tabelle', lbl_produto_1:'Produkt 1', lbl_produto_2:'Produkt 2', lbl_produto_3:'Produkt 3 (optional)', lbl_produto_4:'Produkt 4 (optional)', btn_comparar_agora:'Jetzt vergleichen', sub_desafio:'tippe jeden Tag an, sobald du den Betrag gespart hast', lbl_escolha_desafio:'Wähle die Challenge', opt_desafio_1:'R$1 bis R$100 steigend (100 Tage, ergibt R$5.050)', opt_desafio_2:'R$2 bis R$200 steigend (100 Tage, ergibt R$10.100)', opt_desafio_5:'R$5 fest pro Woche (52 Wochen, ergibt R$260)', btn_comecar_desafio:'Diese Challenge starten', sub_relatorio:'bereit zum Herunterladen', btn_baixar_relatorio:'Als Textdatei herunterladen', tit_produto_olho:'Beobachtetes Produkt', sub_produto_olho:'du tippst selbst auf „Jetzt prüfen", wenn du den aktuellen Preis wissen willst', lbl_nome_produto_alerta:'Produktname', lbl_link_opcional:'Link (optional)', lbl_quanto_quer_pagar:'Wie viel du zahlen willst (R$)', btn_adicionar:'Hinzufügen', h3_lembretes_novo:'Neue Erinnerung', lbl_do_que_se_trata_2:'Worum es geht', lbl_tipo_lembrete:'Typ', opt_repor_estoque:'Lager auffüllen', opt_renovar_assinatura:'Abo/Tool erneuern', opt_outro:'Andere', lbl_data:'Datum', btn_criar_lembrete:'Erinnerung erstellen', sub_produto:'ein Produkt = ein Kurs, Ebook oder Mentoring, das du verkaufst', lbl_nome_produto_2:'Produktname', lbl_formato:'Format', opt_curso_video:'Videokurs', opt_ebook:'Ebook', opt_mentoria:'Mentoring', opt_planilha:'Tabelle oder Vorlage', opt_comunidade_paga:'Kostenpflichtige Community', lbl_preco_reais_2:'Preis (R$)', lbl_categoria:'Kategorie', lbl_para_quem_e:'Für wen es ist', lbl_horario_aulas:'Unterrichtszeiten (falls vorhanden)', lbl_contato_duvida:'Kontakt für Fragen (WhatsApp, Instagram, usw.)', lbl_link_grupo:'Gruppenlink (optional)', lbl_meta_vendas:'Monatliches Verkaufsziel', btn_salvar_produto:'Produkt speichern', sub_etapas:'abhaken, sobald erledigt', tit_registrar_venda:'Verkauf erfassen', lbl_quantidade_vendida:'Verkaufte Menge', lbl_valor_unidade:'Erhaltener Betrag pro Einheit (R$)', btn_confirmar_venda:'Verkauf bestätigen', aba_entrar:'Anmelden', aba_criar_conta:'Konto erstellen', lbl_email:'E-Mail', placeholder_email:'du@email.com', lbl_senha:'Passwort', placeholder_senha:'mindestens 6 Zeichen', btn_entrar:'Anmelden', btn_criar_conta_2:'Konto erstellen', txt_ou:'oder', txt_continuar_google:'Mit Google fortfahren', aviso_login_indisponivel:'Der Login-Dienst konnte gerade nicht geladen werden (kein Internet oder vom Browser blockiert). Prüfe deine Verbindung und versuche es erneut.', logado_como:'angemeldet als', lbl_como_chamado:'Wie sollen wir dich nennen', placeholder_nome_exemplo:'Ana Ribeiro', lbl_uma_linha_sobre_voce:'Eine Zeile über dich', placeholder_bio_exemplo:'Ich arbeite seit 12 Jahren als Tischler', btn_salvar:'Speichern', btn_sair_conta:'Von diesem Konto abmelden', toast_salvo:'Gespeichert.', confirm_sair_conta:'Von diesem Konto abmelden?', toast_saiu:'Du bist abgemeldet.', card_faturamento:'Umsatz', nota_faturamento:'alles, was eingegangen ist', card_vendas:'Verkäufe', nota_vendas:'verkaufte Einheiten', card_ticket:'Durchschnittsbon', nota_ticket:'pro Verkauf', card_saldo:'Kontostand', nota_saldo:'Einnahmen minus Ausgaben', card_produtos:'Produkte', nota_produtos:'in der Community', card_saidas:'Ausgaben', nota_saidas:'erfasste Kosten', vazio_grafico:'Noch keine Einnahmen. Erfasse unten den ersten Verkauf, dann füllt sich das Diagramm.', vazio_produtos:'Noch keine Produkte.<br>Erstelle das erste und ich baue den Launch-Plan in Schritten.', txt_vendas_min:'Verkäufe', txt_meta_min:'Ziel', txt_mes_min:'Monat', txt_etapas_min:'Schritte', etq_na_comunidade:'in der Community', etq_rascunho:'Entwurf', btn_plano:'Plan', btn_mais_venda:'+ Verkauf', btn_publicado:'Veröffentlicht', btn_publicar:'Veröffentlichen', btn_excluir:'Löschen', vazio_lancamentos:'Noch nichts erfasst.', tbl_descricao:'Beschreibung', tbl_valor:'Betrag', vazio_metas:'Noch keine Ziele. Erstelle eins, damit ich berechnen kann, wie viel du monatlich sparen sollst.', txt_de:'von', txt_ate:'bis', txt_guarde:'Spare', txt_pra_chegar_la:'um es zu erreichen', txt_meta_batida:'Ziel erreicht! 🎉', btn_mais_guardar:'+ Sparen', toast_preencha_meta:'Gib Namen und Betrag des Ziels ein.', toast_meta_criada:'Ziel erstellt.', toast_informe_valor:'Gib einen Betrag ein.', toast_guardado_total:'Gespeichert! Gesamt im Ziel:', vazio_radar:'Noch keine wiederkehrende Ausgabe erkannt — die gleiche Ausgabe muss in mindestens 2 verschiedenen Monaten vorkommen.', txt_total_recorrente:'Erkannter wiederkehrender Betrag:', etp_comprado:'Gekauft', etp_anunciado:'Inseriert', etp_vendido:'Verkauft', vazio_estoque:'Noch keine Artikel. Füge hinzu, was du zum Weiterverkauf gekauft hast.', txt_pago:'Bezahlt:', btn_avancar:'Weiter', toast_de_nome_item:'Gib dem Artikel einen Namen.', toast_nome_produto:'Gib den Produktnamen ein.', aviso_preencha_tres:'Fülle alle drei Felder aus.', vered_parcelar_bom:'Ratenzahlung ist gleich teuer oder günstiger als bar — meist lohnenswert, solange du alle Raten pünktlich zahlen kannst.', vered_juro_baixo:'Der enthaltene Zins ist niedrig. Wenn du nicht das ganze Geld jetzt hast, ist Ratenzahlung vertretbar.', vered_juro_alto:'Der enthaltene Zins ist hoch. Wenn du den Betrag bar hast, lohnt es sich fast immer mehr, bar zu zahlen (oder Rabatt auszuhandeln), statt in Raten.', txt_total_parcelado:'Gesamtbetrag in Raten', txt_diferenca_avista:'Differenz zum Barpreis', txt_juro_embutido:'Enthaltener Zins', toast_min_2_produtos:'Füge mindestens 2 Produkte zum Vergleich hinzu.', vazio_desafio:'Keine aktive Challenge. Tippe auf „Challenge ansehen", um eine zu starten.', txt_dias:'Tage', txt_guardado_ate_agora:'Bisher gespart', txt_progresso:'Fortschritt', txt_guardado:'Gespart', btn_reiniciar_desafio:'Challenge neu starten', confirm_reiniciar_desafio:'Challenge von vorne beginnen?', vazio_alertas:'Noch keine Produkte auf der Liste.', txt_quer_pagar_ate:'Möchte bis zu', txt_ultima_checagem:'Letzte Prüfung:', btn_verificar_agora:'Jetzt prüfen', txt_verificando:'Wird geprüft...', toast_preencha_alerta:'Gib den Namen und den Preis ein, den du zahlen willst.', txt_renovar_assinatura:'Abo erneuern', vazio_lembretes:'Noch keine Erinnerungen.', txt_em:'in', txt_atrasado_ha:'überfällig seit', txt_e_hoje:'ist heute', txt_chegando:'bald fällig', toast_preencha_lembrete:'Gib Namen und Datum ein.', toast_nome_antes_publicar:'Gib deinen Namen an, bevor du veröffentlichst.', toast_descricao_antes_publicar:'Schreibe „für wen es ist", bevor du veröffentlichst. Tippe auf das Produkt zum Bearbeiten.', toast_primeiro_curso:'🌱 Erster Kurs veröffentlicht!', toast_publicado_comunidade:'In der Community veröffentlicht.', toast_publicado_so_aparelho:'Nur auf diesem Gerät veröffentlicht.', toast_crie_produto_primeiro:'Erstelle zuerst das Produkt und veröffentliche es dann.', toast_escolha_produto:'Wähle das Produkt aus und tippe auf „Veröffentlichen".', aviso_com_publico:'Alles, was du hier veröffentlichst, ist für andere Nutzer der App sichtbar.', aviso_com_local:'Dieses Gerät speichert Kurse nur lokal, du siehst also nur deine eigenen. Öffne den veröffentlichten Link, um die aller zu sehen.', txt_todos:'Alle', vazio_cursos_categoria:'Noch kein Kurs in dieser Kategorie.<br>Sei die erste Person, die veröffentlicht — gehe zu „Mein Geschäft", erstelle das Produkt und tippe auf Veröffentlichen.', txt_primeiro_curso:'erster Kurs', txt_por:'Von', txt_gratuito:'Kostenlos', txt_alunos:'Teilnehmer', btn_seu_curso:'Dein Kurs', btn_abrir_curso:'Kurs öffnen', btn_ver_curso:'Kurs ansehen', vazio_perguntas:'Noch keine Fragen. Sei die erste Person, die fragt.', titulo_perguntas:'FRAGEN', placeholder_pergunta_curso:'Schreibe deine Frage zum Kurs', btn_enviar_pergunta:'Frage senden', aviso_nome_para_perguntar:'Gib deinen Namen im Profil an, um fragen zu können.', titulo_avaliacoes:'BEWERTUNGEN', vazio_avaliacoes:'Noch keine Bewertung.', placeholder_comentario:'Kommentar (optional)', aviso_toque_nota:'Tippe oben auf eine Bewertung.', txt_sem_descricao:'Keine Beschreibung.', txt_alunos_cap:'Teilnehmer', txt_horario:'Zeitplan', txt_falar_whatsapp:'Mit dem Ersteller sprechen (WhatsApp)', txt_contato:'Kontakt', txt_entrar_grupo:'Der Kursgruppe beitreten', aviso_curso_e_seu:'Dieser Kurs gehört dir. Verkäufe erfasst du in „Mein Geschäft".', aviso_ja_matriculado:'Du bist bereits angemeldet. Der Kurs erscheint unter „Meine Kurse".', btn_quero_curso:'Ich will diesen Kurs', btn_entrar_curso:'Kurs beitreten', aviso_pagamento_combinado:'Die Zahlung wird direkt mit dem Ersteller des Kurses vereinbart. Prüfe, wer die Person ist, bevor du einen Betrag überweist.', toast_esta_em_meus_cursos:'Fertig — er ist unter „Meine Kurse".', txt_nota_escolhida:'Gewählte Bewertung:', txt_toque_enviar:'tippe unten auf „Senden".', btn_enviar_avaliacao:'Bewertung senden', toast_avaliacao_enviada:'Bewertung gesendet. Danke!', toast_pergunta_enviada:'Frage gesendet.', vazio_matriculas:'Du hast noch keinen Kurs belegt.<br>Schau dir die Community an.', btn_sair:'Verlassen', vazio_lista_conversas:'Noch keine Unterhaltungen.', confirm_excluir_conversa:'Diese Unterhaltung löschen?', confirm_apagar_conversa:'Die ganze Unterhaltung löschen?', et_tema_texto:'Thema und Zielgruppe festlegen', et_tema_dica:'Ein Satz: „Ich unterrichte X für Menschen, die Y wollen".', et_roteiro_texto:'Kursablauf erstellen', et_roteiro_dica:'Liste die Module auf, bevor du irgendetwas aufnimmst.', et_gravar_texto:'Inhalt aufnehmen', et_gravar_dica:'Handy auf Stativ und gutes Licht lösen schon den Anfang.', et_preco_texto:'Preis festlegen', et_preco_dica:'Nutze den Gewinnsimulator, um zu prüfen, ob der Preis passt.', et_pagina_texto:'Verkaufsseite schreiben', et_pagina_dica:'Versprechen, Zielgruppe, Inhalt, Preis und Garantie.', et_publicar_com_texto:'In der Community veröffentlichen', et_publicar_com_dica:'Für alle hier sichtbar, ohne Gebühr.', et_publicar_fora_texto:'Auf einer externen Plattform veröffentlichen', et_publicar_fora_dica:'Kiwify, Hotmart oder Eduzz übernehmen Zahlung und Hosting.', et_divulgar_texto:'In den ersten 7 Tagen bewerben', et_divulgar_dica:'Informiere deine Liste, poste in sozialen Medien, bitte um Weiterempfehlungen.', tit_editar_produto:'Produkt bearbeiten', toast_de_nome_produto:'Gib dem Produkt einen Namen, um es zu speichern.', toast_produto_salvo:'Produkt gespeichert.', confirm_excluir_produto:'Löschen', toast_informe_valor_recebido:'Gib den erhaltenen Betrag ein.', txt_venda_de:'Verkauf', toast_venda_registrada:'Verkauf erfasst.', toast_valor_maior_zero:'Gib einen Betrag größer als null ein.', aviso_preencha_lucro:'Gib mindestens den monatlichen Gewinn ein, damit ich simulieren kann.', txt_mes_min_cap:'Monat', txt_se_paga_em:'Amortisiert sich in', txt_menos_1_mes:'weniger als 1 Monat', txt_meses:'Monaten', txt_sem_investimento:'ohne Investition', txt_por_hora_dedicada:'Pro investierter Stunde', txt_lucro_12_meses:'Gewinn über 12 Monate', txt_saldo_fim_ano:'Kontostand am Jahresende', txt_saldo_mes_a_mes:'Kontostand Monat für Monat', txt_venda_direta_sem_taxa:'Direktverkauf (ohne Gebühr)', aviso_preencha_pagou:'Gib ein, wie viel du für das Produkt bezahlt hast.', txt_preco_sugerido:'Vorgeschlagener Verkaufspreis', txt_taxa_da:'Gebühr von', txt_fixo:'fest', txt_lucro_liquido_real:'Dein echter Nettogewinn', aviso_taxas_referencia:'Referenzgebühren von 2026 — die Plattform kann je nach genauer Produktkategorie etwas anders berechnen. Bestätige im Verkäufer-Panel, bevor du die Anzeige veröffentlichst.', rel_titulo:'GESCHÄFTSBERICHT', rel_gerado_em:'Erstellt am', rel_resumo_geral:'ALLGEMEINE ÜBERSICHT', rel_faturamento_total:'Gesamtumsatz:', rel_saidas_totais:'Gesamtausgaben:', rel_saldo:'Kontostand:', rel_vendas_totais:'Verkäufe insgesamt:', rel_ticket_medio:'Durchschnittsbon:', rel_ultimos_6_meses:'LETZTE 6 MONATE', rel_entrou:'eingegangen', rel_saiu:'ausgegangen', rel_nenhum_produto:'Kein Produkt erfasst.', rel_ultimas_movimentacoes:'LETZTE BEWEGUNGEN', rel_nenhuma_movimentacao:'Keine Bewegung erfasst.', sug_investimento_sobra:'Anlagevorschlag für überschüssiges Geld', sug_economizar_mais:'Wie kann ich diesen Monat mehr sparen?', sug_negocio_saudavel:'Ist mein Geschäft gesund?', sug_aumentar_ticket:'Wie erhöhe ich meinen Durchschnittsbon?', sug_baixar_preco:'Lohnt es sich, meinen Preis zu senken?', sug_priorizar_produto:'Welches Produkt sollte ich jetzt priorisieren?', erro_bloqueado_file:'Der Browser hat diese Anfrage blockiert — das passiert meist, wenn die App direkt aus der heruntergeladenen Datei (file://) statt über einen veröffentlichten Link (https://) geöffnet wird. Hoste diese Seite z. B. bei Netlify und öffne sie von dort.', erro_sem_servidor:'Server konnte nicht erreicht werden. Prüfe die Verbindung und versuche es erneut.', erro_404_funcao:'Serverfunktion nicht gefunden (/.netlify/functions/chat). Wenn du außerhalb der veröffentlichten Netlify-Seite testest, ist das normal — es funktioniert nur auf der tatsächlich veröffentlichten Seite.', erro_429_muitas_msgs:'Zu viele Nachrichten in kurzer Zeit. Warte ein paar Sekunden und sende erneut.', erro_recusado:'Der Server hat die Anfrage abgelehnt', erro_erro:'Fehler', erro_tente_novo_instantes:'Versuche es gleich noch einmal.', erro_resposta_vazia:'Die Antwort kam leer zurück. Formuliere die Frage um und versuche es erneut.', diag_sem_dados:'Noch nicht genug Daten. Erstelle ein Produkt und erfasse den ersten Verkauf oder die erste Ausgabe, damit ich deine finanzielle Gesundheit bewerten kann.', diag_saldo_negativo:'Dein Kontostand ist negativ: Ausgaben haben die Einnahmen bereits um', diag_entradas_cairam:'Deine Einnahmen sind im Vergleich zum letzten Monat stark gesunken', diag_saidas_altas:'Deine Ausgaben diesen Monat verbrauchen bereits über 70 % der Einnahmen.', diag_produto_abaixo_meta:'hat', diag_bem_abaixo_da_meta:'deutlich unter dem Ziel von', diag_nenhum_alerta:'Momentan keine Warnungen. Positiver Kontostand und nichts Unerwartetes bei deinen Produkten.', diag_sem_dados_ainda:'Noch keine Daten', diag_saude_boa:'Finanzielle Gesundheit: gut', diag_saude_atencao:'Finanzielle Gesundheit: Vorsicht', diag_saude_risco:'Finanzielle Gesundheit: Risiko', diag_comparado_mes_passado:'Im Vergleich zum letzten Monat', erro_arquivo_direto:'Diese Datei ist direkt geöffnet (file://).', erro_arquivo_direto_detalhe:'Firebase-Login funktioniert so nicht — es muss https:// oder localhost sein. Veröffentliche die Datei (z. B. per Netlify Drop) und öffne sie über den Link.', erro_dentro_iframe:'Die App befindet sich in einer anderen App (iframe).', erro_dentro_iframe_detalhe:'Die Google-Anmeldung wird hier meist blockiert. Falls Google fehlschlägt, versuche den veröffentlichten Link direkt im Handy-Browser zu öffnen.', erro_login_indisponivel:'Login-Dienst gerade nicht verfügbar.', erro_email_senha_obrigatorios:'E-Mail und Passwort (mind. 6 Zeichen) sind erforderlich.', erro_email_ja_tem_conta:'Diese E-Mail hat bereits ein Konto — tippe auf „Anmelden".', erro_email_invalido:'Ungültige E-Mail.', erro_senha_fraca:'Schwaches Passwort — verwende mindestens 6 Zeichen.', erro_senha_incorreta:'Falsches Passwort.', erro_conta_nao_encontrada:'Kein Konto mit dieser E-Mail gefunden — tippe auf „Konto erstellen".', erro_credenciais_incorretas:'E-Mail oder Passwort falsch.', erro_muitas_tentativas:'Zu viele Versuche. Warte etwas und versuche es erneut.', erro_sem_conexao_firebase:'Momentan keine Verbindung zum Firebase-Server.', erro_dominio_nao_autorizado:'Diese Domain ist in Firebase nicht autorisiert (Authentication → Settings → Authorized domains).', erro_email_senha_desativado:'Die Anmeldung per E-Mail/Passwort ist in Firebase noch nicht aktiviert (Authentication → Sign-in method).', erro_nao_consegui_completar:'Konnte das nicht abschließen.', erro_popup_bloqueado:'Der Browser hat das Google-Fenster blockiert. Erlaube Pop-ups für diese Seite und versuche es erneut.', erro_popup_cancelado:'Das Google-Fenster wurde abgebrochen. Versuche es erneut.', erro_popup_fechado:'Du hast das Google-Fenster vor Abschluss geschlossen.', erro_dominio_nao_autorizado_google:'Diese Domain ist in Firebase nicht autorisiert (Authentication → Settings → Authorized domains) — füge die Domain hinzu, von der aus du die App öffnest.', erro_google_desativado:'Die Google-Anmeldung ist in Firebase noch nicht aktiviert (Authentication → Sign-in method).', erro_nao_consegui_google:'Anmeldung mit Google fehlgeschlagen.', mic_nao_ouvi:'Ich habe nichts gehört. Sprich näher am Mikrofon.', mic_sem_disponivel:'Kein Mikrofon auf diesem Gerät verfügbar.', mic_conexao_insuficiente:'Verbindung reicht gerade nicht aus, um die Sprache zu erkennen.', mic_nao_funcionou:'Das Mikrofon hat nicht funktioniert. Versuche es erneut oder tippe stattdessen.', mic_sub_iframe:'die App ist innerhalb einer anderen App geöffnet, und dort ist das Mikrofon blockiert', mic_passo_iframe_1:'Tippe auf <strong>In neuem Tab öffnen</strong> oder kopiere die Adresse dieser Seite.', mic_passo_iframe_2:'Füge die Adresse in den <strong>Browser deines Handys</strong> ein (Safari, Chrome).', mic_passo_iframe_3:'Wenn der Browser fragt, wähle <strong>Zulassen</strong> für das Mikrofon.', mic_passo_iframe_4:'In der Zwischenzeit kannst du das <strong>Mikrofon deiner Tastatur</strong> nutzen, um hier zu diktieren.', mic_sub_inseguro:'das Mikrofon funktioniert nur bei einer https-Adresse', mic_passo_inseguro_1:'Öffne den <strong>veröffentlichten Link</strong> der App, nicht die auf dem Gerät gespeicherte Datei.', mic_passo_inseguro_2:'Prüfe, ob die Adresse mit <strong>https://</strong> beginnt.', mic_passo_inseguro_3:'Lade die Seite neu und tippe erneut auf das Mikrofon.', mic_sub_bloqueado:'der Browser hat den Zugriff blockiert — folge den Schritten', mic_passo_ios_1:'Öffne die <strong>Einstellungen</strong> des iPhones.', mic_passo_ios_2:'Scrolle zu <strong>Safari</strong> (oder dem verwendeten Browser) und tippe darauf.', mic_passo_ios_3:'Tippe auf <strong>Mikrofon</strong> und wähle <strong>Zulassen</strong>.', mic_passo_ios_4:'Komm hierher zurück, lade neu und tippe erneut auf das Mikrofon.', mic_passo_outro_1:'Tippe oben auf das Schloss-Symbol oder das "ⓘ" neben der Adresse.', mic_passo_outro_2:'Suche <strong>Mikrofon</strong> in den Website-Berechtigungen.', mic_passo_outro_3:'Ändere es von „Blockieren" zu <strong>Zulassen</strong>.', mic_passo_outro_4:'Lade die Seite neu und tippe erneut auf das Mikrofon.'},
    'zh-CN': { nav_conversa:'对话', nav_negocio:'我的生意', nav_comunidade:'社区', nav_cursos:'我的课程', nav_conta:'我的账户', secao_conversas:'对话记录', btn_nova_conversa:'新对话', input_placeholder:'告诉我你需要什么…' , aviso_anuncio:'描述产品，它会写好可以直接粘贴到 Mercado Livre、Shopee 或 OLX 的广告文案。', aviso_comparador:'最多添加4个产品，它会调查并制作一个包含价格、优缺点的表格。', aviso_lembretes:'补货、续订工具订阅，任何有日期不想忘记的事情。', aviso_parcelar:'比较全款价格和分期价格，显示你实际支付了多少利息。', aviso_precificador:'告诉它你付了多少钱以及想要的利润，它会计算已经考虑平台手续费的售价。', aviso_produtos_olho:'这不会一直自动检查价格——当你点击"立即检查"时，我会真正查询当前价格并与你想支付的金额进行比较。', aviso_relatorio:'准备好的文字摘要，可下载发给会计或留存记录。', aviso_simulador:'在开始之前预估一个产品能赚多少：需要投入多少，每月能赚多少，多久能回本。', btn_abrir_precificador:'打开定价器', btn_abrir_simulador:'打开模拟器', btn_add_estoque:'加入库存', btn_add_produto_olho:'添加产品', btn_adicionar:'添加', btn_baixar_relatorio:'下载为文本文件', btn_calcular:'计算', btn_calcular_preco:'计算售价', btn_comecar_desafio:'开始这个挑战', btn_comparar:'比较', btn_comparar_agora:'立即比较', btn_confirmar_venda:'确认销售', btn_criar_anuncio:'创建广告', btn_criar_lembrete:'创建提醒', btn_criar_meta:'创建目标', btn_criar_produto:'创建产品', btn_gerar_anuncio:'生成广告', btn_gerar_relatorio:'生成报告', btn_guardar:'保存', btn_nova_meta:'新目标', btn_novo_item:'新项目', btn_novo_lembrete:'新提醒', btn_novo_produto:'新产品', btn_perguntar:'提问', btn_publicar_curso:'发布课程', btn_registrar_movimentacao:'记录交易', btn_salvar_produto:'保存产品', btn_tentar_mic:'我已开启，重新尝试', btn_ver_desafio:'查看挑战', desc_comunidade:'这里都是真人创建的课程。教授你懂的，学习你还不懂的。', desc_cursos:'你在社区获得的课程会保存在这里。', desc_negocio:'你的产品、销售和余额——都保存在这台设备上。', h3_comparador:'产品对比器', h3_desafio:'储蓄挑战', h3_estoque:'转卖库存', h3_gerador_anuncio:'广告生成器', h3_lembretes:'提醒事项', h3_lembretes_novo:'新提醒', h3_metas:'储蓄目标', h3_meus_produtos:'我的产品', h3_movimentacoes:'实际交易记录', h3_parcelar:'分期付款划算吗？', h3_precificador:'自动定价器', h3_produtos_olho:'关注中的产品（价格）', h3_radar:'固定支出雷达', h3_relatorio:'生意报告', h3_simulador:'利润模拟器', h3_tutor:'生意导师', h3_vendas:'过去6个月的销售额', lbl_ate_quando:'截止日期', lbl_categoria:'分类', lbl_contato_duvida:'咨询联系方式（WhatsApp、Instagram等）', lbl_data:'日期', lbl_detalhes_extras:'额外详情（可选）', lbl_do_que_se_trata:'这是关于什么的', lbl_do_que_se_trata_2:'内容说明', lbl_escolha_desafio:'选择挑战', lbl_estado_produto:'成色', lbl_formato:'格式', lbl_horario_aulas:'上课时间（如有）', lbl_horas_semana:'每周小时数', lbl_investimento_inicial:'初始投资 (R$)', lbl_link_grupo:'群组链接（可选）', lbl_link_opcional:'链接（可选）', lbl_lucro_mes:'每月净利润 (R$)', lbl_lucro_percentual:'你想要的利润百分比（相对于成本）', lbl_meta_vendas:'每月销售目标', lbl_nome_item:'物品名称', lbl_nome_meta:'目标名称', lbl_nome_produto:'产品名称', lbl_nome_produto_2:'产品名称', lbl_nome_produto_alerta:'产品名称', lbl_numero_parcelas:'分期数', lbl_onde_vai_vender:'在哪里销售', lbl_para_quem_e:'适合谁', lbl_pergunta_tutor:'向导师提问', lbl_preco_avista:'全款价格 (R$)', lbl_preco_reais:'价格 (R$)', lbl_preco_reais_2:'价格 (R$)', lbl_produto_1:'产品1', lbl_produto_2:'产品2', lbl_produto_3:'产品3（可选）', lbl_produto_4:'产品4（可选）', lbl_quantidade_vendida:'销售数量', lbl_quanto_guardou:'你刚存了多少 (R$)', lbl_quanto_pagou:'你付了多少 (R$)', lbl_quanto_pagou_produto:'你为这个产品付了多少 (R$)', lbl_quanto_quer_pagar:'你想付多少 (R$)', lbl_tipo:'类型', lbl_tipo_lembrete:'类型', lbl_valor_juntar:'想存的金额 (R$)', lbl_valor_parcela:'每期金额 (R$)', lbl_valor_reais:'金额 (R$)', lbl_valor_unidade:'每件收到的金额 (R$)', opc_galeria_pdf:'相册或PDF', opc_tirar_foto:'拍照', opt_comunidade_paga:'付费社区', opt_curso_video:'视频课程', opt_desafio_1:'从1元到100元递增（100天，共存5050元）', opt_desafio_2:'从2元到200元递增（100天，共存10100元）', opt_desafio_5:'每周固定5元（52周，共存260元）', opt_direto:'直接销售（OLX、Enjoei、Instagram、WhatsApp）——无手续费', opt_ebook:'电子书', opt_entrada:'收入', opt_mentoria:'指导咨询', opt_ml_classico:'Mercado Livre — 经典版', opt_ml_premium:'Mercado Livre — 高级版', opt_novo_caixa:'全新，未拆封', opt_outro:'其他', opt_planilha:'表格或模板', opt_renovar_assinatura:'续订订阅/工具', opt_repor_estoque:'补货', opt_saida:'支出', opt_seminovo:'几乎全新', opt_shopee:'Shopee', opt_usado_bom:'二手，状态良好', opt_usado_marcas:'二手，有使用痕迹', placeholder_pergunta_tutor:'我这个行业的利润好吗？我该如何降低支出？', sub_anexar:'发送产品照片或PDF文件', sub_anuncio:'准备好直接粘贴到广告中的文字', sub_aparencia:'选择应用的外观显示方式', sub_comparador:'2到4个产品——它会调查并制作表格', sub_desafio:'每天存入相应金额后打勾', sub_etapas:'完成后打勾', sub_idioma:'这会调整麦克风的语音识别', sub_nova_meta:'它会计算每月需要存多少才能达成目标', sub_parcelar:'比较全款和分期价格', sub_precificador:'已内置2026年真实费率计算', sub_produto:'一个产品 = 你要销售的课程、电子书或指导服务', sub_produto_olho:'当你想知道当前价格时，点击"立即检查"', sub_relatorio:'可供下载', sub_simulador:'基于你自己的数据做12个月预测', tit_anexar:'附加文件', tit_aparencia:'外观', tit_guardar_meta:'向目标中存钱', tit_idioma:'选择你的语言', tit_mic:'开启麦克风', tit_nova_meta:'新储蓄目标', tit_produto_olho:'关注中的产品', tit_registrar_venda:'记录销售', aba_entrar:'登录', aba_criar_conta:'创建账户', lbl_email:'电子邮箱', placeholder_email:'you@email.com', lbl_senha:'密码', placeholder_senha:'至少6个字符', btn_entrar:'登录', btn_criar_conta_2:'创建账户', txt_ou:'或', txt_continuar_google:'使用Google继续', aviso_login_indisponivel:'目前无法加载登录服务（无网络连接，或被浏览器阻止）。请检查网络连接并重试。', logado_como:'已登录为', lbl_como_chamado:'我们该如何称呼你', placeholder_nome_exemplo:'Ana Ribeiro', lbl_uma_linha_sobre_voce:'一句话介绍你自己', placeholder_bio_exemplo:'我从事木工行业12年了', btn_salvar:'保存', btn_sair_conta:'退出此账户', toast_salvo:'已保存。', confirm_sair_conta:'退出此账户？', toast_saiu:'你已退出。', card_faturamento:'营业额', nota_faturamento:'所有收入', card_vendas:'销售量', nota_vendas:'已售出单位', card_ticket:'平均客单价', nota_ticket:'每笔销售', card_saldo:'余额', nota_saldo:'收入减去支出', card_produtos:'产品', nota_produtos:'在社区中', card_saidas:'支出', nota_saidas:'已记录的成本', vazio_grafico:'暂无收入记录。在下方记录第一笔销售后，图表就会显示。', vazio_produtos:'暂无产品。<br>创建第一个产品，我会为你分步制定发布计划。', txt_vendas_min:'销售', txt_meta_min:'目标', txt_mes_min:'月', txt_etapas_min:'步骤', etq_na_comunidade:'在社区中', etq_rascunho:'草稿', btn_plano:'计划', btn_mais_venda:'+ 销售', btn_publicado:'已发布', btn_publicar:'发布', btn_excluir:'删除', vazio_lancamentos:'尚无记录。', tbl_descricao:'描述', tbl_valor:'金额', vazio_metas:'还没有目标。创建一个，我来帮你计算每月需要储蓄多少。', txt_de:'共', txt_ate:'截止', txt_guarde:'储蓄', txt_pra_chegar_la:'以达成目标', txt_meta_batida:'目标达成！🎉', btn_mais_guardar:'+ 存入', toast_preencha_meta:'请填写目标名称和金额。', toast_meta_criada:'目标已创建。', toast_informe_valor:'请输入金额。', toast_guardado_total:'已保存！目标总额：', vazio_radar:'尚未检测到经常性支出——需要同一笔支出在至少2个不同月份出现。', txt_total_recorrente:'检测到的经常性总额：', etp_comprado:'已购买', etp_anunciado:'已上架', etp_vendido:'已售出', vazio_estoque:'暂无物品。添加你买来转卖的东西。', txt_pago:'已付：', btn_avancar:'推进', toast_de_nome_item:'给物品起个名字。', toast_nome_produto:'请输入产品名称。', aviso_preencha_tres:'请填写全部三个字段。', vered_parcelar_bom:'分期付款和全款一样甚至更便宜——通常值得，只要你能按时付清每一期。', vered_juro_baixo:'内含利息较低。如果你现在没有全款，分期是合理的。', vered_juro_alto:'内含利息较高。如果你有全款，几乎总是全款支付（或协商折扣）比分期更划算。', txt_total_parcelado:'分期总额', txt_diferenca_avista:'与全款的差额', txt_juro_embutido:'内含利息', toast_min_2_produtos:'请至少添加2个产品进行比较。', vazio_desafio:'没有进行中的挑战。点击"查看挑战"开始一个。', txt_dias:'天', txt_guardado_ate_agora:'目前已存', txt_progresso:'进度', txt_guardado:'已存', btn_reiniciar_desafio:'重新开始挑战', confirm_reiniciar_desafio:'从头重新开始挑战？', vazio_alertas:'列表中还没有产品。', txt_quer_pagar_ate:'想支付不超过', txt_ultima_checagem:'上次检查：', btn_verificar_agora:'立即检查', txt_verificando:'检查中...', toast_preencha_alerta:'请填写产品名称和你想支付的价格。', txt_renovar_assinatura:'续订订阅', vazio_lembretes:'暂无提醒。', txt_em:'还有', txt_atrasado_ha:'已逾期', txt_e_hoje:'就是今天', txt_chegando:'即将到期', toast_preencha_lembrete:'请填写名称和日期。', toast_nome_antes_publicar:'发布前请先设置你的名字。', toast_descricao_antes_publicar:'发布前请写明"适合谁"。点击产品进行编辑。', toast_primeiro_curso:'🌱 第一门课程已发布！', toast_publicado_comunidade:'已发布到社区。', toast_publicado_so_aparelho:'仅在本设备上发布。', toast_crie_produto_primeiro:'请先创建产品，然后再发布。', toast_escolha_produto:'选择产品并点击"发布"。', aviso_com_publico:'你在这里发布的一切都会对使用本应用的其他人可见。', aviso_com_local:'此设备仅在本地保存课程，因此你只能看到自己的。请通过已发布的链接打开，以查看所有人的课程。', txt_todos:'全部', vazio_cursos_categoria:'该分类下暂无课程。<br>成为第一个发布的人——前往"我的生意"，创建产品并点击发布。', txt_primeiro_curso:'第一门课程', txt_por:'作者：', txt_gratuito:'免费', txt_alunos:'名学员', btn_seu_curso:'你的课程', btn_abrir_curso:'打开课程', btn_ver_curso:'查看课程', vazio_perguntas:'暂无问题。成为第一个提问的人。', titulo_perguntas:'问题', placeholder_pergunta_curso:'写下你对这门课程的疑问', btn_enviar_pergunta:'发送问题', aviso_nome_para_perguntar:'请在个人资料中设置你的名字才能提问。', titulo_avaliacoes:'评价', vazio_avaliacoes:'暂无评价。', placeholder_comentario:'评论（可选）', aviso_toque_nota:'点击上方的评分。', txt_sem_descricao:'无描述。', txt_alunos_cap:'学员', txt_horario:'时间安排', txt_falar_whatsapp:'联系创建者（WhatsApp）', txt_contato:'联系方式', txt_entrar_grupo:'加入课程群组', aviso_curso_e_seu:'这是你的课程。销售记录在"我的生意"中登记。', aviso_ja_matriculado:'你已经注册了。该课程会出现在"我的课程"中。', btn_quero_curso:'我想要这门课程', btn_entrar_curso:'加入课程', aviso_pagamento_combinado:'付款方式需直接与课程创建者协商。转账前请核实对方身份。', toast_esta_em_meus_cursos:'完成——已加入"我的课程"。', txt_nota_escolhida:'已选评分：', txt_toque_enviar:'点击下方"发送"。', btn_enviar_avaliacao:'发送评价', toast_avaliacao_enviada:'评价已发送。谢谢！', toast_pergunta_enviada:'问题已发送。', vazio_matriculas:'你还没有参加任何课程。<br>去社区看看吧。', btn_sair:'退出' , vazio_lista_conversas:'还没有对话。', confirm_excluir_conversa:'删除这个对话？', confirm_apagar_conversa:'清空整个对话？', et_tema_texto:'确定主题和目标人群', et_tema_dica:'一句话："我教X给想要Y的人"。', et_roteiro_texto:'制定课程大纲', et_roteiro_dica:'录制前先列出各个模块。', et_gravar_texto:'录制内容', et_gravar_dica:'手机加三脚架、良好的光线就足够开始了。', et_preco_texto:'确定价格', et_preco_dica:'使用利润模拟器检查价格是否合理。', et_pagina_texto:'撰写销售页面', et_pagina_dica:'承诺、适合谁、包含什么、价格和保证。', et_publicar_com_texto:'发布到社区', et_publicar_com_dica:'这里的所有人都能看到，无手续费。', et_publicar_fora_texto:'发布到外部平台', et_publicar_fora_dica:'Kiwify、Hotmart或Eduzz负责支付和托管。', et_divulgar_texto:'在前7天进行推广', et_divulgar_dica:'通知你的名单、在社交媒体发布、请求推荐。', tit_editar_produto:'编辑产品', toast_de_nome_produto:'为产品命名后再保存。', toast_produto_salvo:'产品已保存。', confirm_excluir_produto:'删除', toast_informe_valor_recebido:'请输入收到的金额。', txt_venda_de:'销售', toast_venda_registrada:'销售已记录。', toast_valor_maior_zero:'请输入大于零的金额。', aviso_preencha_lucro:'请至少填写月利润以便我进行模拟。', txt_mes_min_cap:'月', txt_se_paga_em:'回本时间：', txt_menos_1_mes:'不到1个月', txt_meses:'个月', txt_sem_investimento:'无投资', txt_por_hora_dedicada:'每小时收益', txt_lucro_12_meses:'12个月利润', txt_saldo_fim_ano:'年末余额', txt_saldo_mes_a_mes:'逐月余额', txt_venda_direta_sem_taxa:'直接销售（无手续费）', aviso_preencha_pagou:'请填写你为产品支付的金额。', txt_preco_sugerido:'建议售价', txt_taxa_da:'手续费来自', txt_fixo:'固定', txt_lucro_liquido_real:'你的实际净利润', aviso_taxas_referencia:'2026年参考费率——平台可能根据产品具体类别收取略有不同的费用。发布广告前请在卖家后台确认。', rel_titulo:'生意报告', rel_gerado_em:'生成于', rel_resumo_geral:'总体概览', rel_faturamento_total:'总营业额：', rel_saidas_totais:'总支出：', rel_saldo:'余额：', rel_vendas_totais:'总销售量：', rel_ticket_medio:'平均客单价：', rel_ultimos_6_meses:'最近6个月', rel_entrou:'收入', rel_saiu:'支出', rel_nenhum_produto:'没有已登记的产品。', rel_ultimas_movimentacoes:'最近交易记录', rel_nenhuma_movimentacao:'没有已记录的交易。', sug_investimento_sobra:'关于闲置资金的投资建议', sug_economizar_mais:'这个月我该如何多存点钱？', sug_negocio_saudavel:'我的生意健康吗？', sug_aumentar_ticket:'如何提高我的平均客单价？', sug_baixar_preco:'降低价格值得吗？', sug_priorizar_produto:'现在应该优先关注哪个产品？', erro_bloqueado_file:'浏览器阻止了此请求——当应用直接从下载的文件（file://）打开，而不是通过已发布的链接（https://）打开时，通常会出现这种情况。请将此网站托管在Netlify等平台上并从那里打开。', erro_sem_servidor:'无法连接到服务器。请检查网络连接后重试。', erro_404_funcao:'找不到服务器函数（/.netlify/functions/chat）。如果你是在已发布的Netlify站点之外进行测试，这是正常的——它只能在真正发布的站点上运行。', erro_429_muitas_msgs:'短时间内发送的消息过多。请等待几秒后重新发送。', erro_recusado:'服务器拒绝了请求', erro_erro:'错误', erro_tente_novo_instantes:'请稍后重试。', erro_resposta_vazia:'返回的回复为空。请重新表述问题后再试一次。', diag_sem_dados:'数据还不够。创建一个产品并记录第一笔销售或支出，以便我评估你的财务状况。', diag_saldo_negativo:'你的余额为负：支出已超过收入', diag_entradas_cairam:'与上个月相比，你的收入大幅下降', diag_saidas_altas:'本月支出已经占收入的70%以上。', diag_produto_abaixo_meta:'的销售量为', diag_bem_abaixo_da_meta:'远低于目标', diag_nenhum_alerta:'目前没有警报。余额为正，产品情况一切正常。', diag_sem_dados_ainda:'暂无数据', diag_saude_boa:'财务状况：良好', diag_saude_atencao:'财务状况：需注意', diag_saude_risco:'财务状况：风险', diag_comparado_mes_passado:'与上个月相比', erro_arquivo_direto:'此文件是直接打开的（file://）。', erro_arquivo_direto_detalhe:'Firebase登录不能这样使用——需要是https://或localhost。请发布该文件（例如通过Netlify Drop）并通过链接打开。', erro_dentro_iframe:'该应用位于另一个应用内部（iframe）。', erro_dentro_iframe_detalhe:'Google登录在这种环境下通常会被阻止。如果Google登录失败，请尝试直接在手机浏览器中打开已发布的链接。', erro_login_indisponivel:'登录服务目前不可用。', erro_email_senha_obrigatorios:'邮箱和密码（至少6个字符）为必填项。', erro_email_ja_tem_conta:'该邮箱已有账户——请点击"登录"。', erro_email_invalido:'邮箱无效。', erro_senha_fraca:'密码强度不足——请至少使用6个字符。', erro_senha_incorreta:'密码错误。', erro_conta_nao_encontrada:'未找到该邮箱对应的账户——请点击"创建账户"。', erro_credenciais_incorretas:'邮箱或密码错误。', erro_muitas_tentativas:'尝试次数过多。请稍等片刻后重试。', erro_sem_conexao_firebase:'当前无法连接到Firebase服务器。', erro_dominio_nao_autorizado:'此域名未在Firebase中获得授权（Authentication → Settings → Authorized domains）。', erro_email_senha_desativado:'Firebase中尚未启用邮箱/密码登录（Authentication → Sign-in method）。', erro_nao_consegui_completar:'无法完成操作。', erro_popup_bloqueado:'浏览器阻止了Google弹出窗口。请允许此网站的弹出窗口后重试。', erro_popup_cancelado:'Google窗口已取消。请重试。', erro_popup_fechado:'你在完成前关闭了Google窗口。', erro_dominio_nao_autorizado_google:'此域名未在Firebase中获得授权（Authentication → Settings → Authorized domains）——请添加你用来打开此应用的域名。', erro_google_desativado:'Firebase中尚未启用Google登录（Authentication → Sign-in method）。', erro_nao_consegui_google:'无法使用Google登录。', mic_nao_ouvi:'没有听到任何声音。请靠近麦克风说话。', mic_sem_disponivel:'此设备上没有可用的麦克风。', mic_conexao_insuficiente:'当前网络连接不足以识别语音。', mic_nao_funcionou:'麦克风未能正常工作。请重试或改为输入文字。', mic_sub_iframe:'该应用是在另一个应用内打开的，在那种情况下麦克风会被阻止', mic_passo_iframe_1:'点击<strong>在新标签页中打开</strong>按钮，或复制此页面的地址。', mic_passo_iframe_2:'将地址粘贴到<strong>手机浏览器</strong>中（Safari、Chrome）。', mic_passo_iframe_3:'浏览器询问时，选择<strong>允许</strong>使用麦克风。', mic_passo_iframe_4:'与此同时，你可以使用<strong>键盘自带的麦克风</strong>在这里进行语音输入。', mic_sub_inseguro:'麦克风只能在https地址下使用', mic_passo_inseguro_1:'打开应用<strong>已发布的链接</strong>，而不是保存在设备上的文件。', mic_passo_inseguro_2:'确认地址以<strong>https://</strong>开头。', mic_passo_inseguro_3:'重新加载页面并再次点击麦克风。', mic_sub_bloqueado:'浏览器阻止了访问——请按以下步骤操作', mic_passo_ios_1:'打开iPhone的<strong>设置</strong>。', mic_passo_ios_2:'向下滚动找到<strong>Safari</strong>（或你使用的浏览器）并点击。', mic_passo_ios_3:'点击<strong>麦克风</strong>并选择<strong>允许</strong>。', mic_passo_ios_4:'返回这里，重新加载页面并再次点击麦克风。', mic_passo_outro_1:'点击地址栏旁边的锁形图标或"ⓘ"图标。', mic_passo_outro_2:'在网站权限中查找<strong>麦克风</strong>。', mic_passo_outro_3:'将设置从"阻止"改为<strong>允许</strong>。', mic_passo_outro_4:'重新加载页面并再次点击麦克风。'}
  };

  const ABERTURAS_IDIOMA = {
    'pt-BR': null,
    'pt-PT': [
      { t:'Como está o teu dia?', s:'O que queres comprar, poupar ou vender hoje? Eu pesquiso antes de responder.' , desc_negocio:'你的产品、销售和余额——都保存在这台设备上。', btn_criar_produto:'创建产品', h3_tutor:'生意导师', lbl_pergunta_tutor:'向导师提问', placeholder_pergunta_tutor:'我这个行业的利润好吗？我该如何降低支出？', btn_perguntar:'提问', h3_vendas:'过去6个月的销售额', h3_meus_produtos:'我的产品', btn_novo_produto:'新产品', h3_simulador:'利润模拟器', btn_abrir_simulador:'打开模拟器', aviso_simulador:'在开始之前预估一个产品能赚多少：需要投入多少，每月能赚多少，多久能回本。', h3_precificador:'自动定价器', btn_abrir_precificador:'打开定价器', aviso_precificador:'告诉它你付了多少钱以及想要的利润，它会计算已经考虑平台手续费的售价。', h3_metas:'储蓄目标', btn_nova_meta:'新目标', h3_radar:'固定支出雷达', h3_estoque:'转卖库存', btn_novo_item:'新项目', h3_gerador_anuncio:'广告生成器', btn_criar_anuncio:'创建广告', aviso_anuncio:'描述产品，它会写好可以直接粘贴使用的广告文案。', h3_parcelar:'分期付款划算吗？', btn_comparar:'比较', aviso_parcelar:'比较全款价格和分期价格，显示你实际支付了多少利息。', h3_comparador:'产品对比器', aviso_comparador:'最多添加4个产品，它会调查并制作一个包含价格、优缺点的表格。', h3_desafio:'储蓄挑战', btn_ver_desafio:'查看挑战', h3_relatorio:'生意报告', btn_gerar_relatorio:'生成报告', aviso_relatorio:'准备好的文字摘要，可下载发给会计或留存记录。', h3_produtos_olho:'关注中的产品（价格）', btn_add_produto_olho:'添加产品', aviso_produtos_olho:'这不会一直自动检查价格——当你点击"立即检查"时，我会真正查询当前价格并与你想支付的金额进行比较。', h3_lembretes:'提醒事项', btn_novo_lembrete:'新提醒', aviso_lembretes:'补货、续订工具订阅，任何有日期不想忘记的事情。', h3_movimentacoes:'实际交易记录', lbl_tipo:'类型', opt_entrada:'收入', opt_saida:'支出', lbl_valor_reais:'金额 (R$)', lbl_do_que_se_trata:'这是关于什么的', btn_registrar_movimentacao:'记录交易', btn_publicar_curso:'发布课程', desc_comunidade:'这里都是真人创建的课程。教授你懂的，学习你还不懂的。', desc_cursos:'你在社区获得的课程会保存在这里。', tit_anexar:'添加附件', sub_anexar:'发送产品照片或PDF文件', opc_tirar_foto:'拍照', opc_galeria_pdf:'相册或PDF', tit_idioma:'选择你的语言', sub_idioma:'这会调整麦克风的语音识别', tit_aparencia:'外观', sub_aparencia:'选择应用对你显示的样子', tit_mic:'开启麦克风权限', btn_tentar_mic:'已开启，重试', sub_simulador:'用你自己的数字做12个月的预测', lbl_investimento_inicial:'初始投资 (R$)', lbl_lucro_mes:'每月净利润 (R$)', lbl_horas_semana:'每周工作小时数', btn_calcular:'计算', sub_precificador:'计算中已包含2026年真实费率', lbl_quanto_pagou_produto:'你为产品支付了多少 (R$)', lbl_lucro_percentual:'你想要的利润百分比 (%)', lbl_onde_vai_vender:'你要在哪里销售', opt_ml_classico:'Mercado Livre — 经典版', opt_ml_premium:'Mercado Livre — 高级版', opt_shopee:'Shopee', opt_direto:'直接销售（OLX、Enjoei、Instagram、WhatsApp）— 无手续费', btn_calcular_preco:'计算销售价格', tit_nova_meta:'新储蓄目标', sub_nova_meta:'它会计算每月需要储蓄多少才能达成目标', lbl_nome_meta:'目标名称', lbl_valor_juntar:'你想储蓄的金额 (R$)', lbl_ate_quando:'截止日期', btn_criar_meta:'创建目标', tit_guardar_meta:'向目标存入金额', lbl_quanto_guardou:'你刚存了多少 (R$)', btn_guardar:'保存', lbl_nome_item:'物品名称', lbl_quanto_pagou:'你付了多少 (R$)', btn_add_estoque:'加入库存', sub_anuncio:'文案已准备好，可直接粘贴使用', lbl_nome_produto:'产品名称', lbl_estado_produto:'成色', opt_novo_caixa:'全新，原盒未拆', opt_seminovo:'几乎全新', opt_usado_bom:'二手，状况良好', opt_usado_marcas:'二手，有使用痕迹', lbl_preco_reais:'价格 (R$)', lbl_detalhes_extras:'额外细节（可选）', btn_gerar_anuncio:'生成广告', sub_parcelar:'比较全款和分期付款', lbl_preco_avista:'全款价格 (R$)', lbl_numero_parcelas:'分期期数', lbl_valor_parcela:'每期金额 (R$)', sub_comparador:'2到4个产品——它会调查并制作表格', lbl_produto_1:'产品1', lbl_produto_2:'产品2', lbl_produto_3:'产品3（可选）', lbl_produto_4:'产品4（可选）', btn_comparar_agora:'立即比较', sub_desafio:'每存一天的金额就点一下', lbl_escolha_desafio:'选择挑战', opt_desafio_1:'从R$1递增到R$100（100天，共存R$5,050）', opt_desafio_2:'从R$2递增到R$200（100天，共存R$10,100）', opt_desafio_5:'每周固定R$5（52周，共存R$260）', btn_comecar_desafio:'开始这个挑战', sub_relatorio:'已准备好下载', btn_baixar_relatorio:'下载为文本文件', tit_produto_olho:'关注中的产品', sub_produto_olho:'当你想知道当前价格时，自己点击"立即检查"', lbl_nome_produto_alerta:'产品名称', lbl_link_opcional:'链接（可选）', lbl_quanto_quer_pagar:'你想支付多少 (R$)', btn_adicionar:'添加', h3_lembretes_novo:'新提醒', lbl_do_que_se_trata_2:'这是关于什么的', lbl_tipo_lembrete:'类型', opt_repor_estoque:'补货', opt_renovar_assinatura:'续订订阅/工具', opt_outro:'其他', lbl_data:'日期', btn_criar_lembrete:'创建提醒', sub_produto:'一个产品 = 一门你要销售的课程、电子书或指导服务', lbl_nome_produto_2:'产品名称', lbl_formato:'格式', opt_curso_video:'视频课程', opt_ebook:'电子书', opt_mentoria:'一对一指导', opt_planilha:'表格或模板', opt_comunidade_paga:'付费社区', lbl_preco_reais_2:'价格 (R$)', lbl_categoria:'分类', lbl_para_quem_e:'适合谁', lbl_horario_aulas:'上课时间（如有）', lbl_contato_duvida:'咨询联系方式（WhatsApp、Instagram等）', lbl_link_grupo:'群组链接（可选）', lbl_meta_vendas:'每月销售目标', btn_salvar_produto:'保存产品', sub_etapas:'完成后打勾', tit_registrar_venda:'记录销售', lbl_quantidade_vendida:'售出数量', lbl_valor_unidade:'每件收到的金额 (R$)', btn_confirmar_venda:'确认销售', card_faturamento:'营业额', nota_faturamento:'所有收入', card_vendas:'销售量', nota_vendas:'已售出单位', card_ticket:'平均客单价', nota_ticket:'每笔销售', card_saldo:'余额', nota_saldo:'收入减去支出', card_produtos:'产品', nota_produtos:'在社区中', card_saidas:'支出', nota_saidas:'已记录的成本', vazio_grafico:'暂无收入记录。在下方记录第一笔销售后，图表就会显示。', vazio_produtos:'暂无产品。<br>创建第一个产品，我会为你分步制定发布计划。', txt_vendas_min:'销售', txt_meta_min:'目标', txt_mes_min:'月', txt_etapas_min:'步骤', etq_na_comunidade:'在社区中', etq_rascunho:'草稿', btn_plano:'计划', btn_mais_venda:'+ 销售', btn_publicado:'已发布', btn_publicar:'发布', btn_excluir:'删除', vazio_lancamentos:'尚无记录。', tbl_descricao:'描述', tbl_valor:'金额'},
      { t:'Por onde começamos?', s:'Diz-me o que tens em mente — uma compra, uma dívida, uma ideia de rendimento extra.' },
      { t:'Tens algo em vista?', s:'Se for compra, comparo o preço. Se for venda, monto o plano com números.' }
    ],
    'en-US': [
      { t:'How\u2019s your day going?', s:'What do you want to buy, save, or sell today? I\u2019ll research before answering.' },
      { t:'Where should we start?', s:'Tell me what\u2019s on your mind — a purchase, a debt, an extra income idea.' },
      { t:'Got something in mind?', s:'If it\u2019s buying, I compare prices. If it\u2019s selling, I build the plan with numbers.' }
    ],
    'es-ES': [
      { t:'¿Cómo va tu día?', s:'¿Qué quieres comprar, ahorrar o vender hoy? Investigo antes de responder.' },
      { t:'¿Por dónde empezamos?', s:'Cuéntame qué tienes en mente: una compra, una deuda, una idea de ingreso extra.' },
      { t:'¿Tienes algo en mente?', s:'Si es compra, comparo precios. Si es venta, armo el plan con números.' }
    ],
    'fr-FR': [
      { t:'Comment se passe ta journée ?', s:'Que veux-tu acheter, économiser ou vendre aujourd\u2019hui ? Je fais des recherches avant de répondre.' },
      { t:'Par où commence-t-on ?', s:'Dis-moi ce que tu as en tête — un achat, une dette, une idée de revenu supplémentaire.' },
      { t:'Une idée en tête ?', s:'Si c\u2019est un achat, je compare les prix. Si c\u2019est une vente, je construis le plan avec des chiffres.' }
    ],
    'it-IT': [
      { t:'Come va la tua giornata?', s:'Cosa vuoi comprare, risparmiare o vendere oggi? Faccio ricerche prima di rispondere.' },
      { t:'Da dove iniziamo?', s:'Dimmi cosa hai in mente — un acquisto, un debito, un\u2019idea di reddito extra.' },
      { t:'Hai qualcosa in mente?', s:'Se è un acquisto, confronto i prezzi. Se è una vendita, costruisco il piano con i numeri.' }
    ],
    'de-DE': [
      { t:'Wie läuft dein Tag?', s:'Was möchtest du heute kaufen, sparen oder verkaufen? Ich recherchiere, bevor ich antworte.' },
      { t:'Wo fangen wir an?', s:'Sag mir, was dich beschäftigt — ein Kauf, eine Schuld, eine Idee für Zusatzeinkommen.' },
      { t:'Hast du etwas im Sinn?', s:'Beim Kauf vergleiche ich Preise. Beim Verkauf erstelle ich den Plan mit Zahlen.' }
    ],
    'zh-CN': [
      { t:'今天过得怎么样？', s:'你今天想买什么、省什么或卖什么？我会先做调查再回答。' },
      { t:'我们从哪里开始？', s:'告诉我你在想什么——购物、债务，或是额外收入的点子。' },
      { t:'心里有想法吗？', s:'如果是购买，我会比较价格。如果是出售，我会用数字帮你制定计划。' }
    ]
  };

  function aplicarIdioma(codigo){
    const dic = TRADUCOES[codigo] || TRADUCOES['pt-BR'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const chave = el.dataset.i18n;
      if(!dic[chave]) return;
      const temFilhoElemento = Array.from(el.childNodes).some(n => n.nodeType === 1);
      if(!temFilhoElemento){
        el.textContent = dic[chave];
      } else {
        // elemento tem filhos (ex.: input dentro do <label>) — só troca o primeiro nó de texto, preserva o resto
        let noTexto = Array.from(el.childNodes).find(n => n.nodeType === 3);
        if(noTexto){ noTexto.data = dic[chave]; }
        else { el.insertBefore(document.createTextNode(dic[chave]), el.firstChild); }
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const chave = el.dataset.i18nPlaceholder;
      if(dic[chave]) el.placeholder = dic[chave];
    });
  }

  const CATEGORIAS = ['Negócios e vendas','Tecnologia e IA','Design e criação','Trabalho manual','Saúde e bem-estar','Finanças','Idiomas','Outros'];
  const CORES_CAPA = ['linear-gradient(135deg,#FFBE00,#FF9F5A)','linear-gradient(135deg,#7CFFC4,#3FBFA0)','linear-gradient(135deg,#FFC94D,#FF6B6B)','linear-gradient(135deg,#8FD3FF,#7CFFC4)','linear-gradient(135deg,#FF9F5A,#FFE066)'];
  function corCapa(id){ let h=0; for(let i=0;i<id.length;i++) h = (h*31 + id.charCodeAt(i)) >>> 0; return CORES_CAPA[h % CORES_CAPA.length]; }

  let mensagens = [];
  let conversas = [];
  let conversaAtualId = null;
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
  let filtroAtual = '__todos__';
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


  function sugestoesTutor(){
    return [
      t('sug_investimento_sobra'), t('sug_economizar_mais'), t('sug_negocio_saudavel'),
      t('sug_aumentar_ticket'), t('sug_baixar_preco'), t('sug_priorizar_produto')
    ];
  }
  function renderizarSugestoesTutor(){
    $('sugestoes-tutor').innerHTML = sugestoesTutor().map(s=>'<button class="sugestao">'+esc(s)+'</button>').join('');
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

  function escolherAbertura(){
    const lista = ABERTURAS_IDIOMA[idiomaAtual] || ABERTURAS;
    return lista[Math.floor(Math.random()*lista.length)];
  }
  let aberturaEscolhida = escolherAbertura();

  function renderizarChat(base, parcial){
    const lista = base || mensagens;
    const c = $('mensagens');
    if(!lista.length && !carregando && parcial === undefined){
      c.innerHTML = '<div class="vazio-chat"><div class="vazio-titulo">'+esc(aberturaEscolhida.t)+'</div><div class="vazio-subtitulo">'+esc(aberturaEscolhida.s)+'</div></div>';
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
        throw new Error(t('erro_bloqueado_file'));
      }
      throw new Error(t('erro_sem_servidor'));
    }
    if(!resposta.ok){
      let detalhe = '';
      try{ const err = await resposta.json(); detalhe = err.error || ''; }catch(e){}
      if(resposta.status === 404) throw new Error(t('erro_404_funcao'));
      if(resposta.status === 429) throw new Error(t('erro_429_muitas_msgs'));
      if(resposta.status === 401 || resposta.status === 403) throw new Error(t('erro_recusado') + ' (' + t('erro_erro') + ' ' + resposta.status + (detalhe?': '+detalhe:'') + ').');
      throw new Error(t('erro_erro') + ' ' + resposta.status + (detalhe ? ': ' + detalhe : '') + '. ' + t('erro_tente_novo_instantes'));
    }
    const dados = await resposta.json();
    const texto = (dados.text || '').trim();
    if(!texto) throw new Error(t('erro_resposta_vazia'));
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

  function tituloDeMensagens(lista){
    const primeira = lista.find(m => m.role === 'user' && m.texto);
    if(!primeira) return t('btn_nova_conversa');
    const t = primeira.texto.trim();
    return t.length > 42 ? t.slice(0, 42).trim() + '…' : t;
  }

  function salvarChat(){
    const leve = mensagens.map(m => m.anexo ? { role:m.role, texto:m.texto, anexo:{ tipo:m.anexo.tipo, nomeArquivo:m.anexo.nomeArquivo } } : m);
    if(!conversaAtualId) conversaAtualId = 'c' + Date.now() + Math.random().toString(36).slice(2,7);
    let conv = conversas.find(c => c.id === conversaAtualId);
    if(!conv){ conv = { id: conversaAtualId, titulo:'Nova conversa', atualizadoEm: Date.now() }; conversas.unshift(conv); }
    conv.mensagens = leve;
    conv.titulo = tituloDeMensagens(leve);
    conv.atualizadoEm = Date.now();
    Guardar.gravar(CHAVE_CONVERSAS, conversas);
    renderizarListaConversasLateral();
  }

  function renderizarListaConversasLateral(){
    const alvo = $('lista-conversas-lateral');
    if(!alvo) return;
    const ordenadas = [...conversas].sort((a,b) => (b.atualizadoEm||0) - (a.atualizadoEm||0));
    if(!ordenadas.length){ alvo.innerHTML = '<div class="vazio-lista-conversas">'+t('vazio_lista_conversas')+'</div>'; return; }
    alvo.innerHTML = ordenadas.map(c =>
      '<button class="item-conversa'+(c.id === conversaAtualId ? ' ativa' : '')+'" data-id="'+esc(c.id)+'">'
      + '<span class="titulo-conversa">'+esc(c.titulo || 'Nova conversa')+'</span>'
      + '<span class="btn-excluir-conversa" data-excluir="'+esc(c.id)+'" title="Excluir"><svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-.6 12.2a2 2 0 01-2 1.8H8.6a2 2 0 01-2-1.8L6 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
      + '</button>'
    ).join('');
    alvo.querySelectorAll('.item-conversa').forEach(b => b.addEventListener('click', (ev) => {
      if(ev.target.closest('[data-excluir]')) return;
      trocarConversa(b.dataset.id);
    }));
    alvo.querySelectorAll('[data-excluir]').forEach(b => b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      excluirConversa(b.dataset.excluir);
    }));
  }

  function novaConversa(){
    if(!mensagens.length && conversaAtualId){ fecharMenuLateral(); mudarTela('chat'); return; }
    conversaAtualId = 'c' + Date.now() + Math.random().toString(36).slice(2,7);
    mensagens = [];
    aberturaEscolhida = escolherAbertura();
    conversas.unshift({ id: conversaAtualId, titulo:'Nova conversa', mensagens: [], atualizadoEm: Date.now() });
    Guardar.gravar(CHAVE_CONVERSAS, conversas);
    mudarTela('chat');
    renderizarChat();
    renderizarListaConversasLateral();
    fecharMenuLateral();
  }

  function trocarConversa(id){
    const conv = conversas.find(c => c.id === id);
    if(!conv) return;
    conversaAtualId = id;
    mensagens = Array.isArray(conv.mensagens) ? conv.mensagens.slice() : [];
    aberturaEscolhida = escolherAbertura();
    mudarTela('chat');
    renderizarChat();
    renderizarListaConversasLateral();
    fecharMenuLateral();
  }

  function excluirConversa(id){
    if(!confirm(t('confirm_excluir_conversa'))) return;
    conversas = conversas.filter(c => c.id !== id);
    Guardar.gravar(CHAVE_CONVERSAS, conversas);
    if(id === conversaAtualId){
      if(conversas.length){
        const proxima = [...conversas].sort((a,b) => (b.atualizadoEm||0) - (a.atualizadoEm||0))[0];
        trocarConversa(proxima.id);
        return;
      }
      conversaAtualId = null;
      mensagens = [];
      renderizarChat();
    }
    renderizarListaConversasLateral();
  }

  $('btn-nova-conversa').addEventListener('click', novaConversa);

  $('btn-enviar').addEventListener('click', enviar);
  $('input-barra').addEventListener('keydown', ev => { if(ev.key === 'Enter'){ ev.preventDefault(); enviar(); } });
  $('btn-limpar').addEventListener('click', () => {
    if(!mensagens.length) return;
    if(confirm(t('confirm_apagar_conversa'))){
      mensagens = [];
      aberturaEscolhida = escolherAbertura();
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

  function abrirMenuLateral(){
    $('menu-lateral').classList.add('aberto');
    $('overlay-menu-lateral').classList.add('aberto');
    document.querySelectorAll('.item-menu-lateral[data-tela]').forEach(b => b.classList.toggle('ativo', b.dataset.tela === telaAtual));
    renderizarListaConversasLateral();
  }
  function fecharMenuLateral(){
    $('menu-lateral').classList.remove('aberto');
    $('overlay-menu-lateral').classList.remove('aberto');
  }
  $('btn-menu-lateral').addEventListener('click', abrirMenuLateral);
  $('overlay-menu-lateral').addEventListener('click', fecharMenuLateral);
  document.querySelectorAll('.item-menu-lateral[data-tela]').forEach(b => b.addEventListener('click', () => {
    mudarTela(b.dataset.tela);
    fecharMenuLateral();
  }));
  $('item-menu-conta').addEventListener('click', () => {
    fecharMenuLateral();
    renderizarContaModal();
    abrir('overlay-perfil');
  });

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
    const tot = totaisFinanceiros();
    const meses = mesesRecentesValor(3);
    const esteMes = meses[meses.length-1];
    const mesPassado = meses[meses.length-2];
    const alertas = [];
    let nivel = 'boa';

    if(!lancamentos.length && !produtos.length){
      return { nivel:'vazio', alertas:[t('diag_sem_dados')] };
    }
    if(tot.saldo < 0){ nivel = 'risco'; alertas.push(t('diag_saldo_negativo') + ' ' + moeda(Math.abs(tot.saldo)) + '.'); }
    if(esteMes && mesPassado && mesPassado.receita > 0 && esteMes.receita < mesPassado.receita * 0.6){
      nivel = nivel === 'risco' ? 'risco' : 'atencao';
      alertas.push(t('diag_entradas_cairam') + ' (' + moeda(mesPassado.receita) + ' → ' + moeda(esteMes.receita) + ').');
    }
    if(esteMes && esteMes.despesa > 0 && esteMes.receita > 0 && esteMes.despesa > esteMes.receita * 0.7){
      nivel = nivel === 'risco' ? 'risco' : 'atencao';
      alertas.push(t('diag_saidas_altas'));
    }
    produtos.forEach(p => {
      if(p.meta && p.vendas < p.meta * 0.5){
        nivel = nivel === 'risco' ? 'risco' : 'atencao';
        alertas.push('"' + p.nome + '" ' + t('diag_produto_abaixo_meta') + ' ' + p.vendas + ' ' + t('txt_vendas_min') + ', ' + t('diag_bem_abaixo_da_meta') + ' ' + p.meta + '/' + t('txt_mes_min') + '.');
      }
    });
    if(!alertas.length) alertas.push(t('diag_nenhum_alerta'));
    return { nivel, alertas, t: tot, meses };
  }

  function renderizarDiagnostico(){
    const d = diagnosticoNegocio();
    const rotulos = { vazio:t('diag_sem_dados_ainda'), boa:t('diag_saude_boa'), atencao:t('diag_saude_atencao'), risco:t('diag_saude_risco') };
    let comparativo = '';
    if(d.meses && d.meses.length >= 2){
      const esteMes = d.meses[d.meses.length-1];
      const mesPassado = d.meses[d.meses.length-2];
      if(mesPassado.receita > 0){
        const variacao = ((esteMes.receita - mesPassado.receita) / mesPassado.receita) * 100;
        const seta = variacao >= 0 ? '📈' : '📉';
        comparativo = '<div class="item-resumo" style="margin-bottom:10px"><span>'+t('diag_comparado_mes_passado')+'</span><strong>'+seta+' '+(variacao>=0?'+':'')+variacao.toFixed(0)+'%</strong></div>';
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
    const t2 = totaisFinanceiros();
    $('cards-dashboard').innerHTML =
      cardMetrica(ICO.cifrao, t('card_faturamento'), moeda(t2.receitas), '', t('nota_faturamento'))
      + cardMetrica(ICO.carrinho, t('card_vendas'), String(t2.vendas), '', t('nota_vendas'))
      + cardMetrica(ICO.alvo, t('card_ticket'), moeda(t2.ticket), '', t('nota_ticket'))
      + cardMetrica(ICO.cifrao, t('card_saldo'), moeda(t2.saldo), t2.saldo < 0 ? 'negativo' : 'positivo', t('nota_saldo'))
      + cardMetrica(ICO.caixa, t('card_produtos'), String(produtos.length), '', produtos.filter(p=>p.publicado).length + ' ' + t('nota_produtos'))
      + cardMetrica(ICO.descer, t('card_saidas'), moeda(t2.despesas), 'negativo', t('nota_saidas'));

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
      : '<div class="vazio-bloco">'+t('vazio_grafico')+'</div>';

    const area = $('lista-produtos');
    if(!produtos.length){
      area.innerHTML = '<div class="vazio-bloco">'+t('vazio_produtos')+'</div>';
    } else {
      area.innerHTML = produtos.map(p => {
        const feitas = p.etapas.filter(e=>e.feita).length;
        const pct = Math.round((feitas/p.etapas.length)*100);
        return '<div class="item-produto">'
          + '<div class="capa-produto" style="background:'+corCapa(p.id)+'">'+esc((p.nome||'?').trim().charAt(0).toUpperCase())+'</div>'
          + '<div class="info-produto">'
            + '<div class="nome-produto">'+esc(p.nome)+'</div>'
            + '<div class="meta-produto">'+esc(p.tipo)+' · '+moeda(p.preco)+' · '+p.vendas+' '+t('txt_vendas_min')+(p.meta?' · '+t('txt_meta_min')+' '+p.meta+'/'+t('txt_mes_min'):'')+'</div>'
            + '<span class="etiqueta '+(p.publicado?'publicado':'rascunho')+'">'+(p.publicado?t('etq_na_comunidade'):t('etq_rascunho'))+'</span>'
            + '<span class="etiqueta">'+feitas+'/'+p.etapas.length+' '+t('txt_etapas_min')+'</span>'
            + '<div class="barra-progresso"><div style="width:'+pct+'%"></div></div>'
          + '</div>'
          + '<div class="acoes-produto">'
            + '<button class="btn-mini" data-acao="etapas" data-id="'+p.id+'">'+t('btn_plano')+'</button>'
            + '<button class="btn-mini" data-acao="venda" data-id="'+p.id+'">'+t('btn_mais_venda')+'</button>'
            + '<button class="btn-mini" data-acao="publicar" data-id="'+p.id+'">'+(p.publicado?t('btn_publicado'):t('btn_publicar'))+'</button>'
            + '<button class="btn-mini perigo" data-acao="excluir" data-id="'+p.id+'">'+t('btn_excluir')+'</button>'
          + '</div></div>';
      }).join('');
      area.querySelectorAll('[data-acao]').forEach(b => b.addEventListener('click', () => acaoProduto(b.dataset.acao, b.dataset.id)));
    }

    const tl = $('tabela-lancamentos');
    if(!lancamentos.length){
      tl.innerHTML = '<div class="vazio-bloco">'+t('vazio_lancamentos')+'</div>';
    } else {
      const ord = lancamentos.slice().sort((a,b)=>b.criado-a.criado).slice(0,25);
      tl.innerHTML = '<div class="tabela-wrap"><table class="tabela-resposta"><thead><tr><th>'+t('tbl_descricao')+'</th><th>'+t('tbl_valor')+'</th><th></th></tr></thead><tbody>'
        + ord.map(l => '<tr><td>'+esc(l.descricao || (l.tipo==='receita'?t('opt_entrada'):t('opt_saida')))+'</td>'
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
      { texto:t('et_tema_texto'), dica:t('et_tema_dica'), feita:false },
      { texto:t('et_roteiro_texto'), dica:t('et_roteiro_dica'), feita:false },
      { texto:t('et_gravar_texto'), dica:t('et_gravar_dica'), feita:false },
      { texto:t('et_preco_texto'), dica:t('et_preco_dica'), feita:false },
      { texto:t('et_pagina_texto'), dica:t('et_pagina_dica'), feita:false },
      { texto:t('et_publicar_com_texto'), dica:t('et_publicar_com_dica'), feita:false },
      { texto:t('et_publicar_fora_texto'), dica:t('et_publicar_fora_dica'), feita:false },
      { texto:t('et_divulgar_texto'), dica:t('et_divulgar_dica'), feita:false }
    ];
  }

  function abrirModalProduto(id){
    editandoProdutoId = id || null;
    const sel = $('prod-categoria');
    sel.innerHTML = CATEGORIAS.map(c => '<option>'+c+'</option>').join('');
    const p = id ? produtos.find(x=>x.id===id) : null;
    $('titulo-modal-produto').textContent = p ? t('tit_editar_produto') : t('btn_criar_produto');
    $('prod-nome').value = p ? p.nome : '';
    $('prod-tipo').value = p ? p.tipo : t('opt_curso_video');
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
    if(!nome){ toast(t('toast_de_nome_produto')); return; }
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
    toast(t('toast_produto_salvo'));
  });

  async function acaoProduto(acao, id){
    const p = produtos.find(x=>x.id===id);
    if(!p) return;
    if(acao === 'excluir'){
      if(!confirm(t('confirm_excluir_produto')+' "'+p.nome+'"?')) return;
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
    if(val <= 0){ toast(t('toast_informe_valor_recebido')); return; }
    p.vendas += qtd;
    const d = new Date();
    lancamentos.push({ id:idNovo(), tipo:'receita', valor: val*qtd, qtd, venda:true, descricao:t('txt_venda_de')+' · '+p.nome, criado:Date.now(), mes: d.getFullYear()+'-'+d.getMonth() });
    await Guardar.gravar(CHAVE_PRODUTOS, produtos);
    await Guardar.gravar(CHAVE_LANC, lancamentos);
    fechar('overlay-venda');
    renderizarDashboard();
    toast(t('toast_venda_registrada'));
  });

  $('btn-add-lancamento').addEventListener('click', async () => {
    const tipo = $('lanc-tipo').value;
    const valor = parseFloat($('lanc-valor').value) || 0;
    const descricao = $('lanc-descricao').value.trim();
    if(valor <= 0){ toast(t('toast_valor_maior_zero')); return; }
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
    if(luc <= 0){ area.innerHTML = '<div class="aviso">'+t('aviso_preencha_lucro')+'</div>'; return; }
    const horasMes = hrs*4.33;
    const porHora = horasMes > 0 ? luc/horasMes : null;
    const meses = inv > 0 ? inv/luc : 0;
    const dados = []; let acum = 0;
    for(let m=1; m<=12; m++){ acum += luc; dados.push({ rotulo:t('txt_mes_min_cap')+' '+m, valor: acum-inv }); }
    const resumo = '<div class="resumo">'
      + '<div class="item-resumo"><span>'+t('txt_se_paga_em')+'</span><strong>'+(inv>0 ? (meses<1?t('txt_menos_1_mes'):meses.toFixed(1).replace('.',',')+' '+t('txt_meses')) : t('txt_sem_investimento'))+'</strong></div>'
      + (porHora !== null ? '<div class="item-resumo"><span>'+t('txt_por_hora_dedicada')+'</span><strong>'+moeda(porHora)+'</strong></div>' : '')
      + '<div class="item-resumo"><span>'+t('txt_lucro_12_meses')+'</span><strong>'+moeda(acum)+'</strong></div>'
      + '<div class="item-resumo"><span>'+t('txt_saldo_fim_ano')+'</span><strong>'+moeda(acum-inv)+'</strong></div>'
      + '</div>';
    area.innerHTML = resumo + '<div class="grafico-wrap"><div class="titulo-grafico">'+t('txt_saldo_mes_a_mes')+'</div>'+barrasGrafico(dados, moeda)+'</div>';
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
  function nomesPlataforma(){ return { ml_classico:t('opt_ml_classico'), ml_premium:t('opt_ml_premium'), shopee:t('opt_shopee'), direto:t('txt_venda_direta_sem_taxa') }; }

  $('btn-abrir-precificador').addEventListener('click', () => abrir('overlay-precificador'));
  $('btn-calcular-preco').addEventListener('click', () => {
    const custo = parseFloat($('preco-custo').value) || 0;
    const margem = parseFloat($('preco-margem').value) || 0;
    const plataforma = $('preco-plataforma').value;
    const area = $('resultado-precificador');
    if(custo <= 0){ area.innerHTML = '<div class="aviso">'+t('aviso_preencha_pagou')+'</div>'; return; }
    const r = calcularPrecoSugerido(custo, margem, plataforma);
    const NOMES_PLATAFORMA = nomesPlataforma();
    area.innerHTML = '<div class="resumo">'
      + '<div class="item-resumo"><span>'+t('txt_preco_sugerido')+'</span><strong>'+moeda(r.preco)+'</strong></div>'
      + '<div class="item-resumo"><span>'+t('txt_taxa_da')+' '+NOMES_PLATAFORMA[plataforma]+'</span><strong>'+moeda(r.taxaReais)+(r.comissaoPct>0?' ('+r.comissaoPct.toFixed(0)+'% + '+moeda(r.fixo)+' '+t('txt_fixo')+')':'')+'</strong></div>'
      + '<div class="item-resumo"><span>'+t('txt_lucro_liquido_real')+'</span><strong>'+moeda(r.liquido)+'</strong></div>'
      + '</div>'
      + '<div class="aviso">'+t('aviso_taxas_referencia')+'</div>';
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
    if(!metas.length){ area.innerHTML = '<div class="vazio-bloco">'+t('vazio_metas')+'</div>'; return; }
    area.innerHTML = metas.map(m => {
      const pct = Math.min(100, Math.round((m.acumulado / m.valorAlvo)*100));
      const meses = calcularMeses(m.prazo);
      const faltando = Math.max(0, m.valorAlvo - m.acumulado);
      const porMes = faltando / meses;
      return '<div class="item-produto">'
        + '<div class="capa-produto" style="background:'+corCapa(m.id)+'">🎯</div>'
        + '<div class="info-produto"><div class="nome-produto">'+esc(m.nome)+'</div>'
        + '<div class="meta-produto">'+moeda(m.acumulado)+' '+t('txt_de')+' '+moeda(m.valorAlvo)+(m.prazo?' · '+t('txt_ate')+' '+new Date(m.prazo+'T00:00:00').toLocaleDateString(idiomaAtual):'')+'</div>'
        + (faltando>0 ? '<div class="meta-produto">'+t('txt_guarde')+' '+moeda(porMes)+'/'+t('txt_mes_min')+' '+t('txt_pra_chegar_la')+'</div>' : '<div class="meta-produto" style="color:var(--menta)">'+t('txt_meta_batida')+'</div>')
        + '<div class="barra-progresso"><div style="width:'+pct+'%"></div></div>'
        + '</div>'
        + '<div class="acoes-produto"><button class="btn-mini" data-deposito="'+m.id+'">'+t('btn_mais_guardar')+'</button><button class="btn-mini perigo" data-del-meta="'+m.id+'">'+t('btn_excluir')+'</button></div>'
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
    if(!nome || valorAlvo<=0){ toast(t('toast_preencha_meta')); return; }
    metas.push({ id:idNovo(), nome, valorAlvo, prazo:$('meta-prazo').value||'', acumulado:0, criado:Date.now() });
    await Guardar.gravar(CHAVE_METAS, metas);
    fechar('overlay-meta');
    renderizarMetas();
    toast(t('toast_meta_criada'));
  });
  $('btn-confirmar-deposito').addEventListener('click', async () => {
    const m = metas.find(x=>x.id===depositoMetaId);
    if(!m) return;
    const v = parseFloat($('deposito-valor').value) || 0;
    if(v<=0){ toast(t('toast_informe_valor')); return; }
    m.acumulado += v;
    await Guardar.gravar(CHAVE_METAS, metas);
    fechar('overlay-deposito');
    renderizarMetas();
    toast(t('toast_guardado_total') + ' ' + moeda(m.acumulado));
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
    if(!fixos.length){ area.innerHTML = '<div class="vazio-bloco">'+t('vazio_radar')+'</div>'; return; }
    const totalMes = fixos.reduce((s,f)=>s+f.mediaValor,0);
    area.innerHTML = '<div class="aviso" style="margin-bottom:10px">'+t('txt_total_recorrente')+' <strong>'+moeda(totalMes)+'</strong>/'+t('txt_mes_min')+'</div>'
      + fixos.map(f => '<div class="item-resumo" style="margin-bottom:8px"><span>'+esc(f.nome)+' ('+f.vezes+'x)</span><strong>'+moeda(f.mediaValor)+'</strong></div>').join('');
  }

  // ===== Estoque pra revenda =====
  let editandoItemEstoqueId = null;
  const ETAPAS_ESTOQUE = ['comprado','anunciado','vendido'];
  function nomesEtapaEstoque(){ return { comprado:t('etp_comprado'), anunciado:t('etp_anunciado'), vendido:t('etp_vendido') }; }
  function renderizarEstoque(){
    const area = $('lista-estoque');
    const NOMES_ETAPA_ESTOQUE = nomesEtapaEstoque();
    if(!estoque.length){ area.innerHTML = '<div class="vazio-bloco">'+t('vazio_estoque')+'</div>'; return; }
    area.innerHTML = estoque.slice().reverse().map(it =>
      '<div class="item-produto"><div class="capa-produto" style="background:'+corCapa(it.id)+'">'+esc((it.nome||'?').charAt(0).toUpperCase())+'</div>'
      + '<div class="info-produto"><div class="nome-produto">'+esc(it.nome)+'</div>'
      + '<div class="meta-produto">'+t('txt_pago')+' '+moeda(it.custo)+'</div>'
      + '<span class="etiqueta '+(it.status==='vendido'?'publicado':'rascunho')+'">'+NOMES_ETAPA_ESTOQUE[it.status]+'</span></div>'
      + '<div class="acoes-produto">'
        + (it.status!=='vendido' ? '<button class="btn-mini" data-avancar="'+it.id+'">'+t('btn_avancar')+'</button>' : '')
        + '<button class="btn-mini perigo" data-del-item="'+it.id+'">'+t('btn_excluir')+'</button>'
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
    if(!nome){ toast(t('toast_de_nome_item')); return; }
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
    if(!nome){ toast(t('toast_nome_produto')); return; }
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
    if(avista<=0 || n<=0 || valorParcela<=0){ area.innerHTML = '<div class="aviso">'+t('aviso_preencha_tres')+'</div>'; return; }
    const total = n * valorParcela;
    const diferenca = total - avista;
    const pctJuros = (diferenca / avista) * 100;
    let veredito;
    if(diferenca <= 0) veredito = t('vered_parcelar_bom');
    else if(pctJuros < 8) veredito = t('vered_juro_baixo');
    else veredito = t('vered_juro_alto');
    area.innerHTML = '<div class="resumo">'
      + '<div class="item-resumo"><span>'+t('txt_total_parcelado')+'</span><strong>'+moeda(total)+'</strong></div>'
      + '<div class="item-resumo"><span>'+t('txt_diferenca_avista')+'</span><strong>'+moeda(diferenca)+'</strong></div>'
      + '<div class="item-resumo"><span>'+t('txt_juro_embutido')+'</span><strong>'+pctJuros.toFixed(1).replace('.',',')+'%</strong></div>'
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
    if(itens.length < 2){ toast(t('toast_min_2_produtos')); return; }
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
  function desafiosDef(){
    return {
      '1': { nome:t('opt_desafio_1'), dias:100, valorDia:(d)=>d, total:5050 },
      '2': { nome:t('opt_desafio_2'), dias:100, valorDia:(d)=>d*2, total:10100 },
      '5': { nome:t('opt_desafio_5'), dias:52, valorDia:()=>5, total:260 }
    };
  }
  function renderizarResumoDesafio(){
    const area = $('resumo-desafio');
    if(!desafio){ area.innerHTML = '<div class="vazio-bloco">'+t('vazio_desafio')+'</div>'; return; }
    const def = desafiosDef()[desafio.tipo];
    const guardado = desafio.diasMarcados.reduce((s,d)=>s+def.valorDia(d),0);
    area.innerHTML = '<div class="item-resumo"><span>'+def.nome+'</span><strong>'+desafio.diasMarcados.length+'/'+def.dias+' '+t('txt_dias')+'</strong></div>'
      + '<div class="item-resumo" style="margin-top:8px"><span>'+t('txt_guardado_ate_agora')+'</span><strong>'+moeda(guardado)+'</strong></div>';
  }
  function renderizarProgressoDesafio(){
    const area = $('progresso-desafio');
    if(!desafio){ area.innerHTML = ''; return; }
    const def = desafiosDef()[desafio.tipo];
    const guardado = desafio.diasMarcados.reduce((s,d)=>s+def.valorDia(d),0);
    let grade = '<div style="display:flex;flex-wrap:wrap;gap:5px;margin:14px 0;max-height:220px;overflow-y:auto">';
    for(let d=1; d<=def.dias; d++){
      const feito = desafio.diasMarcados.includes(d);
      grade += '<button class="btn-mini'+(feito?'':'')+'" data-dia="'+d+'" style="width:38px;height:38px;border-radius:9px;'+(feito?'background:var(--menta);color:#0E0E0E;border-color:var(--menta)':'')+'">'+d+'</button>';
    }
    grade += '</div>';
    area.innerHTML = '<div class="resumo">'
      + '<div class="item-resumo"><span>'+t('txt_progresso')+'</span><strong>'+desafio.diasMarcados.length+'/'+def.dias+'</strong></div>'
      + '<div class="item-resumo"><span>'+t('txt_guardado')+'</span><strong>'+moeda(guardado)+' '+t('txt_de')+' '+moeda(def.total)+'</strong></div>'
      + '</div>' + grade
      + '<button class="botao-secundario botao-largo" id="btn-reiniciar-desafio">'+t('btn_reiniciar_desafio')+'</button>';
    area.querySelectorAll('[data-dia]').forEach(b => b.addEventListener('click', async () => {
      const d = Number(b.dataset.dia);
      const i = desafio.diasMarcados.indexOf(d);
      if(i>=0) desafio.diasMarcados.splice(i,1); else desafio.diasMarcados.push(d);
      await Guardar.gravar(CHAVE_DESAFIO, desafio);
      renderizarProgressoDesafio();
      renderizarResumoDesafio();
    }));
    $('btn-reiniciar-desafio').addEventListener('click', async () => {
      if(!confirm(t('confirm_reiniciar_desafio'))) return;
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
    const tot = totaisFinanceiros();
    const meses = mesesRecentesValor(6);
    const hoje = new Date().toLocaleDateString(idiomaAtual);
    let txt = t('rel_titulo') + ' — ' + (perfil.nome || 'Best Sale') + '\n' + t('rel_gerado_em') + ' ' + hoje + '\n\n';
    txt += '== ' + t('rel_resumo_geral') + ' ==\n';
    txt += t('rel_faturamento_total') + ' ' + moeda(tot.receitas) + '\n';
    txt += t('rel_saidas_totais') + ' ' + moeda(tot.despesas) + '\n';
    txt += t('rel_saldo') + ' ' + moeda(tot.saldo) + '\n';
    txt += t('rel_vendas_totais') + ' ' + tot.vendas + '\n';
    txt += t('rel_ticket_medio') + ' ' + moeda(tot.ticket) + '\n\n';
    txt += '== ' + t('rel_ultimos_6_meses') + ' ==\n';
    meses.forEach(m => { txt += m.chave + ': ' + t('rel_entrou') + ' ' + moeda(m.receita) + ', ' + t('rel_saiu') + ' ' + moeda(m.despesa) + '\n'; });
    txt += '\n== ' + t('h3_meus_produtos').toUpperCase() + ' ==\n';
    if(!produtos.length) txt += t('rel_nenhum_produto') + '\n';
    produtos.forEach(p => { txt += '- ' + p.nome + ' (' + p.tipo + '): ' + t('lbl_preco_reais').toLowerCase() + ' ' + moeda(p.preco) + ', ' + p.vendas + ' ' + t('txt_vendas_min') + (p.meta?', '+t('txt_meta_min')+' '+p.meta+'/'+t('txt_mes_min'):'') + (p.publicado?' ['+t('etq_na_comunidade')+']':'') + '\n'; });
    txt += '\n== ' + t('rel_ultimas_movimentacoes') + ' ==\n';
    const ord = lancamentos.slice().sort((a,b)=>b.criado-a.criado).slice(0,20);
    if(!ord.length) txt += t('rel_nenhuma_movimentacao') + '\n';
    ord.forEach(l => { txt += (l.tipo==='receita'?'+ ':'- ') + moeda(l.valor) + ' — ' + (l.descricao||(l.tipo==='receita'?t('opt_entrada'):t('opt_saida'))) + '\n'; });
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
    if(!alertasPreco.length){ area.innerHTML = '<div class="vazio-bloco">'+t('vazio_alertas')+'</div>'; return; }
    area.innerHTML = alertasPreco.slice().reverse().map(a =>
      '<div class="item-produto"><div class="capa-produto" style="background:'+corCapa(a.id)+'">🔎</div>'
      + '<div class="info-produto"><div class="nome-produto">'+esc(a.nome)+'</div>'
      + '<div class="meta-produto">'+t('txt_quer_pagar_ate')+' '+moeda(a.alvo)+'</div>'
      + (a.ultimaChecagem ? '<div class="meta-produto">'+t('txt_ultima_checagem')+' '+esc(a.ultimoResultado||'')+' ('+new Date(a.ultimaChecagem).toLocaleDateString(idiomaAtual)+')</div>' : '')
      + '</div>'
      + '<div class="acoes-produto">'
        + '<button class="btn-mini" data-verificar="'+a.id+'">'+t('btn_verificar_agora')+'</button>'
        + '<button class="btn-mini perigo" data-del-alerta="'+a.id+'">'+t('btn_excluir')+'</button>'
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
      b.disabled = true; b.textContent = t('txt_verificando');
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
    if(!nome || alvo<=0){ toast(t('toast_preencha_alerta')); return; }
    alertasPreco.push({ id:idNovo(), nome, link:$('alerta-link').value.trim(), alvo, ultimaChecagem:null, ultimoResultado:'', criado:Date.now() });
    await Guardar.gravar(CHAVE_ALERTAS_PRECO, alertasPreco);
    fechar('overlay-alerta-preco');
    renderizarAlertasPreco();
  });

  // ===== Lembretes =====
  function nomesTipoLembrete(){ return { estoque:t('opt_repor_estoque'), assinatura:t('txt_renovar_assinatura'), outro:t('opt_outro') }; }
  function renderizarLembretes(){
    const area = $('lista-lembretes');
    const NOMES_TIPO_LEMBRETE = nomesTipoLembrete();
    if(!lembretes.length){ area.innerHTML = '<div class="vazio-bloco">'+t('vazio_lembretes')+'</div>'; return; }
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const ordenados = lembretes.slice().sort((a,b) => new Date(a.data) - new Date(b.data));
    area.innerHTML = ordenados.map(l => {
      const data = new Date(l.data + 'T00:00:00');
      const diasRestantes = Math.round((data - hoje) / 86400000);
      let cor = '';
      let situacao = t('txt_em') + ' ' + diasRestantes + ' ' + t('txt_dias');
      if(diasRestantes < 0){ cor='negativo'; situacao = t('txt_atrasado_ha') + ' ' + Math.abs(diasRestantes) + ' ' + t('txt_dias'); }
      else if(diasRestantes === 0){ cor='negativo'; situacao = t('txt_e_hoje'); }
      else if(diasRestantes <= 7){ situacao = t('txt_em') + ' ' + diasRestantes + ' ' + t('txt_dias') + ' — ' + t('txt_chegando'); }
      return '<div class="item-produto"><div class="capa-produto" style="background:'+corCapa(l.id)+'">⏰</div>'
        + '<div class="info-produto"><div class="nome-produto">'+esc(l.nome)+'</div>'
        + '<div class="meta-produto">'+NOMES_TIPO_LEMBRETE[l.tipo]+' · '+data.toLocaleDateString(idiomaAtual)+'</div>'
        + '<div class="meta-produto" style="color:var(--'+(cor==='negativo'?'coral':'papel-suave')+')">'+situacao+'</div></div>'
        + '<div class="acoes-produto"><button class="btn-mini perigo" data-del-lembrete="'+l.id+'">'+t('btn_excluir')+'</button></div></div>';
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
    if(!nome || !data){ toast(t('toast_preencha_lembrete')); return; }
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
    if(!perfil.nome){ abrir('overlay-perfil'); toast(t('toast_nome_antes_publicar')); return; }
    if(!p.descricao){ toast(t('toast_descricao_antes_publicar')); return; }
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
    toast(ok ? (ehPrimeiro ? t('toast_primeiro_curso') : t('toast_publicado_comunidade')) : t('toast_publicado_so_aparelho'));
  }

  $('btn-publicar').addEventListener('click', () => {
    if(!produtos.length){ mudarTela('dashboard'); abrirModalProduto(); toast(t('toast_crie_produto_primeiro')); return; }
    mudarTela('dashboard');
    toast(t('toast_escolha_produto'));
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
      ? t('aviso_com_publico')
      : t('aviso_com_local');

    const cats = [{ id:'__todos__', label:t('txt_todos') }].concat(CATEGORIAS.map(c => ({ id:c, label:c })));
    $('filtros-comunidade').innerHTML = cats.map(c => '<button class="filtro '+(c.id===filtroAtual?'ativo':'')+'" data-cat="'+esc(c.id)+'">'+esc(c.label)+'</button>').join('');
    $('filtros-comunidade').querySelectorAll('.filtro').forEach(b => b.addEventListener('click', () => { filtroAtual = b.dataset.cat; renderizarComunidade(); }));

    const lista = catalogo.filter(c => filtroAtual === '__todos__' || c.categoria === filtroAtual)
                          .sort((a,b) => (b.alunos||0)-(a.alunos||0) || b.criado-a.criado);
    const grade = $('grade-cursos');
    if(!lista.length){
      grade.innerHTML = '<div class="vazio-bloco">'+t('vazio_cursos_categoria')+'</div>';
      return;
    }
    grade.innerHTML = lista.map(c => {
      const meu = produtos.some(p => p.id === c.id);
      const inscrito = matriculas.some(m => m.id === c.id);
      const nota = mediaAvaliacao(c.id);
      return '<div class="card-curso">'
        + '<div class="capa-curso" style="background:'+corCapa(c.id)+'">'+esc(c.titulo)+'</div>'
        + '<div class="corpo-curso">'
        + '<div><div class="titulo-curso">'+esc(c.titulo)+(c.primeiroCurso?' <span class="etiqueta publicado" style="margin-top:0">🌱 '+t('txt_primeiro_curso')+'</span>':'')+'</div><div class="autor-curso">'+t('txt_por')+' '+esc(c.autor)+' · '+esc(c.tipo)+(nota?' · ⭐ '+nota.media.toFixed(1)+' ('+nota.total+')':'')+'</div></div>'
        + '<div class="descricao-curso">'+esc((c.descricao||'').slice(0,110))+((c.descricao||'').length>110?'…':'')+'</div>'
        + '<div class="rodape-curso"><span class="preco-curso">'+(c.preco>0?moeda(c.preco):t('txt_gratuito'))+'</span>'
        + '<span class="contador-curso">'+(c.alunos||0)+' '+t('txt_alunos')+'</span></div>'
        + '<button class="'+(meu||inscrito?'botao-secundario':'botao-principal')+'" data-curso="'+c.id+'">'
        + (meu ? t('btn_seu_curso') : inscrito ? t('btn_abrir_curso') : t('btn_ver_curso')) + '</button></div></div>';
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
      : '<div class="vazio-bloco" style="padding:14px">'+t('vazio_perguntas')+'</div>';
    return '<div class="titulo-secao-painel">'+t('titulo_perguntas')+'</div>' + lista
      + (perfil.nome ? '<div class="campos" style="margin-top:10px"><input type="text" id="nova-pergunta-curso" placeholder="'+esc(t('placeholder_pergunta_curso'))+'"></div><button class="botao-secundario botao-largo" id="btn-enviar-pergunta" data-curso-pergunta="'+c.id+'">'+t('btn_enviar_pergunta')+'</button>' : '<div class="aviso">'+t('aviso_nome_para_perguntar')+'</div>');
  }

  function renderizarAvaliacaoHTML(c, jaAvaliou){
    const nota = mediaAvaliacao(c.id);
    const doCurso = avaliacoes.filter(a => a.cursoId === c.id).slice().reverse();
    let html = '<div class="titulo-secao-painel">'+t('titulo_avaliacoes')+(nota?' · ⭐ '+nota.media.toFixed(1)+' ('+nota.total+')':'')+'</div>';
    html += doCurso.length
      ? doCurso.map(a => '<div class="item-resumo" style="align-items:flex-start;flex-direction:column;gap:4px"><strong>'+'⭐'.repeat(a.nota)+' — '+esc(a.autor)+'</strong>'+(a.comentario?'<span>'+esc(a.comentario)+'</span>':'')+'</div>').join('')
      : '<div class="vazio-bloco" style="padding:14px">'+t('vazio_avaliacoes')+'</div>';
    if(jaAvaliou){
      html += '<div class="lista-opcoes" id="lista-notas" style="flex-direction:row;gap:6px;margin-top:10px">'
        + [1,2,3,4,5].map(n => '<button class="btn-mini" data-nota="'+n+'" style="flex:1;text-align:center">'+n+'⭐</button>').join('')
        + '</div>'
        + '<div class="campos" style="margin-top:8px"><input type="text" id="comentario-avaliacao" placeholder="'+esc(t('placeholder_comentario'))+'"></div>'
        + '<div class="aviso" id="aviso-nota-escolhida" style="margin-top:8px">'+t('aviso_toque_nota')+'</div>';
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
      '<div class="subtitulo-modal">'+t('txt_por')+' '+esc(c.autor)+(c.bio?' · '+esc(c.bio):'')+(c.primeiroCurso?' · 🌱 '+t('txt_primeiro_curso'):'')+'</div>'
      + '<div class="aviso" style="margin-bottom:14px">'+esc(c.descricao || t('txt_sem_descricao'))+'</div>'
      + '<div class="resumo">'
        + '<div class="item-resumo"><span>'+t('lbl_formato')+'</span><strong>'+esc(c.tipo)+'</strong></div>'
        + '<div class="item-resumo"><span>'+t('lbl_categoria')+'</span><strong>'+esc(c.categoria)+'</strong></div>'
        + '<div class="item-resumo"><span>'+t('lbl_preco_reais')+'</span><strong>'+(c.preco>0?moeda(c.preco):t('txt_gratuito'))+'</strong></div>'
        + '<div class="item-resumo"><span>'+t('txt_alunos_cap')+'</span><strong>'+(c.alunos||0)+'</strong></div>'
        + (c.horario ? '<div class="item-resumo"><span>'+t('txt_horario')+'</span><strong>'+esc(c.horario)+'</strong></div>' : '')
      + '</div>'
      + (c.contato ? '<a href="'+(linkWhats||'#')+'" target="_blank" rel="noopener" class="botao-secundario botao-largo" style="display:block;text-align:center;text-decoration:none;margin-bottom:10px">'+(linkWhats?t('txt_falar_whatsapp'):t('txt_contato')+': '+esc(c.contato))+'</a>' : '')
      + (c.grupo ? '<a href="'+esc(c.grupo)+'" target="_blank" rel="noopener" class="botao-secundario botao-largo" style="display:block;text-align:center;text-decoration:none;margin-bottom:10px">'+t('txt_entrar_grupo')+'</a>' : '')
      + (meu ? '<div class="aviso">'+t('aviso_curso_e_seu')+'</div>'
        : inscrito ? '<div class="aviso">'+t('aviso_ja_matriculado')+'</div>'
        : '<button class="botao-principal botao-largo" id="btn-matricular">'+(c.preco>0?t('btn_quero_curso'):t('btn_entrar_curso'))+'</button>'
          + '<div class="aviso" style="margin-top:12px">'+t('aviso_pagamento_combinado')+'</div>')
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
        toast(t('toast_esta_em_meus_cursos'));
      });
    }
    if(jaAvaliou){
      $('lista-notas').querySelectorAll('[data-nota]').forEach(b => b.addEventListener('click', () => {
        notaEscolhida = Number(b.dataset.nota);
        $('aviso-nota-escolhida').textContent = t('txt_nota_escolhida') + ' ' + '⭐'.repeat(notaEscolhida) + ' — ' + t('txt_toque_enviar');
        if(!$('btn-enviar-avaliacao')){
          $('aviso-nota-escolhida').insertAdjacentHTML('afterend', '<button class="botao-principal botao-largo" id="btn-enviar-avaliacao" style="margin-top:8px">'+t('btn_enviar_avaliacao')+'</button>');
          $('btn-enviar-avaliacao').addEventListener('click', async () => {
            if(!notaEscolhida) return;
            avaliacoes.push({ id:idNovo(), cursoId:c.id, autor:perfil.nome, nota:notaEscolhida, comentario:$('comentario-avaliacao').value.trim(), criado:Date.now() });
            await Guardar.gravar(CHAVE_AVALIACOES, avaliacoes, true);
            fechar('overlay-curso');
            renderizarComunidade();
            toast(t('toast_avaliacao_enviada'));
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
        toast(t('toast_pergunta_enviada'));
      });
    }
    abrir('overlay-curso');
  }

  function renderizarMatriculas(){
    const area = $('lista-matriculas');
    if(!matriculas.length){
      area.innerHTML = '<div class="vazio-bloco">'+t('vazio_matriculas')+'</div>';
      return;
    }
    area.innerHTML = matriculas.slice().reverse().map(m =>
      '<div class="item-produto"><div class="capa-produto" style="background:'+corCapa(m.id)+'">'+esc((m.titulo||'?').charAt(0).toUpperCase())+'</div>'
      + '<div class="info-produto"><div class="nome-produto">'+esc(m.titulo)+'</div>'
      + '<div class="meta-produto">'+t('txt_por')+' '+esc(m.autor)+' · '+esc(m.tipo)+'</div>'
      + '<div class="meta-produto" style="margin-top:6px">'+esc((m.descricao||'').slice(0,120))+'</div></div>'
      + '<div class="acoes-produto"><button class="btn-mini perigo" data-sair="'+m.id+'">'+t('btn_sair')+'</button></div></div>').join('');
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

  function t(chave){
    const dic = TRADUCOES[idiomaAtual] || TRADUCOES['pt-BR'];
    return dic[chave] || TRADUCOES['pt-BR'][chave] || chave;
  }

  function abaConta(modo){
    const login = modo !== 'cadastro';
    return '<div class="filtros" style="margin-bottom:16px">'
      + '<button class="filtro '+(login?'ativo':'')+'" data-aba-conta="entrar">'+esc(t('aba_entrar'))+'</button>'
      + '<button class="filtro '+(!login?'ativo':'')+'" data-aba-conta="cadastro">'+esc(t('aba_criar_conta'))+'</button>'
      + '</div>'
      + '<div class="campos">'
        + '<label>'+esc(t('lbl_email'))+'<input type="email" id="conta-email" placeholder="'+esc(t('placeholder_email'))+'"></label>'
        + '<label>'+esc(t('lbl_senha'))+'<input type="password" id="conta-senha" placeholder="'+esc(t('placeholder_senha'))+'"></label>'
      + '</div>'
      + '<button class="botao-principal botao-largo" id="btn-entrar-email" style="margin-top:14px">'+(login?esc(t('btn_entrar')):esc(t('btn_criar_conta_2')))+'</button>'
      + '<div style="text-align:center;color:var(--papel-suave);font-size:.8rem;margin:14px 0">'+esc(t('txt_ou'))+'</div>'
      + '<button class="botao-google botao-largo" id="btn-entrar-google">'
        + '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">'
          + '<path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>'
          + '<path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>'
          + '<path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>'
          + '<path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.4 5.4C39.7 37.3 44 31.4 44 24c0-1.2-.1-2.4-.4-3.5z"/>'
        + '</svg>'
        + '<span>'+esc(t('txt_continuar_google'))+'</span>'
      + '</button>'
      + '<div id="erro-conta" style="display:none;margin-top:14px"></div>'
      + (!auth ? '<div class="aviso" style="margin-top:14px">'+esc(t('aviso_login_indisponivel'))+'</div>' : '');
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
      area.innerHTML = '<div class="subtitulo-modal">'+esc(t('logado_como'))+' '+esc(user.email||'')+'</div>'
        + '<div class="campos">'
          + '<label>'+esc(t('lbl_como_chamado'))+'<input type="text" id="perfil-nome" placeholder="'+esc(t('placeholder_nome_exemplo'))+'"></label>'
          + '<label>'+esc(t('lbl_uma_linha_sobre_voce'))+'<input type="text" id="perfil-bio" placeholder="'+esc(t('placeholder_bio_exemplo'))+'"></label>'
        + '</div>'
        + '<button class="botao-principal botao-largo" id="btn-salvar-perfil">'+esc(t('btn_salvar'))+'</button>'
        + '<button class="botao-secundario botao-largo" id="btn-sair-conta" style="margin-top:10px">'+esc(t('btn_sair_conta'))+'</button>';
      $('perfil-nome').value = perfil.nome || '';
      $('perfil-bio').value = perfil.bio || '';
      $('btn-salvar-perfil').addEventListener('click', async () => {
        perfil.nome = $('perfil-nome').value.trim();
        perfil.bio = $('perfil-bio').value.trim();
        perfil.email = user.email;
        await Guardar.gravar(CHAVE_PERFIL, perfil);
        $('selo-topo').textContent = perfil.nome ? esc(perfil.nome) : esc(user.email);
        fechar('overlay-perfil');
        toast(t('toast_salvo'));
      });
      $('btn-sair-conta').addEventListener('click', async () => {
        if(!confirm(t('confirm_sair_conta'))) return;
        await auth.signOut();
        toast(t('toast_saiu'));
      });
    } else {
      area.innerHTML = abaConta('entrar');
      ligarEventosConta('entrar');
      if(auth && location.protocol === 'file:'){
        mostrarErroConta(t('erro_arquivo_direto'), t('erro_arquivo_direto_detalhe'));
      } else if(auth && typeof dentroDeIframe !== 'undefined' && dentroDeIframe){
        mostrarErroConta(t('erro_dentro_iframe'), t('erro_dentro_iframe_detalhe'));
      }
    }
  }

  function ligarEventosConta(modo){
    $('conteudo-conta').querySelectorAll('[data-aba-conta]').forEach(b => b.addEventListener('click', () => {
      $('conteudo-conta').innerHTML = abaConta(b.dataset.abaConta);
      ligarEventosConta(b.dataset.abaConta);
    }));
    $('btn-entrar-email').addEventListener('click', async () => {
      if(!auth){ mostrarErroConta(t('erro_login_indisponivel')); return; }
      const email = $('conta-email').value.trim();
      const senha = $('conta-senha').value;
      if(!email || senha.length < 6){ mostrarErroConta(t('erro_email_senha_obrigatorios')); return; }
      const cadastro = $('conteudo-conta').querySelector('[data-aba-conta="cadastro"]').classList.contains('ativo');
      $('btn-entrar-email').disabled = true;
      try{
        if(cadastro) await auth.createUserWithEmailAndPassword(email, senha);
        else await auth.signInWithEmailAndPassword(email, senha);
      }catch(e){
        const msgs = {
          'auth/email-already-in-use': t('erro_email_ja_tem_conta'),
          'auth/invalid-email': t('erro_email_invalido'),
          'auth/weak-password': t('erro_senha_fraca'),
          'auth/wrong-password': t('erro_senha_incorreta'),
          'auth/user-not-found': t('erro_conta_nao_encontrada'),
          'auth/invalid-credential': t('erro_credenciais_incorretas'),
          'auth/too-many-requests': t('erro_muitas_tentativas'),
          'auth/network-request-failed': t('erro_sem_conexao_firebase'),
          'auth/unauthorized-domain': t('erro_dominio_nao_autorizado'),
          'auth/operation-not-allowed': t('erro_email_senha_desativado')
        };
        mostrarErroConta(msgs[e.code] || t('erro_nao_consegui_completar'), (e.code||'') + (e.message?' — '+e.message:''));
      }
      $('btn-entrar-email').disabled = false;
    });
    $('btn-entrar-google').addEventListener('click', async () => {
      if(!auth){ mostrarErroConta(t('erro_login_indisponivel')); return; }
      try{
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      }catch(e){
        const msgs = {
          'auth/popup-blocked': t('erro_popup_bloqueado'),
          'auth/cancelled-popup-request': t('erro_popup_cancelado'),
          'auth/popup-closed-by-user': t('erro_popup_fechado'),
          'auth/unauthorized-domain': t('erro_dominio_nao_autorizado_google'),
          'auth/operation-not-allowed': t('erro_google_desativado')
        };
        mostrarErroConta(msgs[e.code] || t('erro_nao_consegui_google'), (e.code||'') + (e.message?' — '+e.message:''));
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
      aplicarIdioma(idiomaAtual);
      aberturaEscolhida = escolherAbertura();
      if(telaAtual === 'chat' && !mensagens.length) renderizarChat();
      if(telaAtual === 'dashboard') renderizarDashboard();
      if($('overlay-perfil').classList.contains('aberto')) renderizarContaModal();
      fechar('overlay-idioma');
      toast(TRADUCOES[idiomaAtual].nav_conversa + ' → ' + IDIOMAS.find(i=>i.codigo===idiomaAtual).nome);
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
      subtitulo = t('mic_sub_iframe');
      passos = [ t('mic_passo_iframe_1'), t('mic_passo_iframe_2'), t('mic_passo_iframe_3'), t('mic_passo_iframe_4') ];
    } else if(motivo === 'inseguro'){
      subtitulo = t('mic_sub_inseguro');
      passos = [ t('mic_passo_inseguro_1'), t('mic_passo_inseguro_2'), t('mic_passo_inseguro_3') ];
    } else if(iOS){
      subtitulo = t('mic_sub_bloqueado');
      passos = [ t('mic_passo_ios_1'), t('mic_passo_ios_2'), t('mic_passo_ios_3'), t('mic_passo_ios_4') ];
    } else {
      subtitulo = t('mic_sub_bloqueado');
      passos = [ t('mic_passo_outro_1'), t('mic_passo_outro_2'), t('mic_passo_outro_3'), t('mic_passo_outro_4') ];
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
        'no-speech': t('mic_nao_ouvi'),
        'audio-capture': t('mic_sem_disponivel'),
        'network': t('mic_conexao_insuficiente'),
        'aborted':''
      };
      const m = msgs[ev.error] !== undefined ? msgs[ev.error] : t('mic_nao_funcionou');
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
    const [c, conv, p, l, pf, mt, idi, ap, mts, est, des, alp, lem] = await Promise.all([
      Guardar.ler(CHAVE_CHAT), Guardar.ler(CHAVE_CONVERSAS), Guardar.ler(CHAVE_PRODUTOS), Guardar.ler(CHAVE_LANC),
      Guardar.ler(CHAVE_PERFIL), Guardar.ler(CHAVE_MATRICULAS), Guardar.ler(CHAVE_IDIOMA), Guardar.ler(CHAVE_APARENCIA),
      Guardar.ler(CHAVE_METAS), Guardar.ler(CHAVE_ESTOQUE), Guardar.ler(CHAVE_DESAFIO),
      Guardar.ler(CHAVE_ALERTAS_PRECO), Guardar.ler(CHAVE_LEMBRETES)
    ]);
    conversas = Array.isArray(conv) ? conv : [];
    if(!conversas.length && Array.isArray(c) && c.length){
      // migração: conversa única salva antes de existir o histórico
      const migrada = { id:'c'+Date.now(), titulo: tituloDeMensagens(c), mensagens: c, atualizadoEm: Date.now() };
      conversas = [migrada];
      Guardar.gravar(CHAVE_CONVERSAS, conversas);
    }
    if(conversas.length){
      const maisRecente = [...conversas].sort((a,b) => (b.atualizadoEm||0) - (a.atualizadoEm||0))[0];
      conversaAtualId = maisRecente.id;
      mensagens = Array.isArray(maisRecente.mensagens) ? maisRecente.mensagens.slice() : [];
    } else {
      mensagens = [];
    }
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

    if(typeof idi === 'string' && IDIOMAS.some(i=>i.codigo===idi)){
      idiomaAtual = idi;
      if(rec) rec.lang = idiomaAtual;
      aplicarIdioma(idiomaAtual);
      if(!mensagens.length) aberturaEscolhida = escolherAbertura();
    }
    renderizarChat();
    renderizarListaConversasLateral();

    if(!(typeof idi === 'string' && IDIOMAS.some(i=>i.codigo===idi))){
      // primeira visita: pergunta o idioma
      renderizarIdiomas();
      abrir('overlay-idioma');
    }
  })();
})();
