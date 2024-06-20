<?php
namespace App\EventListener;

use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessListener
{
    private $refreshTokenManager;

    public function __construct(RefreshTokenManagerInterface $refreshTokenManager)
    {
        $this->refreshTokenManager = $refreshTokenManager;
    }

    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();

        if (!$user instanceof UserInterface) {
            return;
        }

        $refreshTokenValue = bin2hex(random_bytes(64));

        $refreshToken = $this->refreshTokenManager->create();
        $refreshToken->setUsername($user->getUsername());
        $refreshToken->setRefreshToken($refreshTokenValue);
        $refreshToken->setValid((new \DateTime())->add(new \DateInterval('P30D')));  // 30 дней

        $this->refreshTokenManager->save($refreshToken);

        $data['refresh_token'] = $refreshToken->getRefreshToken();
        $data['user_data'] = [
            'user_id' => $user->getId(),
            'username' => $user->getUsername(),
        ];

        $event->setData($data);
    }
}
