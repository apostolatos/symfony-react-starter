<?php

namespace App\Tests\Util;

use App\Util\Api;
use PHPUnit\Framework\TestCase;

class ResultsTest extends TestCase
{
    public function testCall()
    {
        $api = new Api();

        $statusCode = $api->call('AAPL', '2003-01-01', '2003-03-06');

        // assert that your api call result correctly!
        $this->assertEquals(200, $statusCode);
    }
}