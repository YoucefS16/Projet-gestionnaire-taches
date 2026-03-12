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
    await driver.get('http://localhost:3000/login');

    // 1. Connexion
    await driver.wait(until.elementLocated(By.id('email')), 10000);
    await driver.findElement(By.id('email')).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 2. Attendre qu'on ne soit plus sur /login
    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      return !currentUrl.includes('/login');
    }, 15000);

    // 3. Attendre le bouton "Nouvelle Tâche" avec sélecteur plus souple
    const newTaskBtn = await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(., 'Nouvelle') and contains(., 'Tâche')]")
      ),
      15000
    );
    await driver.wait(until.elementIsVisible(newTaskBtn), 10000);
    await driver.wait(until.elementIsEnabled(newTaskBtn), 10000);
    await newTaskBtn.click();

    // 4. Remplissage
    const titleInput = await driver.wait(until.elementLocated(By.id('title')), 10000);
    await titleInput.clear();
    await titleInput.sendKeys('Tâche Selenium 2026');

    const descriptionInput = await driver.findElement(By.id('description'));
    await descriptionInput.clear();
    await descriptionInput.sendKeys('Test automatisé réussi');

    // 5. Validation
    const submitButton = await driver.findElement(
      By.xpath("//button[contains(., 'Créer')]")
    );
    await submitButton.click();

    // 6. Vérification finale
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(., 'Tâche Selenium 2026')]")),
      15000
    );

    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Tâche Selenium 2026'));
  });
});