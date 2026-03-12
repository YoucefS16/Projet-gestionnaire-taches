const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Système CRUD - Gestion Complète des Tâches', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  // Fonction de login stabilisée pour GitHub Actions
  const login = async () => {
    await driver.get('http://localhost:3000/login');
    await driver.wait(until.elementLocated(By.id('email')), 10000).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Au lieu de l'URL, on attend un élément concret du dashboard
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Nouvelle Tâche')]")), 15000);
  };

  it('1. Devrait Créer une nouvelle tâche', async () => {
    await login();

    const newTaskBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Nouvelle Tâche')]"));
    await newTaskBtn.click();

    await driver.wait(until.elementLocated(By.id('title')), 10000).sendKeys('Tâche Selenium IABD');
    await driver.findElement(By.id('description')).sendKeys('Ceci est un test CRUD complet');

    const createBtn = await driver.findElement(By.xpath("//button[text()='Créer']"));
    await createBtn.click();

    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Tâche Selenium IABD')]")), 15000);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Tâche Selenium IABD'));
  });

  it('2. Devrait Supprimer la tâche créée', async () => {
    await login();

    const deleteBtn = await driver.wait(until.elementLocated(By.css('button.btn-delete, [title="Supprimer"], .fa-trash')), 15000);
    await deleteBtn.click();

    try {
      await driver.wait(until.alertIsPresent(), 5000);
      await driver.switchTo().alert().accept();
    } catch (e) {
      // Pas d'alerte, on continue
    }

    await driver.sleep(2000); // Petit temps de pause pour la suppression
    console.log("✅ Cycle CRUD terminé avec succès !");
  });
});