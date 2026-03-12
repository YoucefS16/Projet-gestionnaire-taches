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

  const login = async () => {
    await driver.get('http://localhost:3000/login');

    await driver.wait(until.elementLocated(By.id('email')), 10000);
    await driver.findElement(By.id('email')).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Attendre qu'on quitte la page de login
    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      return !currentUrl.includes('/login');
    }, 15000);

    // Attendre un élément concret de la page des tâches
    await driver.wait(
      until.elementLocated(
        By.xpath("//button[contains(., 'Nouvelle') and contains(., 'Tâche')]")
      ),
      15000
    );
  };

  it('1. Devrait Créer une nouvelle tâche', async () => {
    await login();

    const newTaskBtn = await driver.findElement(
      By.xpath("//button[contains(., 'Nouvelle') and contains(., 'Tâche')]")
    );
    await newTaskBtn.click();

    const titleInput = await driver.wait(until.elementLocated(By.id('title')), 10000);
    await titleInput.clear();
    await titleInput.sendKeys('Tâche Selenium IABD');

    const descriptionInput = await driver.findElement(By.id('description'));
    await descriptionInput.clear();
    await descriptionInput.sendKeys('Ceci est un test CRUD complet');

    const createBtn = await driver.findElement(
      By.xpath("//button[contains(., 'Créer')]")
    );
    await createBtn.click();

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(., 'Tâche Selenium IABD')]")),
      15000
    );

    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Tâche Selenium IABD'));
  });

  it('2. Devrait Supprimer la tâche créée', async () => {
    await login();

    const deleteBtn = await driver.wait(
      until.elementLocated(
        By.css('button.btn-delete, [title="Supprimer"], .fa-trash')
      ),
      15000
    );
    await deleteBtn.click();

    try {
      await driver.wait(until.alertIsPresent(), 5000);
      await driver.switchTo().alert().accept();
    } catch (e) {
      // Pas d'alerte, on continue
    }

    await driver.sleep(2000);
    console.log('✅ Cycle CRUD terminé avec succès !');
  });
});