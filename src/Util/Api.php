<?php

// src/Util/Api.php
namespace App\Util;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class Api extends WebTestCase
{
    public function call($symbol, $start, $end)
    {
        $client = static::createClient();

        $client->request('GET', 'https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json?order=asc&start_date=2003-01-01&end_date=2003-03-06&api_key=iDWmbL8gkNcE4jEakZVu');
    
        return $client->getResponse()->getStatusCode();
    }
}
