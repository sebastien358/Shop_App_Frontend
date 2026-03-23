export interface CartProductBaseInterface {
  title: string
  price: number
  quantity: number
}

export interface CartProductInterface extends CartProductBaseInterface{
  id: number
}

export interface CartItemInterface extends CartProductBaseInterface {
  //rien à ajouter
}
