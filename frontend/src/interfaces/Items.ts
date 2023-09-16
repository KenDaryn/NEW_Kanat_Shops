export interface Items extends Item {
    name: string;
	id: number;
	create_date: string;
	available_qty: number;
}

export interface Item {
	item_name: string;
	item_description: string;
	price: number;
	id_category: string;
	id_subcategory: string;
	image: string;
	id_user: number;
}
