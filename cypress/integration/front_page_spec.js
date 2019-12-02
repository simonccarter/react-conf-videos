describe('The Front Page', () => {

    const search = input => {
        cy.get('input').clear()    
        cy.get('input').type(input)
        cy.get('[data-cy=search-input]').should('have.focus')
        cy.wait(50)
    }

    const checkResultsMatchesSearchTerm = input => {
        const regex = new RegExp(input, "i")
        cy.get('[data-cy=results-list] > [data-cy=result]').each(($el) => {
            cy.wrap($el).contains(regex);
        })     

        cy.location().should((location) => {
            cy.log(location)
        })
    }
    
    const frontPagePathnames = ['', '/', '/search']
    frontPagePathnames.forEach(pathname => {
        it(`successfully loads on front page when using ${pathname}`, () => {
            cy.visit(pathname);
            cy.location('pathname').then((result) => {
                expect(result).to.eq('/search')
            })
        })
    })


    it('correctly handles search terms', () => {
        cy.contains('Search')
        cy.get('input').type('react loop')
            .should('have.value', 'react loop')        
        cy.url().should('include', 'query=react%20loop')
    })

    const searchTests = {
        'results displayed should match search term in title' : 'suspense',
        'results displayed should match search term in conference': 'react loop',
        'results displayed should match search term in speaker': 'dan abramov'
    }

    Object.keys(searchTests).forEach(test => {
        it(test, () => {
            search(searchTests[test])
            checkResultsMatchesSearchTerm(searchTests[test])
        })
    })

    it('should navigate to the correct conference page', () => {
        search('react loop')
        cy.get('[data-cy=results-list] > :nth-child(1) a').first().click()
        cy.url().should('include', 'conference/react-loop-2019')
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/conference/react-loop-2019')
        })
    })   
})