<?php

namespace App\Controller;

use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\InvalidArgumentException;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class TokenController extends AbstractController
{
    private $refreshTokenManager;
    private $jwtManager;
    private $userProvider;

    public function __construct(
        RefreshTokenManagerInterface $refreshTokenManager,
        JWTTokenManagerInterface     $jwtManager,
        UserProviderInterface        $userProvider
    )
    {
        $this->refreshTokenManager = $refreshTokenManager;
        $this->jwtManager = $jwtManager;
        $this->userProvider = $userProvider;
    }

    #[Route('/api/token/refresh', name: 'api_token_refresh', methods: ['POST'])]
    public function refresh(Request $request): JsonResponse
    {
        $refreshToken = $request->request->get('refresh_token');

        if (!$refreshToken) {
            $data = json_decode($request->getContent(), true);
            $refreshToken = $data['refresh_token'] ?? null;
        }

        if (!$refreshToken) {
            throw new InvalidArgumentException('No refresh token provided');
        }

        $refreshTokenObject = $this->refreshTokenManager->get($refreshToken);

        if (!$refreshTokenObject || !$refreshTokenObject->isValid()) {
            throw new InvalidArgumentException('Invalid or expired refresh token');
        }

        $user = $this->userProvider->loadUserByIdentifier($refreshTokenObject->getUsername());

        $newAccessToken = $this->jwtManager->create($user);

        return new JsonResponse([
            'token' => $newAccessToken,
            'refresh_token' => $refreshTokenObject->getRefreshToken(),
        ]);
    }
}
