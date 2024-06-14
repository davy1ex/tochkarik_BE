<?php
namespace App\Controller;

use App\Entity\Points;
use App\Repository\PointsRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/points')]
class ApiPointController extends AbstractController
{
    #[Route('/add_point', name: 'api_points_add', methods: ['POST'])]
    public function api_add(Request $request, EntityManagerInterface $entityManager, PointsRepository $pointsRepository, UserRepository $userRepository): JsonResponse
    {
//        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
            $data = json_decode($request->getContent(), true);
            $user_id = $data['user_id'];

            if (!$user_id) {
                return $this->json(['error' => 'Incorrect user_id', "user_id" => $user_id, 'name'=>$request->query->get('name')], Response::HTTP_BAD_REQUEST);
            }

            $user_id = (int) $user_id;
            $user = $userRepository->find($user_id);

            if (!$user || !is_numeric($user_id)) {
                return $this->json(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
            }

            $name = $data['name'];
            $coordinates = $data['coordinates'];
            $timeOfGenerate = $data['timeOfGenerate'];

            $point = new Points();
            $point->setName($name);
            $point->setUsername($user);
            $point->setCoordinates($coordinates);
            $point->setTimeOfGenerate(new \DateTimeImmutable($timeOfGenerate));

            $entityManager->persist($point);
            $entityManager->flush();

            return $this->json([
                'status' => 'success',
            ], Response::HTTP_CREATED);
//        } catch (\Exception $e) {
//            $data = json_decode($request->getContent(), true);
//
//            return $this->json(['error' => 'Internal Server Error', 'time' => $data['timeOfGenerate']], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
//        }
    }
}
