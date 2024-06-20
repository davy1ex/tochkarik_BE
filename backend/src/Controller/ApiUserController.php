<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

#[Route('/api/user')]
class ApiUserController extends AbstractController
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    #[Route('/get_user', name: 'apiUserGet', methods: ['GET'])]
    public function apiUserGet(Request $request, UserRepository $userRepository): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $user_id = $request->query->get('user_id');
            if (!$user_id || !is_numeric($user_id)) {
                return $this->json(['error' => 'Invalid user_id'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $user_id = (int)$user_id;
            $currentUser = $this->security->getUser();
            if ($currentUser->getId() !== $user_id) {
                return $this->json(['error' => 'Forbidden'], JsonResponse::HTTP_FORBIDDEN);
            }

            $user = $userRepository->find($user_id);
            if (!$user) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            return $this->json([
                'username' => $user->getUsername(),
            ]);

        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }
}