<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthController extends AbstractController
{
    #[Route('/api/auth/signin', name: 'api_auth_signin', methods: ['POST'])]
    public function signin(UserInterface $user, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $token = $jwtManager->create($user);

        return new JsonResponse([
            'token' => $token,
            'user_data' => [
                'user_id' => $user->getId(),
                'username' => $user->getUsername(),
            ],
        ]);
    }
}