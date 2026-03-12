const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Création de tâche - Test E2E', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('doit permettre de créer une nouvelle tâche', async () => {
    await driver.get('http://localhost:3000');

    // 1. Connexion
    await driver.wait(until.elementLocated(By.id('email')), 10000).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 2. MODIFICATION ICI : On n'attend plus l'URL, on attend le bouton directement
    // On met 15000 (15 secondes) pour que GitHub Actions ait le temps de charger
    const newTaskBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Nouvelle Tâche')]")),
      15000
    );
    await newTaskBtn.click();

    // 3. Remplissage
    const titleInput = await driver.wait(until.elementLocated(By.id('title')), 10000);
    await titleInput.sendKeys('Tâche Selenium 2026');
    await driver.findElement(By.id('description')).sendKeys('Test automatisé réussi');

    // 4. Validation (Bouton Créer)
    const submitButton = await driver.findElement(By.xpath("//button[text()='Créer']"));
    await submitButton.click();

    // 5. Vérification finale
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Tâche Selenium 2026')]")), 15000);

    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Tâche Selenium 2026'));
  });
});