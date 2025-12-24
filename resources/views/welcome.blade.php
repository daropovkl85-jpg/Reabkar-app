@extends('layouts.app')

@section('content')
<div class="container py-5">
    <div class="text-center mb-5">
        <h1 class="fw-bold text-primary">KHQR Demo Shop</h1>
        <p class="text-muted">Select a product to pay with Bakong KHQR</p>
    </div>

    <div class="row justify-content-center">
        @foreach($products as $product)
            <div class="col-md-4 col-sm-6 mb-4">
                <div class="card h-100 shadow-sm border-0">
                    <img src="{{ $product->image }}" class="card-img-top p-3" alt="{{ $product->name }}" style="height: 250px; object-fit: contain;">
                    <div class="card-body text-center">
                        <h5 class="card-title fw-bold">{{ $product->name }}</h5>
                        <p class="card-text text-muted">{{ $product->description }}</p>
                        <h4 class="text-success my-3">${{ number_format($product->price, 2) }}</h4>
                        
                        <a href="{{ route('checkout', $product->id) }}" class="btn btn-primary w-100 rounded-pill">
                            Buy Now
                        </a>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</div>
@endsection