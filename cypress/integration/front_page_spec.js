import { cyan } from "ansi-colors"

describe('The Front Page', () => {

    it('successfully loads', () => {
        cy.visit("/");
    })

    it('correctly handles search terms', () => {
        cy.contains('Search')

        cy.get('input').type('react loop')
            .should('have.value', 'react loop')
        
        cy.url().should('include', 'query=react%20loop')
    })

    it('results displayed should match search term in title', () => {
        cy.get('input').clear()    
        cy.get('input').type('suspense')
        cy.get('ol>li').each(($el) => {
            cy.log($el)
            cy.wrap($el).contains(/suspense/i);
        })        
    })

    it('results displayed should match search term in conference', () => {
        cy.get('input').clear()    
        cy.get('input').type('react loop')
        cy.get('ol>li').each(($el) => {
            cy.wrap($el).contains(/react loop/i);
        })        
    })

    it.skip('results displayed should match search term in Speaker', () => {
        cy.get('input').clear()    
        cy.get('input').type('dan abramov')
        cy.log('at start of test')
        cy.get('ol>li').each(($el) => {
            cy.wrap($el).contains(/dan abramov/i);
        })                    
    })
})