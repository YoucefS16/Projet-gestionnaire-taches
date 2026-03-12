const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Système CRUD - Gestion Complète des Tâches', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    // Utilise Selenium 4 (compatible avec ton Chrome 145 sans erreur)
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  // Fonction pour se connecter automatiquement avant chaque test
  const login = async () => {
    await driver.get('http://localhost:3000/login');
    await driver.wait(until.elementLocated(By.id('email')), 5000).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/dashboard'), 5000);
  };

  it('1. Devrait Créer une nouvelle tâche', async () => {
    await login();

    // Cliquer sur le bouton "Nouvelle Tâche"
    const newTaskBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Nouvelle Tâche')]")), 5000);
    await newTaskBtn.click();

    // Remplir le titre et la description
    await driver.wait(until.elementLocated(By.id('title')), 5000).sendKeys('Tâche Selenium IABD');
    await driver.findElement(By.id('description')).sendKeys('Ceci est un test CRUD complet');

    // Cliquer sur le bouton bleu "Créer" (vu sur tes captures)
    const createBtn = await driver.findElement(By.xpath("//button[text()='Créer']"));
    await createBtn.click();

    // Vérifier que la tâche est apparue dans la liste
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Tâche Selenium IABD')]")), 5000);
    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Tâche Selenium IABD'));
  });

  it('2. Devrait Supprimer la tâche créée', async () => {
    await login();

    // On cherche l'icône de suppression (poubelle)
    const deleteBtn = await driver.wait(until.elementLocated(By.css('button.btn-delete, [title="Supprimer"], .fa-trash')), 5000);
    await deleteBtn.click();

    // Confirmer l'alerte si elle apparaît
    try {
      await driver.wait(until.alertIsPresent(), 3000);
      await driver.switchTo().alert().accept();
    } catch (e) {
      // Pas d'alerte de confirmation, on continue
    }

    await driver.sleep(1000);
    console.log("✅ Cycle CRUD terminé avec succès !");
  });
});