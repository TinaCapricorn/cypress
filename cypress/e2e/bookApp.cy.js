describe('Tests', () => {
    /**
     * @var {Array} - книги для тестов
     */
    let books;

    before(() => {
        cy.getTestData(2).then((data) => {
            console.log(data);
            books = data;
        });
    });

    beforeEach(() => {
        cy.visit("/");
        cy.login();
    });

    it('Add new book and book data equals to added data', () => {
        let bookData = Object.values(books[0]);
        cy.addNewBook(...bookData);
        cy.checkBookCorrectAdd(...bookData);
    });

    it('Add book to favorite and book exist in favorites', () => {
        let book = books[0];
        cy.wait(1500);
        cy.toggleBookToFavorite(book.title, true);
        cy.visitFavorites();
        cy.checkInFavorites(book.title);
    });

    it('Delete book from favorite and book not exist in favorites', () => {
        let book = books[0];
        cy.visitFavorites();
        cy.wait(1500);
        cy.toggleBookToFavorite(book.title, false);
        cy.checkInFavorites(book.title, false);
    });

    it('Add new book with check "add to favorite" and book exists in favorites and book data equals to added data', () => {
        let book = books[1],
            bookData = Object.values(book);
        cy.addNewBook(...Object.values(bookData), true);
        cy.visitFavorites();
        cy.wait(1500);
        cy.checkInFavorites(book.title);
        cy.checkBookCorrectAdd(...bookData);
    });
});