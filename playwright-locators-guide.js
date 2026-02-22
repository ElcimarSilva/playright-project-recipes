/**
 * GUIA DE LOCALIZAÇÃO DE ELEMENTOS - PLAYWRIGHT
 *
 * Este arquivo contém exemplos de como localizar e obter elementos usando Playwright
 */

// ============================================
// 1. LOCALIZADORES BÁSICOS (Locators)
// ============================================

/**
 * page.locator() - O método mais moderno e recomendado
 */

// Por CSS Selector
const botao = page.locator('button');
const input = page.locator('input[type="text"]');
const div = page.locator('.container');
const id = page.locator('#main-header');

// Por XPath
const elemento = page.locator('xpath=//button[@class="submit"]');
const tabela = page.locator('xpath=//table//tr[1]');

// Por Text (texto do elemento)
const botaoOK = page.locator('button:has-text("OK")');
const linkPerfil = page.locator('text=Meu Perfil');

// Por Role (recomendado para acessibilidade)
const botaoRole = page.locator('role=button[name="Enviar"]');
const inputRole = page.locator('role=textbox');
const linkRole = page.locator('role=link[name="Home"]');

// Por atributo
const inputEmail = page.locator('input[name="email"]');
const divData = page.locator('[data-testid="user-card"]');
const spanAriaLabel = page.locator('[aria-label="Fechar"]');


// ============================================
// 2. COMBINAÇÕES DE SELETORES
// ============================================

// Selector múltiplo (combinado)
const botaoGrande = page.locator('button.large.primary');
const inputObrigatorio = page.locator('input[required][type="email"]');

// Seletor descendente
const botaoDentroDeModal = page.locator('.modal button.confirm');
const linkDentroDeMenu = page.locator('nav >> a');

// Seletor :has() - elemento que contém
const divComBotao = page.locator('div:has(button)');
const formComInput = page.locator('form:has(input[type="password"])');

// Múltiplos níveis
const celulaTabelaPrincipal = page.locator('table#main >> tbody >> tr >> td');


// ============================================
// 3. FILTROS (Filter)
// ============================================

// Filtrar por visibilidade
const botaoVisivel = page.locator('button').first();
const inputVisible = page.locator('input').filter({ hasText: 'Buscar' });

// Filtrar por texto exato
const opcao = page.locator('option').filter({ hasText: 'Opção 1' });

// Filtrar por múltiplas condições
const itemAtivo = page.locator('.item').filter({ has: page.locator('.active') });


// ============================================
// 4. SELEÇÃO POR ÍNDICE E QUANTIDADE
// ============================================

// First e Last
const primeiroBotao = page.locator('button').first();
const ultimoLinke = page.locator('a').last();

// nth - N-ésimo elemento (baseado em 0)
const terceiraTh = page.locator('th').nth(2);

// Count - contar elementos
const totalBotoes = await page.locator('button').count();
console.log(`Total de botões: ${totalBotoes}`);

// All - obter todos
const todosBotoes = await page.locator('button').all();
const todosLinks = await page.locator('a').all();


// ============================================
// 5. NAVEGAÇÃO ENTRE ELEMENTOS (Parent/Child)
// ============================================

// Parent - elemento pai
const pai = page.locator('button').locator('xpath=..');

// Locator dentro de locator
const modal = page.locator('.modal');
const botaoDeModal = modal.locator('button.submit');
const inputDeModal = modal.locator('input[type="text"]');

// Irmão (sibling)
const irmaoPosterior = page.locator('h1').locator('xpath=following-sibling::p[1]');
const irmaoPrevio = page.locator('input').locator('xpath=preceding-sibling::label');


// ============================================
// 6. OBTER VALORES/ATRIBUTOS DOS ELEMENTOS
// ============================================

// Obter texto do elemento
const texto = await page.locator('h1').textContent();
console.log(`Título: ${texto}`);

// Obter valor de input/textarea/select
const valor = await page.locator('input[name="email"]').inputValue();
console.log(`Email: ${valor}`);

// Obter atributo específico
const href = await page.locator('a[name="home"]').getAttribute('href');
console.log(`Link: ${href}`);

const dataId = await page.locator('div').getAttribute('data-id');

const placeholder = await page.locator('input').getAttribute('placeholder');

// Obter HTML interno
const html = await page.locator('.container').innerHTML();

// Obter HTML externo
const htmlCompleto = await page.locator('.container').outerHTML();

// Verificar classe
const temClasse = await page.locator('button').getAttribute('class');
console.log(`Classes: ${temClasse}`);


// ============================================
// 7. OBTER MÚLTIPLOS ELEMENTOS E ITERAR
// ============================================

// Obter todos os elementos e iterar
const items = await page.locator('.item').all();
for (const item of items) {
  const texto = await item.textContent();
  console.log(texto);
}

// Usar allTextContents()
const todosTextos = await page.locator('li').allTextContents();
console.log(todosTextos); // Array de strings

// Usar allInnerTexts()
const todosTextos2 = await page.locator('td').allInnerTexts();

// Map sobre locators
const titulos = page.locator('h2');
for (let i = 0; i < await titulos.count(); i++) {
  const texto = await titulos.nth(i).textContent();
  console.log(`Título ${i}: ${texto}`);
}


// ============================================
// 8. LOCALIZADORES COM DELAY/TRATAMENTO
// ============================================

// Esperar elemento estar visível (com timeout)
await page.locator('.loader').waitFor({ state: 'hidden', timeout: 5000 });

// Verificar se elemento existe
const existe = await page.locator('#optional-element').count() > 0;

// Obter elemento com fallback
const elemento1 = page.locator('.novo-seletor');
const elemento2 = page.locator('.seletor-antigo');
const elementoDisponivel = await elemento1.count() > 0 ? elemento1 : elemento2;


// ============================================
// 9. EXEMPLOS PRÁTICOS COMPLETOS
// ============================================

// Exemplo: Login
async function fazerLogin(email, senha) {
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(senha);
  await page.locator('button[type="submit"]').click();
  await page.waitForNavigation();
}

// Exemplo: Selecionar opção de dropdown
async function selecionarDropdown(selectorDropdown, valor) {
  const dropdown = page.locator(selectorDropdown);
  await dropdown.click();
  const opcao = page.locator(`text=${valor}`).first();
  await opcao.click();
}

// Exemplo: Extrair dados de tabela
async function obterDadosDatabela() {
  const linhas = await page.locator('table tbody tr').all();
  const dados = [];

  for (const linha of linhas) {
    const colunas = await linha.locator('td').allTextContents();
    dados.push(colunas);
  }

  return dados;
}

// Exemplo: Buscar elemento por texto parcial (case-insensitive)
async function procurarBotaoPor(textoParc) {
  return page.locator(`button:has-text("${textoParc}")`);
}

// Exemplo: Esperar elemento com retry
async function obterElementoComRetry(seletor, maxTentativas = 3) {
  for (let i = 0; i < maxTentativas; i++) {
    try {
      const elemento = page.locator(seletor);
      await elemento.waitFor({ timeout: 2000 });
      return elemento;
    } catch (e) {
      console.log(`Tentativa ${i + 1} falhou, tentando novamente...`);
      await page.reload();
    }
  }
  throw new Error(`Elemento ${seletor} não encontrado após ${maxTentativas} tentativas`);
}
