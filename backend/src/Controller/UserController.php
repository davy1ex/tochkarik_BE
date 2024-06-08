<?php

namespace App\Controller;

use App\Repository\UserRepository;
use http\Env\Response;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Security;

class UserController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }


    #[Route('/api/user/get_points', name: 'app_user_points', methods: ['GET'])]
    public function get_points(Request $request, UserRepository $userRepository): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $user_id = $request->query->get('user_id');
            if (!$user_id || !is_numeric($user_id)) {
                return $this->json(['error' => 'Invalid user_id'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $user_id = (int) $user_id;
            $currentUser = $this->security->getUser();
            if ($currentUser->getId() !== $user_id) {
                return $this->json(['error' => 'Forbidden'], JsonResponse::HTTP_FORBIDDEN);
            }

            $user = $userRepository->find($user_id);
            if (!$user) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $points = $user->getPoints();
            $pointsData = [];
            foreach ($points as $point) {
                $pointsData[] = [
                    'id' => $point->getId(),
                    'name' => $point->getName(),
                    'coordinates' => $point->getCoordinates(),
                    'timeOfGenerate' => $point->getTimeOfGenerate()->format('Y-m-d H:i:s'),
                    'description' => $point->getDescription(),
                ];
            }

            return $this->json(['points' => $pointsData], 200);
        } catch (\Exception $e) {
            // Логирование ошибки
            $this->get('logger')->error('Error fetching points: ' . $e->getMessage());
            return $this->json(['error' => 'Internal Server Error'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/user/get_user', name: 'app_user_show', methods: ['GET'])]
    public function get_user(Request $request, UserRepository $userRepository): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $user_id = $request->query->get('user_id');
            if (!$user_id || !is_numeric($user_id)) {
                return $this->json(['error' => 'Invalid user_id'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $user_id = (int) $user_id;
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
//            $this->get('logger')->error('Error fetching points: ' . $e->getMessage());
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

}


