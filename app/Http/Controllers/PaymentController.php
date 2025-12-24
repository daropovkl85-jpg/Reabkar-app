<?php 

namespace App\Http\Controllers; 

use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Log; 
use App\Models\Product; 
use App\Models\Payment; 

// KHQR Libraries
use KHQR\BakongKHQR; 
use KHQR\Helpers\KHQRData; 
use KHQR\Models\IndividualInfo;

// QRCode Library
use SimpleSoftwareIO\QrCode\Facades\QrCode; 

class PaymentController extends Controller 
{ 
    public function index()
    {
        $products = Product::all();
        return view('welcome', compact('products'));
    }

    // =========================================================
    // API សម្រាប់បង្កើត QR (ដាក់កូដពេញលេញនៅទីនេះ)
    // =========================================================
    public function apiGenerateQr(Request $request)
    {
        // 1. Log ទិន្នន័យមើល (មើលក្នុង storage/logs/laravel.log)
        Log::info('QR Request:', $request->all());

        // 2. Validate
        $request->validate([
            'amount'   => 'required', 
            'currency' => 'required', 
        ]);

        try {
            // 3. កំណត់រូបិយប័ណ្ណ
            $reqCurrency = strtoupper($request->currency);
            $currencyType = ($reqCurrency == 'KHR') 
                            ? KHQRData::CURRENCY_KHR 
                            : KHQRData::CURRENCY_USD;

            // 4. កំណត់ Merchant Info
            $merchant = new IndividualInfo(
                bakongAccountID: 'daro_pov@bkrt', // <--- ពិនិត្យ ID នេះ
                merchantName: 'Reabkar',    
                merchantCity: 'Phnom Penh',
                currency: $currencyType,          
                amount: (float) $request->amount 
            );

            // 5. Generate KHQR String
            $qrResponse = BakongKHQR::generateIndividual($merchant);

            if (!isset($qrResponse->data['qr'])) {
                throw new \Exception('KHQR generation failed');
            }

            // 6. Generate QR Image (SVG)
            $qrImage = QrCode::size(250)->generate($qrResponse->data['qr']);

            // 7. Return JSON
            return response()->json([
                'status'    => 'success',
                'qr_string' => $qrResponse->data['qr'], 
                'qr_image'  => (string)$qrImage,        
                'md5'       => $qrResponse->data['md5'],
                'currency'  => $reqCurrency
            ]);

        } catch (\Exception $e) {
            Log::error('QR Failed: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // ៤. Function ផ្ទៀងផ្ទាត់ការទូទាត់ (ប្រើរួមគ្នាទាំង Shop និង Riebkear)
    public function verifyTransaction(Request $request) 
    { 
        $request->validate([ 
            'md5' => 'required|string', 
        ]); 
 
        try { 
            $token = env('BAKONG_TOKEN'); 
            
            if (!$token) {
                return response()->json(['responseCode' => 1, 'message' => 'Bakong Token not found in .env'], 500);
            }

            $bakong = new \KHQR\BakongKHQR($token); 
            $result = $bakong->checkTransactionByMD5($request->md5); 
 
            return response()->json($result); 
            
        } catch (\Exception $e) { 
            return response()->json(['error' => $e->getMessage()], 500); 
        } 
    } 

}