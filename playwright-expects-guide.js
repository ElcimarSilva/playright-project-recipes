/**
 * GUIA DE EXPECTS (ASSERÇÕES) - PLAYWRIGHT
 *
 * Este arquivo contém exemplos de como fazer asserções usando Playwright
 */

// ============================================
// 1. ASSERÇÕES DE VISIBILIDADE
// ============================================

// Estar visível
await expect(page.locator('button')).toBeVisible();
await expect(page.locator('.modal')).toBeVisible({ timeout: 5000 });

// Estar oculto
await expect(page.locator('.loader')).toBeHidden();
await expect(page.locator('#error-message')).not.toBeVisible();

// Estar habilitado/desabilitado
await expect(page.locator('button.submit')).toBeEnabled();
await expect(page.locator('button.disabled')).toBeDisabled();

// Estar marcado (checkbox/radio)
await expect(page.locator('input[type="checkbox"]')).toBeChecked();
await expect(page.locator('input[type="radio"]')).not.toBeChecked();

// Estar focado
await expect(page.locator('input')).toBeFocused();


// ============================================
// 2. ASSERÇÕES DE TEXTO
// ============================================

// Contém texto (substring)
await expect(page.locator('h1')).toContainText('Bem-vindo');
await expect(page.locator('.message')).toContainText('sucesso');

// Texto exato
await expect(page.locator('button')).toHaveText('Enviar');
await expect(page.locator('h1')).toHaveText('Exatamente este texto');

// Texto com regex (case-insensitive)
await expect(page.locator('p')).toContainText(/olá/i);
await expect(page.locator('span')).toHaveText(/^Número: \d+$/);

// Múltiplas asserções de texto
const elemento = page.locator('.card');
await expect(elemento).toContainText('Título');
await expect(elemento).toContainText('Descrição');

// Texto vazio
await expect(page.locator('input')).toHaveValue('');

// Não contém texto
await expect(page.locator('body')).not.toContainText('erro');


// ============================================
// 3. ASSERÇÕES DE ATRIBUTOS
// ============================================

// Verificar atributo específico
await expect(page.locator('input[type="email"]')).toHaveAttribute('placeholder', 'seu@email.com');
await expect(page.locator('a')).toHaveAttribute('href', 'https://exemplo.com');

// Verificar se tem o atributo (independente do valor)
await expect(page.locator('input')).toHaveAttribute('required');

// Atributo data-*
await expect(page.locator('div')).toHaveAttribute('data-testid', 'user-card');
await expect(page.locator('[aria-label]')).toHaveAttribute('role', 'button');

// Verificar classe
await expect(page.locator('button')).toHaveClass(/primary/);
await expect(page.locator('div')).toHaveClass('container active');

// Não ter classe
await expect(page.locator('button')).not.toHaveClass('disabled');


// ============================================
// 4. ASSERÇÕES DE VALOR
// ============================================

// Valor de input
await expect(page.locator('input[name="email"]')).toHaveValue('teste@email.com');

// Valor vazio
await expect(page.locator('textarea')).toHaveValue('');

// Valor parcial (com regex)
await expect(page.locator('input')).toHaveValue(/teste/);


// ============================================
// 5. ASSERÇÕES DE QUANTIDADE/CONTAGEM
// ============================================

// Contar elementos
await expect(page.locator('li')).toHaveCount(5);
await expect(page.locator('button')).toHaveCount(1);

// Ter no mínimo N elementos
const items = page.locator('.item');
await expect(items).toHaveCount(async count => count > 0);

// Usar .count() diretamente
const totalBotoes = await page.locator('button').count();
expect(totalBotoes).toBeGreaterThan(2);
expect(totalBotoes).toBeLessThanOrEqual(10);


// ============================================
// 6. ASSERÇÕES DE BOX MODEL
// ============================================

// Verificar se está na viewport (visível)
await expect(page.locator('.hero')).toBeInViewport();

// Verificar dimensões
await expect(page.locator('.header')).toHaveScreenshot();

// Posição específica
const bbox = await page.locator('button').boundingBox();
expect(bbox.width).toBeGreaterThan(100);
expect(bbox.height).toBeGreaterThan(40);


// ============================================
// 7. ASSERÇÕES DE URL E NAVEGAÇÃO
// ============================================

// Verificar URL
await expect(page).toHaveURL('https://exemplo.com/home');
await expect(page).toHaveURL(/\/home$/);

// Url contém
await expect(page).toHaveURL(/exemplo.com/);

// Verificar título da página
await expect(page).toHaveTitle('Minha Aplicação');
await expect(page).toHaveTitle(/Aplicação/);


// ============================================
// 8. ASSERÇÕES DE PÁGINA
// ============================================

// Elemento existe na página
await expect(page.locator('#main-content')).toBeDefined();

// Elemento está no DOM (pode estar oculto)
await expect(page.locator('.hidden-element')).toBeTruthy();

// Verificar se página tem conteúdo específico
const htmlContent = await page.content();
expect(htmlContent).toContain('Copyright');


// ============================================
// 9. ASSERÇÕES COM NEGAÇÃO (NOT)
// ============================================

// Não estar visível
await expect(page.locator('.toast')).not.toBeVisible();

// Não conter texto
await expect(page.locator('body')).not.toContainText('erro');

