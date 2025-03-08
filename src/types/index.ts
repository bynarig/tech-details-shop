export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
	inStock: boolean;
	rating: number;
  }
  
  export interface Category {
	id: string;
	name: string;
	slug: string;
  }