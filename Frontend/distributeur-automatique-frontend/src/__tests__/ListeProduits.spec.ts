import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ListeProduits from '@/components/'
const produitsMock = [
  { id: 1, nom: 'Chips', prix: 10, achetable: true, quantite: 5 },
  { id: 2, nom: 'Soda', prix: 8, achetable: false, quantite: 3 },
  { id: 3, nom: 'Eau', prix: 5, achetable: false, quantite: 0 }
]

describe('ListeProduits.vue', () => {
  it('affiche tous les produits', () => {
    const wrapper = mount(ListeProduits, {
      props: { produits: produitsMock }
    })

    const produitsAffiches = wrapper.findAll('.produit')
    expect(produitsAffiches.length).toBe(produitsMock.length)
  })

  it('affiche nom et prix correctement', () => {
    const wrapper = mount(ListeProduits, {
      props: { produits: produitsMock }
    })

    produitsMock.forEach((produit) => {
      expect(wrapper.text()).toContain(produit.nom)
      expect(wrapper.text()).toContain(`${produit.prix} MAD`)
    })
  })

  it('ajoute la classe "non-disponible" pour les produits non achetables', () => {
    const wrapper = mount(ListeProduits, {
      props: { produits: produitsMock }
    })

    const produits = wrapper.findAll('.produit')
    expect(produits[1].classes()).toContain('non-disponible')
    expect(produits[2].classes()).toContain('non-disponible')
  })

  it('affiche "Solde insuffisant" quand le produit est non achetable mais en stock', () => {
    const wrapper = mount(ListeProduits, {
      props: { produits: produitsMock }
    })

    expect(wrapper.text()).toContain('Solde insuffisant')
  })

  it('affiche "Épuisé" quand le produit est non achetable et hors stock', () => {
    const wrapper = mount(ListeProduits, {
      props: { produits: produitsMock }
    })

    expect(wrapper.text()).toContain('Épuisé')
  })

  it('émet "ajouter-panier" quand un produit achetable est cliqué', async () => {
    const wrapper = mount(ListeProduits, {
      props: { produits: produitsMock }
    })

    const premierProduit = wrapper.findAll('.produit')[0]
    await premierProduit.trigger('click')

    expect(wrapper.emitted()['ajouter-panier']).toBeTruthy()
    expect(wrapper.emitted()['ajouter-panier']![0]).toEqual([1])
  })

  it('n’émet rien quand un produit non achetable est cliqué', async () => {
    const wrapper = mount(ListeProduits, {
      props: { produits: produitsMock }
    })

    const produitNonAchetable = wrapper.findAll('.produit')[1]
    await produitNonAchetable.trigger('click')

    expect(wrapper.emitted()['ajouter-panier']).toBeFalsy()
  })
})
