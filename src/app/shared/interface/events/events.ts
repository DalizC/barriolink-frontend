import { SafeHtml } from '@angular/platform-browser';

export interface IAttendee {
    id: number;
    name: string;
    email: string;
    phone: string;
    registered_date: string;
    status: string;
}

export interface IRecentOrders {
    id: number;
    product_name: SafeHtml;
    product_image: string;
    product_id: string;
    customer_name: string;
    quantity: number;
    total_price: string;
    order_date: string;
    status: SafeHtml;
    status_color: string;
    category: string;
    description?: string;
    attendees?: IAttendee[];
}