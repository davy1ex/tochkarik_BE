<?php

namespace App\Controller\Api\Private;

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

    /**
     * Constructs a new instance of the class.
     *
     * @param RefreshTokenManagerInterface $refreshTokenManager The refresh token manager.
     * @param JWTTokenManagerInterface     $jwtManager The JWT token manager.
     * @param UserProviderInterface        $userProvider The user provider interface.
     */
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

    /**
     * A description of the entire PHP function.
     *
     * @param Request $request description
     * @throws InvalidArgumentException description of exception
     * @return JsonResponse
     */
    #[Route('/api/token/refresh', name: 'api_token_refresh', methods: ['POST'])]
    public function refresh(Request $request): JsonResponse
    {
        try {
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
        } catch (InvalidArgumentException $e) {
            return new JsonResponse(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'An error occurred'], 500);
        }
    }
}
