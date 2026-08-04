<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

/**
 * Mirrors src/data/menuData.js in the React frontend 1:1 (same order,
 * so ids line up and useMenuItems.js merges local photo paths onto
 * these rows by matching `name`).
 */
class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Garden Omelette', 'category' => 'breakfast', 'price' => 6, 'description' => 'Farm eggs, herbs, roasted tomato.', 'featured' => false],
            ['name' => 'Smoked Salmon Toast', 'category' => 'breakfast', 'price' => 9, 'description' => 'Sourdough, cream cheese, dill.', 'featured' => false],
            ['name' => 'Margherita Pizza', 'category' => 'lunch', 'price' => 10, 'description' => 'San Marzano tomato, fior di latte, basil.', 'featured' => true],
            ['name' => 'Ember Burger', 'category' => 'lunch', 'price' => 8, 'description' => 'Smoked cheddar, charred onion, pickle.', 'featured' => true],
            ['name' => 'Wild Mushroom Pasta', 'category' => 'lunch', 'price' => 13, 'description' => 'Fresh tagliatelle, thyme, parmesan.', 'featured' => true],
            ['name' => 'Charred Ribeye Steak', 'category' => 'dinner', 'price' => 24, 'description' => 'Rosemary butter, roasted garlic.', 'featured' => true],
            ['name' => 'Whole Grilled Fish', 'category' => 'dinner', 'price' => 19, 'description' => 'Lemongrass, chili, lime butter.', 'featured' => false],
            ['name' => 'Slow Roasted Lamb', 'category' => 'dinner', 'price' => 26, 'description' => 'Garden herbs, smoked jus.', 'featured' => false],
            ['name' => 'Ash Chocolate Tart', 'category' => 'dessert', 'price' => 7, 'description' => 'Dark chocolate, sea salt, smoked cream.', 'featured' => true],
            ['name' => 'Grilled Pineapple', 'category' => 'dessert', 'price' => 6, 'description' => 'Palm sugar, coconut cream.', 'featured' => false],
            ['name' => 'Vine Coffee', 'category' => 'drink', 'price' => 3, 'description' => 'Single origin, roasted weekly in-house.', 'featured' => true],
            ['name' => 'Garden Iced Tea', 'category' => 'drink', 'price' => 4, 'description' => 'Lemongrass, mint, honey.', 'featured' => false],
            ['name' => 'Seafood Paella', 'category' => 'seafood', 'price' => 23, 'description' => 'Saffron rice, mussels, shrimp, chorizo.', 'featured' => true, 'photo_url' => 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=500&h=360&fit=crop&auto=format&q=80'],
            ['name' => "Chef's Grilled Platter", 'category' => 'specialty', 'price' => 29, 'description' => 'Mixed skewers off the open flame, chef\'s choice sauce.', 'featured' => true, 'photo_url' => 'https://images.unsplash.com/photo-1767974968707-db3d448d4ef3?w=500&h=360&fit=crop&auto=format&q=80'],
            ['name' => 'Blueberry Cheesecake', 'category' => 'dessert', 'price' => 8, 'description' => 'Baked cheesecake, blueberry compote, graham crust.', 'featured' => false, 'photo_url' => 'https://images.unsplash.com/photo-1702925614886-50ad13c88d3f?w=500&h=360&fit=crop&auto=format&q=80'],
            ['name' => 'Espresso Martini', 'category' => 'drink', 'price' => 10, 'description' => 'Vodka, fresh espresso, coffee liqueur.', 'featured' => false, 'photo_url' => 'https://images.unsplash.com/photo-1678261738794-163c056a1d6f?w=500&h=360&fit=crop&auto=format&q=80'],
            ['name' => 'Buttermilk Pancakes', 'category' => 'breakfast', 'price' => 8, 'description' => 'Stacked high, maple syrup, whipped butter.', 'featured' => false, 'photo_url' => 'https://images.unsplash.com/photo-1671522636384-abaa828ec275?w=500&h=360&fit=crop&auto=format&q=80'],
            ['name' => 'Caprese Salad', 'category' => 'lunch', 'price' => 9, 'description' => 'Heirloom tomato, buffalo mozzarella, basil.', 'featured' => false, 'photo_url' => 'https://images.pexels.com/photos/11725599/pexels-photo-11725599.jpeg?auto=compress&cs=tinysrgb&w=500&h=360&fit=crop'],
        ];

        foreach ($items as $item) {
            MenuItem::updateOrCreate(['name' => $item['name']], $item);
        }
    }
}
