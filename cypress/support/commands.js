/**
 * конфиг авторизации
 */
const authConfig = require("./authConfig.json");

/**
 * конфиг для тестов из презентации
 */
const lessonConfig = require("./lessonBookApp.config.json");

/**
 * конфиг для основных тестов
 */
const config = require("./test.config.json");

/**
 * ввести текст в указанный инпут
 * 
 * @param {string} selector - селектор инпута
 * @param {string} text     - текст для ввода в инпут
 */
const typeText = (selector, text) => {
    getElement(selector).type(text);
};

/**
 * кликнуть на указанный селектор
 * 
 * @param {string}  selector - селектор инпута
 * @param {boolean} double   - двойной клик?
 */
const click = (selector, double = false) => {
    let el = getElement(selector);
    double ? el.dblclick() : el.click();
};

/**
 * получить элемент по селектору
 * 
 * @param {string} selector - селектор
 * 
 * @returns {HTMLElement}
 */
const getElement = (selector) => {
    return /^(\.|\#|h2)(.+)?/.test(selector)
        ? cy.get(selector)
        : cy.contains(selector);
};

/**
 * получить рандомную строку длины length
 * 
 * @param {int} length - длина строки
 * 
 * @returns {string}
 */
const getRandomString = (length) => {
    let randomstring = require("randomstring");
    return randomstring.generate({
        length: length,
        readable: true,
        charset: 'alphabetic'
    });
};

/**
 * возвращает данные для записи в файл
 * 
 * @param {int} count - кол-во тестовых данных
 * 
 * @returns {Array}
 */
const getTestData = async function (count) {
    let data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            "title": getRandomString(35),
            "description": getRandomString(50),
            "authors": getRandomString(25)
        });
    }
    return data;
};

/**
 * авторизоваться на сайте
 * 
 * @param {boolean} success - успешная ли авторизация
 */
const login = (success = true) => {
    click(lessonConfig.loginButtonText);
    typeText(lessonConfig.loginInput, authConfig.login);
    if (success) {
        typeText(lessonConfig.passInput, authConfig.password);
    }
    click(lessonConfig.submitButtonText);
};

/**
 * проверка селектора на видимость
 * 
 * @param {string} selector - селектор
 */
const checkVisibility = (selector) => {
    getElement(selector).should("be.visible");
}

/**
 * проверить валидность ввода пароля
 * 
 * @returns {boolean}
 */
const getPassValidity = () => {
    return getElement(lessonConfig.passInput)
        .then(el => el[0].checkValidity());
};

/**
 * добавить новую книгу
 * 
 * @param {string}  title       - название книги
 * @param {string}  description - описание книги
 * @param {string}  authors     - авторы книги
 * @param {boolean} favorite    - добавить книгу в избранное
 */
const addNewBook = (title, description, authors, favorite = false) => {
    click(config.selectors.addBook.addBookButtonText);
    getElement(config.selectors.addBook.formTitle).should("be.visible");
    typeText(config.selectors.addBook.inputTitle, title);
    typeText(config.selectors.addBook.inputDescription, description);
    typeText(config.selectors.addBook.inputAuthors, authors);
    if (favorite) {
        click(config.selectors.addBook.inputFavotite, true);
    }
    click(config.selectors.addBook.submitButtonText);
};

/**
 * проверка добаленной книги
 * 
 * @param {string}  title       - название книги
 * @param {string}  description - описание книги
 * @param {string}  authors     - авторы книги
 */
const checkBookCorrectAdd = (title, description, authors) => {
    click(title);
    let h2 = getElement(config.selectors.bookPage.bookTitle);
    h2.should('have.text', title);
    let descriptionBlock = h2.next();
    descriptionBlock.should('have.text', description);
    let authorsBlock = descriptionBlock.next();
    authorsBlock.should('have.text', authors);
};

/**
 * добавить/удалить книгу в избранное
 * 
 * @param {string}  title - название книги
 * @param {boolean} add   - добавить?
 */
const toggleBookToFavorite = (title, add) => {
    let selector = add
        ? config.selectors.bookList.addFavButton
        : config.selectors.bookList.delFavButton;
    getElement(title)
        .closest(config.selectors.bookList.bookItemBlock)
        .find(selector)
        .click();
};

/**
 * перейти на страницу "избранное"
 */
const visitFavorites = () => {
    cy.visit("/favorites");
};

/**
 * проверить наличие книги в избранном
 * 
 * @param {string}  title      - название книги
 * @param {boolean} needExists - необходимо ли наличие?
 */
const checkInFavorites = (title, needExists = true) => {
    let condition = needExists ? "exist" : "not.exist"; 
    getElement(title).should(condition);
};

Cypress.Commands.addAll({
    login,
    checkVisibility,
    getPassValidity,
    addNewBook,
    checkBookCorrectAdd,
    toggleBookToFavorite,
    getTestData,
    visitFavorites,
    checkInFavorites
});