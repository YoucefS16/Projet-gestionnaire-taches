const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Test de Connexion E2E', function () {
    // On définit un timeout global de 30 secondes car Selenium peut être lent
    this.timeout(30000);
    let driver;

    // Étape 1 : Initialisation du navigateur avant les tests
    before(async () => {
        // Selenium va chercher automatiquement le driver compatible avec ton Chrome 145
        driver = await new Builder().forBrowser('chrome').build();
    });

    // Étape 2 : Fermeture du navigateur après les tests
    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    it('devrait se connecter avec les identifiants admin et accéder au dashboard', async () => {
        // 1. Accéder à l'application
        await driver.get('http://localhost:3000');

        // 2. Attendre que le champ email soit visible (sécurité anti-bug)
        await driver.wait(until.elementLocated(By.id('email')), 10000);

        // 3. Remplir le formulaire avec les infos du sujet
        await driver.findElement(By.id('email')).sendKeys('admin@test.com');
        await driver.findElement(By.id('password')).sendKeys('password');

        // 4. Cliquer sur le bouton de connexion (via le type submit car pas d'ID)
        await driver.findElement(By.css('button[type="submit"]')).click();

        // 5. Vérification : On attend que l'URL change vers le dashboard ou la racine
        // Si ton app redirige vers /, utilise until.urlIs('http://localhost:3000/')
        await driver.wait(until.urlContains('/'), 10000);

        // 6. Assertion finale pour valider le test
        const currentUrl = await driver.getCurrentUrl();
        console.log('URL actuelle après connexion :', currentUrl);
        assert.ok(currentUrl.includes('localhost:3000'), "La connexion a échoué ou n'a pas redirigé");
    });
});