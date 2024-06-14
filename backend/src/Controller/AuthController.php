<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    #[Route('/api/user/check_token', name: 'api_check_token', methods: ['GET'])]
    public function checkToken()
    {
        return new JsonResponse(['status' => 'Token is valid']);
    }
}