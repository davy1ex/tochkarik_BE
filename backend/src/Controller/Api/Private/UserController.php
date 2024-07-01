<?php

namespace App\Controller\Api\Private;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

#[Route('/api/user')]
class UserController extends AbstractController
{
    private Security $security;

    /**
     * Constructs a new instance of the class and initializes the security property.
     *
     * @param Security $security The security service to be used.
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * A description of the entire PHP function.
     *
     * @param Request $request description
     * @param UserRepository $userRepository description
     * @throws \Exception description of exception
     * @return JsonResponse
     */
    #[Route('/current_user', name: 'apiGetCurrentUserGet', methods: ['GET'])]
    public function apiGetCurrentUserGet(Request $request, UserRepository $userRepository): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $currentUser = $this->security->getUser();
            if (!$currentUser) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            return $this->json([
                'username' => $currentUser->getUsername(),
            ]);

        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }
}