export interface Product {
	id: string;
	name: string;
	price: number;
	categories: string[];
	inStock: boolean; // In stock or out of stock (true or false
	stock?: number;  // Number of items in stock
	images?: string[]; 
	description?: string;
	sku?: string;   // Stock Keeping Unit (specific to each product)
	slug?: string;  // URL name to product
	categorySlug?: string; // URL name to category
	features?: string[]; // List of features
	compatibility?: string[]; // List of compatible products
	specifications?: {}; // Key-value pairs of product specifications
  }
  
  export interface Category {
	id: string;
	name: string;
	slug: string;
  }


  export interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	createdAt: string;
	updatedAt?: string;
	totalOrders?: number;
  }

  export interface Order {
	id: string;
	orderNumber: string;
	customerName: string;
	total: number;
	status: string;
	date: string;
	email?: string;
	items?: number;
  }


export interface Cart {
	product: Product;
	totalItems: number;
  	totalAmount: number;
}

  