<?php

namespace App\Traits;

trait ApiResponses
{
    protected function ok($message, $data = []) {
        return $this->success($message, $data, 200);
    }

    protected function success($message, $data = [], $statusCode = 200) {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
            'status' => $statusCode
        ], $statusCode);
    }

    protected function error($message, $statusCode = 600) {
        return response()->json([
            'success' => false,
            'error' => $message,
            'status' => $statusCode
        ], $statusCode);
    }
}
    