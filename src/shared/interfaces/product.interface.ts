export interface ProductBaseInterface {
  title: string,
  price: number,
  description: string,
  images: string[]
  category: string
}

export interface ProductInterface extends ProductBaseInterface{
  id: number,

}

export interface ProductFormInterface extends ProductBaseInterface{
  // rien à afficher
}
