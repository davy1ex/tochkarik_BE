<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthController extends AbstractController
{
    #[Route('/api/auth/signin', name: 'api_auth_signin', methods: ['POST'])]
    public function signin(UserInterface $user, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $token = $jwtManager->create($user);

        // Логирование данных токена для отладки
        $decodedToken = $jwtManager->decode($token);
        dump($decodedToken); // Проверьте данные токена

        return new JsonResponse(['token' => $token]);
    }
}
