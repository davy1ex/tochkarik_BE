<?php

namespace App\EventListener;

use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class       AuthenticationSuccessListener
{
    private $refreshTokenManager;

    public function __construct(RefreshTokenManagerInterface $refreshTokenManager)
    {
        $this->refreshTokenManager = $refreshTokenManager;
    }
    /**
     * @param AuthenticationSuccessEvent $event
     */
    public function onAuthenticationSuccessResponse(AuthenticationSuccessEvent $event)
    {
        $data = $event->getData();
        $user = $event->getUser();

        if (!$user instanceof UserInterface) {
            return;
        }

        $data['user_data'] = [
            'user_id' => $user->getId(),
            'username' => $user->getUsername(),
        ];

        $event->setData($data);
    }
}
