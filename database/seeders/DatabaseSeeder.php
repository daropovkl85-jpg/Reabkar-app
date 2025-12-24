<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // បង្កើត User សម្រាប់ Test (បើចង់)
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // បង្កើតផលិតផលទី ១
        Product::create([ 
            'name' => 'iPhone 17 Pro', 
            'description' => '128GB, Blue Titanium', 
            'price' => 200, 
            'image' => 'https://i.ebayimg.com/images/g/EDEAAeSwLb9owuv8/s-l1600.webp' 
        ]); 

        // បង្កើតផលិតផលទី ២ (កែសម្រួល Link ឱ្យនៅបន្ទាត់តែមួយ)
        Product::create([ 
            'name' => 'AirPods Pro 3', 
            'description' => 'Wireless earphones with noise cancelling', 
            'price' => 150, 
            'image' => 'https://sm.mashable.com/t/mashable_sea/article/a/apple-airpods-pro-3-every-single-thing-we-know-so-far/uj6k.1248.jpg' 
        ]); 
    }
}