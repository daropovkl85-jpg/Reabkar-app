@extends('layouts.app') 
 
@section('content') 
    <div class="container text-center"> 
        <h1>Scan KHQR to Pay</h1> 
        <p><strong>{{ $product->name }}</strong> — {{ number_format($product->price, 
2) }} $</p> 
 
        @if ($qr) 
            {!! SimpleSoftwareIO\QrCode\Facades\QrCode::size(300)->generate($qr) !!}
            <p class="mt-3">MD5: {{ $md5 }}</p> 
            <p class="text-muted">Scan this QR code using Bakong App to make a 
payment.</p> 
        @else 
            <p class="alert alert-danger">⚠ Failed to generate KHQR.</p> 
        @endif 
 
        {{-- Countdown Timer --}} 
        <div class="mt-4"> 
            <h3 id="countdown" class="text-danger fw-bold">120</h3> 
            <p class="text-muted">This page will expire in <span 
id="seconds">120</span> seconds.</p> 
        </div> 
 
        <a href="{{ route('home') }}" class="btn btn-secondary mt-4">Back to Shop</a> 
    </div> 
 
    {{-- Countdown Script --}} 
    <script> 
        let timeLeft = 120; // seconds 
        const countdownElement = document.getElementById('countdown'); 
        const secondsText = document.getElementById('seconds'); 
 
        const timer = setInterval(() => { 
            timeLeft--; 
            countdownElement.textContent = timeLeft; 
            secondsText.textContent = timeLeft; 
            if (timeLeft > 0) { 
                fetch("{{ route('verify.transaction') }}", { 
                        method: "POST", 
                        headers: { 
                            "Content-Type": "application/json", 
                            "X-CSRF-TOKEN": "{{ csrf_token() }}" 
                        }, 
                        body: JSON.stringify({ 
                            md5: "{{ $md5 }}" 
                        }) 
                    }) 
                    .then(response => response.json()) 
                    .then(data => { 
                        console.log(data); 
                        if (data.responseCode === 0) { 
                            clearInterval(timer); 
                            alert("Transaction successful!"); 
                            window.location.href = "{{ route('home') }}"; 
                        } else if (data.failed) { 
                            alert("Transaction failed. Please try again."); 
                        } 
                    }) 
                    .catch(error => console.error('Error:', error)); 
            } 
            if (timeLeft <= 0) { 
                clearInterval(timer); 
                window.location.href = "{{ route('home') }}"; 
            } 
        }, 1000); 
    </script> 
@endsection