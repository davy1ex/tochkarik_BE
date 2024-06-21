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
use Symfony\Component\Security\Core\Security;


#[Route('/api')]
class ApiPointController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    #[Route('/points', name: 'apiGetPoints', methods: ['GET'])]
    public function apiGetPoints(EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $user = $this->security->getUser();
            if (!$user) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $points = $entityManager->getRepository(Points::class)->findBy(['username' => $user]);

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
            return $this->json(['points' => $pointsData], JsonResponse::HTTP_OK);
        } catch (\Doctrine\DBAL\Exception\ConnectionException $e) {
            return $this->json(['error' => 'Database connection error: ' . $e->getMessage()], JsonResponse::HTTP_SERVICE_UNAVAILABLE);
        } catch (\Doctrine\DBAL\Exception $e) {
            return $this->json(['error' => 'Database error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/points', name: 'apiPointCreate', methods: ['POST'])]
    public function apiPointCreate(
        Request                $request,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $data = json_decode($request->getContent(), true);
            $name = $data['name'];
            $coordinates = $data['coordinates'];
            $timeOfGenerate = $data['timeOfGenerate'];

            if (empty($name) || empty($coordinates) || empty($timeOfGenerate)) {
                return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
            }

            $user = $this->security->getUser();
            if (!$user) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

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
        } catch (\Exception $e) {
            $data = json_decode($request->getContent(), true);
            return $this->json(['error' => 'Internal Server Error', 'time' => $data['timeOfGenerate']], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


}
