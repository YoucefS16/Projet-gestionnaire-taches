const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert'); // Pas besoin de require('chromedriver') ici

describe('Création de tâche - Test E2E', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    // Version moderne qui évite les erreurs de version Chrome
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('doit permettre de créer une nouvelle tâche', async () => {
    await driver.get('http://localhost:3000');

    // 1. Connexion
    await driver.wait(until.elementLocated(By.id('email')), 5000).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    // 2. Navigation vers le dashboard
    await driver.wait(until.urlContains('/dashboard'), 5000);

    // 3. Clic sur le bouton (Le texte "Nouvelle Tâche" est sur ton écran, donc ça marchera)
    const newTaskBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Nouvelle Tâche')]")),
      5000
    );
    await newTaskBtn.click();

    // 4. Remplissage (Vérifie bien que les IDs 'title' et 'description' existent !)
    const titleInput = await driver.wait(until.elementLocated(By.id('title')), 5000);
    await titleInput.sendKeys('Tâche Selenium 2026');

    await driver.findElement(By.id('description')).sendKeys('Test automatisé réussi');

    // 5. Soumission (Le bouton bleu "Créer" sur ta photo)
    // On utilise le texte "Créer" car c'est ce qui est écrit sur ton bouton bleu
    const submitButton = await driver.findElement(By.xpath("//button[text()='Créer']"));
    await submitButton.click();

    // 6. Vérification finale
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Tâche Selenium 2026')]")), 5000);

    const pageSource = await driver.getPageSource();
    assert.ok(pageSource.includes('Tâche Selenium 2026'));
  });
});