<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RiebkearController extends Controller
{
    public function index()
    {
        return view('riebkear.index');
    }
}