// Não estar habilitado
await expect(page.locator('button')).not.toBeEnabled();

// Não ter classe
await expect(page.locator('input')).not.toHaveClass('erro');

// URL não for
await expect(page).not.toHaveURL('/logout');


// ============================================
// 10. ASSERÇÕES COM TIMEOUT CUSTOMIZADO
// ============================================

// Aumentar timeout padrão
await expect(page.locator('.lazy-loaded')).toBeVisible({ timeout: 10000 });

// Timeout curto para falhar rápido
await expect(page.locator('.fast-element')).toBeVisible({ timeout: 1000 });

// Esperar elemento desaparecer
await expect(page.locator('.modal')).toBeHidden({ timeout: 5000 });


// ============================================
// 11. ASSERÇÕES MÚLTIPLAS/COMPOSTAS
// ============================================

// Várias asserções no mesmo elemento
const botao = page.locator('button.submit');
await expect(botao).toBeVisible();
await expect(botao).toBeEnabled();
await expect(botao).toHaveText('Enviar');

// Asserções em múltiplos elementos
const inputs = page.locator('input');
for (let i = 0; i < await inputs.count(); i++) {
  await expect(inputs.nth(i)).toBeVisible();
}

// Asserção com condição
const elementoCount = await page.locator('.item').count();
if (elementoCount > 0) {
  await expect(page.locator('.item').first()).toBeVisible();
}


// ============================================
// 12. ASSERÇÕES ASSINCRONAMENTE (ASYNC)
// ============================================

// Esperar até que a condição seja verdadeira
await expect(async () => {
  const valor = await page.locator('input').inputValue();
  expect(valor).toBe('esperado');
}).toPass();

// Esperar com timeout
await expect(async () => {
  const count = await page.locator('button').count();
  expect(count).toBeGreaterThan(0);
}).toPass({ timeout: 5000 });

// Asserção que retenta automaticamente
await expect(page.locator('span')).toContainText('carregado', { timeout: 5000 });


// ============================================
// 13. EXEMPLOS PRÁTICOS
// ============================================

// Exemplo: Validar formulário
async function validarFormulario() {
  const form = page.locator('form');

  // Validar presença de campos obrigatórios
  await expect(form.locator('input[name="email"]')).toBeVisible();
  await expect(form.locator('input[name="senha"]')).toBeVisible();

  // Validar estado do botão
  await expect(form.locator('button[type="submit"]')).toBeDisabled();

  // Preencher e validar habilitação
  await form.locator('input[name="email"]').fill('teste@email.com');
  await form.locator('input[name="senha"]').fill('senha123');
  await expect(form.locator('button[type="submit"]')).toBeEnabled();
}

// Exemplo: Validar mensagem de sucesso
async function validarMensagemSucesso() {
  await expect(page.locator('.alert-success')).toBeVisible();
  await expect(page.locator('.alert-success')).toContainText('Operação concluída com sucesso');

  // Validar que desaparece após tempo
  await expect(page.locator('.alert-success')).toBeHidden({ timeout: 5000 });
}

// Exemplo: Validar tabela
async function validarTabela() {
  const tabela = page.locator('table');

  // Verificar se tabela está visível
  await expect(tabela).toBeVisible();

  // Verificar número de linhas
  const linhas = tabela.locator('tbody tr');
  await expect(linhas).toHaveCount(10);

  // Verificar conteúdo específico
  await expect(linhas.first()).toContainText('João Silva');
}

// Exemplo: Validar carregamento
async function validarCarregamento() {
  // Verifica se loader apareceu
  await expect(page.locator('.loader')).toBeVisible();

  // Verifica se loader desapareceu (conteúdo carregou)
  await expect(page.locator('.loader')).toBeHidden({ timeout: 10000 });

  // Verifica se conteúdo está visível
  await expect(page.locator('.content')).toBeVisible();
}

// Exemplo: Validar paginação
async function validarPaginacao() {
  const botaoProxima = page.locator('button.next-page');

  // Primeira página - botão próxima habilitado
  await expect(botaoProxima).toBeEnabled();

  // Última página - botão próxima desabilitado
  await botaoProxima.click();
  // ... navegar para última página
  await expect(botaoProxima).toBeDisabled();
}

// Exemplo: Validar modal/dialog
async function validarModal() {
  const modal = page.locator('.modal');
  const titulo = modal.locator('.modal-title');
  const botaoFechar = modal.locator('.close-button');

  await expect(modal).toBeVisible();
  await expect(titulo).toHaveText('Confirmar Ação');
  await expect(botaoFechar).toBeVisible();

  // Fechar e validar desaparecimento
  await botaoFechar.click();
  await expect(modal).toBeHidden();
}

// Exemplo: Validação em chain
async function validarElementoCompleto(seletor) {
  const elemento = page.locator(seletor);

  // Múltiplas validações
  await expect(elemento).toBeVisible();
  await expect(elemento).toBeFocused();
  await expect(elemento).toHaveClass(/active/);
  await expect(elemento).not.toHaveClass('disabled');

  return elemento;
}

module.exports = {
  validarFormulario,
  validarMensagemSucesso,
  validarTabela,
  validarCarregamento,
  validarPaginacao,
  validarModal,
  validarElementoCompleto
};
